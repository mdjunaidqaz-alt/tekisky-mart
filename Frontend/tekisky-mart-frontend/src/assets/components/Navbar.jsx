import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import VoiceSearch from "./VoiceSearch";
import ProfileDropdown from "./ProfileDropdown";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);
  // 🔍 Search state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // calculate count safely
  const cartCount = cart?.items?.length || cart?.cartItems?.length || 0;

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products/suggestions?q=${query}`);
        setSuggestions(data);
        setActiveIndex(-1);
      } catch (error) {
        console.error("Search suggestion error", error);
      }
    }, 300); // ✅ optimized debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (text) => {
    if (!text.trim()) return;
    setSuggestions([]);
    navigate(`/products?keyword=${text}`);
  };

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products/suggestions?q=${query}`);
        setSuggestions(data);
        setActiveIndex(-1);
      } catch (error) {
        console.error("Search suggestion error", error);
      }
    }, 300); // ✅ optimized debounce

    return () => clearTimeout(timer);
  }, [query]);

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    }

    if (e.key === "Enter") {
      const selected = activeIndex >= 0 ? suggestions[activeIndex].name : query;

      handleSearch(selected);
    }
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Tekisky Mart
        </Link>

        {/* Search */}
        <div className="relative flex items-center gap-2 w-1/2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-full border px-3 py-2 rounded"
          />

          <VoiceSearch />

          {/* 🔽 Suggestions */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 w-full bg-white border rounded shadow z-50">
              {suggestions.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => handleSearch(item.name)}
                  className={`px-3 py-2 cursor-pointer ${
                    index === activeIndex ? "bg-blue-100" : "hover:bg-gray-100"
                  }`}
                >
                  {highlightMatch(item.name, query)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Menu */}
        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative">
            🛒Cart
            {cartCount > 0 && (
              <span
                className={`
        absolute -top-2 -right-2
        bg-red-600 text-white
        text-xs w-5 h-5
        flex items-center justify-center
        rounded-full
        ${animate ? "animate-bounce-scale" : ""}
      `}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* ADMIN BUTTON (IMPORTANT) */}
          {user?.role === "admin" && (
            <Link to="/admin" className="bg-black text-white px-3 py-1 rounded">
              Admin
            </Link>
          )}

          {user ? (
            <>
              <ProfileDropdown user={user} onLogout={logout} />
            </>
          ) : (
            <Link to="/login" className="font-medium">
              Login
            </Link>
          )}
          {user && <Link to="/my-orders">📦 My Orders</Link>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
