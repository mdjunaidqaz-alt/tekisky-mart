import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import useAuth from "../../hooks/useAuth";

const ProductCard = ({ product, showToast, onDelete }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();

  // 🔢 Discount calculation
  const discountedPrice =
    product.discount > 0
      ? product.price - (product.price * product.discount) / 100
      : product.price;

  const addToCartHandler = () => {
    addToCart(product);
    showToast && showToast(`Added to cart: ${product.name}`);
  };

  const deleteHandler = () => {
    if (!onDelete) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      onDelete(product._id);
    }
  };

return (
  <div className="relative group bg-white border rounded-xl p-3 transition hover:shadow-xl hover:-translate-y-1">
    
    {/* IMAGE */}
    <div className="relative overflow-hidden rounded-lg">
      <img
        src={product.images?.[0]}
        alt={product.name}
        className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* 🔥 STOCK BADGE */}
      {product.stock === 0 && (
        <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full">
          Out of Stock
        </span>
      )}

      {/* ⭐ RATING */}
      {product.averageRating > 0 && (
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-semibold text-yellow-600 shadow">
          ⭐ {product.averageRating.toFixed(1)}
        </div>
      )}

      {/* ================= USER VIEW ACTIONS ================= */}
      {user?.role !== "admin" && (
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
          <Link
            to={`/product/${product._id}`}
            className="bg-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-100 transition"
          >
            👁 View
          </Link>

          {user && product.stock > 0 && (
            <button
              onClick={addToCartHandler}
              className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition"
            >
              🛒 Add
            </button>
          )}
        </div>
      )}
    </div>

    {/* ================= ADMIN VIEW ================= */}
    {user?.role === "admin" && (
      <div className="mt-3 flex gap-2">
        <Link
          to={`/admin/product/${product._id}/edit`}
          className="flex-1 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm text-center hover:bg-blue-700 transition"
        >
          ✏️ Edit
        </Link>

        <button
          onClick={deleteHandler}
          className="flex-1 bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition"
        >
          🗑 Delete
        </button>
      </div>
    )}

    {/* DETAILS */}
    <h3 className="mt-3 font-semibold text-sm text-gray-800 truncate">
      {product.name}
    </h3>

    {/* PRICE */}
    {product.discount > 0 ? (
      <div className="mt-1">
        <p className="text-xs text-gray-400 line-through">
          ₹{product.price}
        </p>
        <p className="text-green-600 font-bold text-lg leading-tight">
          ₹{discountedPrice.toFixed(0)}
          <span className="text-xs ml-1 font-medium text-green-700">
            ({product.discount}% OFF)
          </span>
        </p>
      </div>
    ) : (
      <p className="mt-1 text-blue-600 font-bold text-lg">
        ₹{product.price}
      </p>
    )}
  </div>
);

};

export default ProductCard;
