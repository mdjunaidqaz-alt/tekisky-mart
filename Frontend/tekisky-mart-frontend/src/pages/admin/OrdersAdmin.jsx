import { useEffect, useState, React } from "react";
import axios from "axios";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const updateDeliveryDate = async (orderId, date) => {
    await axios.put(
      `http://localhost:5000/api/admin/orders/${orderId}/delivery`,
      { date },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    setOrders((prev) =>
      prev.map((order) =>
        order._id === orderId
          ? { ...order, estimatedDeliveryDate: date }
          : order
      )
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        All Orders
      </h1>

      {/* RESPONSIVE TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow border">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Order Details</th>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">🛒 Products</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Est. Delivery</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {orders.map((order) => (
              <>
                {/* MAIN ROW */}
                <tr
                  key={order._id}
                  className="align-top hover:bg-gray-50 transition"
                >
                  <td className="p-3">
                    <p className="font-semibold text-gray-800">
                      #{order._id}
                    </p>

                    <div className="mt-2 text-xs text-gray-600 space-y-0.5">
                      <p className="font-medium">📍 Delivery Address</p>
                      <p>{order.shippingAddress?.fullName}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>
                        {order.shippingAddress?.city} –{" "}
                        {order.shippingAddress?.pincode}
                      </p>
                      <p>📞 {order.shippingAddress?.phone}</p>
                    </div>
                  </td>

                  <td className="p-3">
                    <p className="font-medium text-gray-800">
                      {order.user?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.user?.email}
                    </p>
                  </td>

                  <td className="p-3 font-semibold">
                    ₹{order.totalPrice}
                  </td>

                  {/* PRODUCTS */}
                  <td className="p-3">
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div
                          key={item.product?._id}
                          className="flex items-center gap-3"
                        >
                          <img
                            src={item.product?.images?.[0]}
                            alt={item.product?.name}
                            className="w-12 h-12 rounded-lg object-cover border"
                          />

                          <div>
                            <p className="font-medium text-gray-800">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              ₹{item.price} × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) =>
                        updateStatus(order._id, e.target.value)
                      }
                      className="w-full border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <input
                      type="date"
                      value={
                        order.estimatedDeliveryDate
                          ? order.estimatedDeliveryDate.split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        updateDeliveryDate(order._id, e.target.value)
                      }
                      className="border rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersAdmin;
