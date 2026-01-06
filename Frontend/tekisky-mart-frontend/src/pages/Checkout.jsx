import { useState } from "react";
import { placeOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    city: "",
    pincode: "",
    phone: ""
  });

  const submitOrder = async () => {
    try {
      const order = await placeOrder({
        shippingAddress: form
      });

      await fetchCart(); // refresh cart after clearing
      navigate(`/order-success/${order._id}`);
    } catch (error) {
      alert("Order failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Checkout (Cash on Delivery)</h2>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key.toUpperCase()}
          className="w-full border p-2 mb-3"
          value={form[key]}
          onChange={(e) =>
            setForm({ ...form, [key]: e.target.value })
          }
        />
      ))}

      <button
        onClick={submitOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
