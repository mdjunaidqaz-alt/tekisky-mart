import { useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
const Cart = () => {
  const { cart, fetchCart, removeItem, updateQuantity } =
    useContext(CartContext);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCart();
  }, []);

  if (user?.role === "admin") {
    return (
      <div className="p-6 text-center text-gray-600">
        🚫 Cart is available only for customers.
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        🛒 Your cart is empty
      </div>
    );
  }

  // 🔢 calculate total
  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items
        .filter((item) => item.product) // ✅ safety
        .map((item) => (
          <div
            key={item.product._id}
            className="flex items-center justify-between border-b py-4"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4">
              <img
                src={item.product.images?.[0]}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded"
              />

              <div>
                <p className="font-semibold">{item.product.name}</p>

                <p className="text-sm text-gray-600">
                  ₹{item.product.price} × {item.quantity}
                </p>

                {/* 👁 VIEW BUTTON */}
                <Link
                  to={`/product/${item.product._id}`}
                  state={{ from: "cart" }} // 👈 IMPORTANT
                  className="text-blue-600 text-sm hover:underline"
                >
                  👁 View
                </Link>
              </div>
            </div>

            {/* Price + Quantity */}
            <div className="flex items-center gap-6">
              <p className="font-bold">₹{item.product.price * item.quantity}</p>

              {/* ➖ ➕ Quantity Controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity - 1)
                  }
                  className="px-2 py-1 border rounded"
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item.product._id, item.quantity + 1)
                  }
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">Total: ₹{totalPrice}</h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
