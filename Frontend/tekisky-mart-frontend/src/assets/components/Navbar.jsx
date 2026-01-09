import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import VoiceSearch from "./VoiceSearch";
import ProfileDropdown from "./ProfileDropdown";
import { useCart } from "../../context/CartContext";
import { useEffect, useState } from "react";
import api from "../../services/api";

const Navbar = () => {
  // 🔍 Search state
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const highlightMatch = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "ig");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-bold text-blue-600">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);

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

    setQuery(text);
    setSuggestions([]);
    setActiveIndex(-1);

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
    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
      return;
    }

    if (e.key === "Enter") {
      // 🔥 AUTO-SELECT TOP SUGGESTION
      if (suggestions.length > 0) {
        const selected =
          activeIndex >= 0
            ? suggestions[activeIndex].name
            : suggestions[0].name; // 👈 KEY FIX

        handleSearch(selected);
      } else {
        handleSearch(query);
      }
    }
  };

return (
  <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
    <div className="max-w-7xl mx-auto px-4 py-3">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] items-center gap-4">
        
        {/* LOGO */}
        <Link to="/" className="flex justify-center md:justify-start">
          <img
            src="/logo.png"
            alt="Tekisky Mart"
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>

        {/* SEARCH */}
        <div className="relative w-full md:max-w-xl md:mx-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search for products, brands & more"
            className="w-full rounded-full border border-gray-300 pl-4 pr-12 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* MIC */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <VoiceSearch />
          </div>

          {/* SUGGESTIONS */}
          {suggestions.length > 0 && (
            <div className="absolute top-12 left-0 w-full bg-white rounded-xl shadow-lg border overflow-hidden z-50">
              {suggestions.map((item, index) => (
                <div
                  key={item._id}
                  onClick={() => handleSearch(item.name)}
                  className={`px-4 py-2 cursor-pointer text-sm transition ${
                    index === activeIndex
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {highlightMatch(item.name, query)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT MENU */}
        <div className="flex justify-center md:justify-end items-center gap-3 text-sm font-medium">
          {user?.role !== "admin" && (
            <Link
              to="/cart"
              className="relative flex items-center gap-1 hover:text-blue-600 transition"
            >
              🛒 <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span
                  className={`absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ${
                    animate ? "animate-bounce-scale" : ""
                  }`}
                >
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="rounded-full bg-black text-white px-3 py-1.5 hover:bg-gray-800 transition"
            >
              Admin
            </Link>
          )}

          {user ? (
            <ProfileDropdown user={user} onLogout={logout} />
          ) : (
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-full border hover:bg-gray-100 transition"
            >
              Login
            </Link>
          )}

          {user && user.role !== "admin" && (
            <Link
              to="/my-orders"
              className="hidden sm:block hover:text-blue-600 transition"
            >
              📦 My Orders
            </Link>
          )}
        </div>

      </div>
    </div>
  </nav>
);


};

export default Navbar;
