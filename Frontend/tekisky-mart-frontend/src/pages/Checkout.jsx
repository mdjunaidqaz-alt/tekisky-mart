import { placeOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();

  const submitOrder = async () => {
    await placeOrder({
      shippingAddress: {
        fullName: "Customer",
        address: "Address",
        city: "City",
        pincode: "000000",
        phone: "9999999999"
      }
    });
    navigate("/orders");
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Cash on Delivery</h2>
      <button
        onClick={submitOrder}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;
