import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/my",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyOrders();
  }, []);

  const cancelOrderHandler = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/orders/${orderId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? data.order : order
        )
      );
    } catch (error) {
      alert(
        error.response?.data?.message || "Order cannot be cancelled"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
          No orders found
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium text-gray-800">
                    #{order._id}
                  </td>

                  <td className="px-4 py-3 font-semibold">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === "Cancelled"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      View
                    </Link>

                    {/* CANCEL BUTTON (LOGIC KEPT COMMENTED AS IS) */}
                    {/* {["Pending", "Processing"].includes(order.orderStatus) && (
                      <button
                        onClick={() => cancelOrderHandler(order._id)}
                        className="ml-3 text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    )} */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
