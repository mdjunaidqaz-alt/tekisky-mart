import { useEffect } from "react";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link } from "react-router-dom";

const Cart = () => {
  const { cart, fetchCart } = useContext(CartContext);

  useEffect(() => {
    fetchCart();
  }, []);

  if (!cart) return null;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {cart.items.map((item) => (
        <div key={item.product._id} className="flex justify-between py-2">
          <span>{item.product.name}</span>
          <span>Qty: {item.quantity}</span>
        </div>
      ))}
      <Link
        to="/checkout"
        className="block mt-4 bg-green-600 text-white text-center py-2 rounded"
      >
        Checkout
      </Link>
    </div>
  );
};

export default Cart;
