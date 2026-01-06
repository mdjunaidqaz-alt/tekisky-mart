import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import VoiceSearch from "./VoiceSearch";
import ProfileDropdown from "./ProfileDropdown";
import { useCart } from "../../context/CartContext";

import { useEffect, useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useCart();
  const [animate, setAnimate] = useState(false);

  // calculate count safely
  const cartCount = cart?.items?.length || cart?.cartItems?.length || 0;

  useEffect(() => {
    if (cartCount > 0) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Tekisky Mart
        </Link>

        {/* Search */}
        <div className="flex items-center gap-2 w-1/2">
          <input
            placeholder="Search products..."
            className="w-full border px-3 py-2 rounded"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate(`/products?keyword=${e.target.value}`);
              }
            }}
          />
          <VoiceSearch />
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
