import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useAuth from "../../hooks/useAuth";

const ProductCard = ({ product, showToast,onDelete }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const addToCartHandler = () => {
    addToCart(product);
    showToast?.(`Added to cart: ${product.name}`);
  };

  return (
    <div className="relative group border rounded p-3 hover:shadow-lg transition">
      
      {/* Image */}
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-48 object-cover rounded"
      />

      {/* ================= USER VIEW ================= */}
      {user?.role !== "admin" && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-4">
          
          <Link
            to={`/product/${product._id}`}
            className="bg-white px-4 py-2 rounded font-medium"
          >
            👁 View
          </Link>

          {user && (
            <button
              onClick={addToCartHandler}
              className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
            >
              🛒 Add
            </button>
          )}
        </div>
      )}

      {/* ================= ADMIN VIEW ================= */}
      {user?.role === "admin" && (
  <div className="mt-3 flex gap-2">
    <Link
      to={`/admin/product/${product._id}/edit`}
      className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
    >
      ✏️ Edit
    </Link>

    <button
      onClick={() => onDelete(product._id)}
      className="bg-red-600 text-white px-3 py-1 rounded text-sm"
    >
      🗑 Delete
    </button>
  </div>
)}


      {/* Details */}
      <h3 className="mt-2 font-semibold truncate">{product.name}</h3>
      <p className="text-blue-600 font-bold">₹{product.price}</p>
    </div>
  );
};

export default ProductCard;
