import { useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

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
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        🚫 Cart is available only for customers.
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-500">
        <p className="text-2xl mb-2">🛒</p>
        <p className="text-lg font-medium">Your cart is empty</p>
        <Link
          to="/products"
          className="mt-4 text-blue-600 hover:underline"
        >
          Continue shopping →
        </Link>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Your Cart
      </h1>

      {/* CART ITEMS */}
      <div className="bg-white border rounded-xl shadow-sm divide-y">
        {cart.items
          .filter((item) => item.product)
          .map((item) => (
            <div
              key={item.product._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 hover:bg-gray-50 transition"
            >
              {/* PRODUCT INFO */}
              <div className="flex items-center gap-4">
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {item.product.name}
                  </p>

                  <p className="text-sm text-gray-500">
                    ₹{item.product.price} × {item.quantity}
                  </p>

                  <Link
                    to={`/product/${item.product._id}`}
                    state={{ from: "cart" }}
                    className="inline-block mt-1 text-sm text-blue-600 hover:underline"
                  >
                    👁 View product
                  </Link>
                </div>
              </div>

              {/* PRICE & QUANTITY */}
              <div className="flex items-center justify-between sm:justify-end gap-6">
                <p className="font-bold text-gray-800">
                  ₹{item.product.price * item.quantity}
                </p>

                {/* QUANTITY CONTROLS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity - 1)
                    }
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 transition"
                  >
                    −
                  </button>

                  <span className="min-w-[20px] text-center font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.product._id, item.quantity + 1)
                    }
                    className="w-8 h-8 flex items-center justify-center border rounded-full hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* CART FOOTER */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border rounded-xl p-4 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800">
          Total: ₹{totalPrice}
        </h2>

        <button
          onClick={() => navigate("/checkout")}
          className="bg-green-600 text-white px-8 py-2.5 rounded-lg font-medium hover:bg-green-700 transition active:scale-95"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
