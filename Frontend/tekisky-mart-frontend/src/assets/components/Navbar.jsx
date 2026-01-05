import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import VoiceSearch from "./VoiceSearch";


const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
          <Link to="/cart">🛒 Cart</Link>

          {/* ADMIN BUTTON (IMPORTANT) */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="bg-black text-white px-3 py-1 rounded"
            >
              Admin
            </Link>
          )}

          {user ? (
            <>
              <span className="font-medium">{user.name}</span>
              <button
                onClick={logout}
                className="text-red-500 font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="font-medium">
              Login
            </Link>
          )}
          
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

