import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import OrderStatusTracker from "../assets/components/OrderStatusTracker";
import RatingForm from "../assets/components/RatingForm";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const cancelOrderHandler = async () => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      await axios.put(
        `http://localhost:5000/api/orders/${order._id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      alert("Order cancelled successfully");

      setOrder((prev) => ({
        ...prev,
        orderStatus: "Cancelled",
      }));
    } catch (error) {
      alert(error.response?.data?.message || "Order cannot be cancelled");
    }
  };

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order)
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-gray-500">
        Loading invoice...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Order Invoice
        </h1>

        {/* ORDER INFO */}
        <div className="space-y-2 mb-6 text-sm text-gray-700">
          <p>
            <span className="font-semibold">Order ID:</span> #{order._id}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* STATUS TRACKER */}
        <div className="mb-6">
          <OrderStatusTracker status={order.orderStatus} />
        </div>

        {/* DELIVERY INFO */}
        {order.estimatedDeliveryDate &&
          order.orderStatus !== "Delivered" && (
            <p className="mb-4 text-green-700 font-medium text-sm">
              🚚 Estimated Delivery:{" "}
              {new Date(order.estimatedDeliveryDate).toDateString()}
            </p>
          )}

        {order.orderStatus === "Delivered" && (
          <p className="mb-4 text-green-700 font-semibold text-sm">
            ✅ Delivered Successfully
          </p>
        )}

        {/* STATUS BADGE */}
        <div className="mb-6">
          <span
            className={`inline-block px-4 py-1 rounded-full text-xs font-semibold ${
              order.orderStatus === "Cancelled"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>

        {/* CANCEL BUTTON */}
        {["Pending", "Processing"].includes(order.orderStatus) && (
          <button
            onClick={cancelOrderHandler}
            className="
              mb-6
              bg-red-600
              text-white
              px-5
              py-2
              rounded-lg
              text-sm
              hover:bg-red-700
              transition
            "
          >
            Cancel Order
          </button>
        )}

        {/* ⭐ RATING */}
        {order.orderStatus === "Delivered" && (
          <div className="mt-8 border-t pt-6 space-y-4">
            

            {order.orderItems.map((item) => (
              <RatingForm
                key={item.product?._id}
                productId={item.product?._id}
              />
            ))}
          </div>
        )}

        {/* CUSTOMER INFO */}
        <div className="mt-8 border-t pt-6 text-sm">
          <h2 className="font-semibold mb-2 text-gray-800">
            Customer
          </h2>
          <p>{order.user?.name || "Customer"}</p>
          <p className="text-gray-600">
            {order.user?.email || "N/A"}
          </p>
        </div>

        {/* ITEMS TABLE */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2 text-left">Qty</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {order.orderItems.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    {item.product?.name || "Product removed"}
                  </td>
                  <td className="px-4 py-2">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-2">
                    ₹{item.product?.price ?? item.price}
                  </td>
                  <td className="px-4 py-2 font-medium">
                    ₹
                    {item.quantity *
                      (item.product?.price ?? item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTAL */}
        <div className="mt-6 text-right text-lg font-bold">
          Total: ₹{order.totalPrice}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
