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
    location: null,
  });

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;

      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
          import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        }`
      );

      const data = await res.json();
      const address = data.results?.[0]?.formatted_address || "";

      setForm((prev) => ({
        ...prev,
        address: address,
        location: {
          lat: latitude,
          lng: longitude,
        },
      }));
    });
  };

  const submitOrder = async () => {
    if (!form.address || form.address.trim() === "") {
      alert("Please enter delivery address or use current location");
      return;
    }

    if (!form.phone || form.phone.trim() === "") {
      alert("Please enter phone number");
      return;
    }

    try {
      await placeOrder({
        shippingAddress: form,
      });

      await fetchCart();
      navigate("/my-orders");
    } catch (error) {
      alert("Order failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">
          Checkout
          <span className="block text-sm font-normal text-gray-500 mt-1">
            Cash on Delivery
          </span>
        </h2>

        {/* FORM FIELDS */}
        <div className="space-y-4">
          {Object.keys(form).map(
            (key) =>
              key !== "location" && (
                <input
                  key={key}
                  placeholder={key.toUpperCase()}
                  className="
                    w-full
                    border
                    rounded-lg
                    px-3
                    py-2.5
                    text-sm
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                  value={form[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: e.target.value })
                  }
                />
              )
          )}
        </div>

        {/* LOCATION BUTTON */}
        <button
          type="button"
          onClick={useCurrentLocation}
          className="
            w-full
            mt-5
            border
            border-blue-600
            text-blue-600
            py-2.5
            rounded-lg
            font-medium
            hover:bg-blue-50
            transition
          "
        >
          📍 Use Current Location
        </button>

        {form.location && (
          <p className="text-sm text-green-600 mt-3">
            ✅ Location captured successfully
          </p>
        )}

        {/* SUBMIT */}
        <button
          onClick={submitOrder}
          className="
            mt-6
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-lg
            font-medium
            hover:bg-blue-700
            transition
            active:scale-95
          "
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
