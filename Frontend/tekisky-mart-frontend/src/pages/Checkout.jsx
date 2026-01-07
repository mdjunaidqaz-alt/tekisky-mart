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
    phone: "",
    location: null
  });

  // 📍 USE CURRENT LOCATION (NO GOOGLE API)
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setForm((prev) => ({
          ...prev,
          address: `Lat: ${latitude}, Lng: ${longitude}`,
          location: { lat: latitude, lng: longitude }
        }));
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

  const submitOrder = async () => {
    try {
      await placeOrder({
        shippingAddress: form
      });

      await fetchCart(); // clear cart
      navigate("/my-orders");
    } catch (error) {
      console.error(error);
      alert("Order failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">
        Checkout (Cash on Delivery)
      </h2>

      {Object.keys(form).map(
        (key) =>
          key !== "location" && (
            <input
              key={key}
              placeholder={key.toUpperCase()}
              className="w-full border p-2 mb-3"
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
            />
          )
      )}

      {/* 📍 LOCATION BUTTON */}
      <button
        type="button"
        onClick={useCurrentLocation}
        className="w-full border border-blue-600 text-blue-600 py-2 rounded mb-3"
      >
        📍 Use Current Location
      </button>

      {form.location && (
        <p className="text-sm text-green-600 mb-3">
          Location captured successfully
        </p>
      )}

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
