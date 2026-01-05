import { useEffect, useState } from "react";
import axios from "axios";

const statusOptions = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled"
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await axios.get(
        "http://localhost:5000/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      setOrders(data);
    };

    fetchOrders();
  }, []);

  // 🔥 UPDATE ORDER STATUS
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );

      // update UI instantly
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId
            ? { ...order, orderStatus: status }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update order status");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Orders</h1>

      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Date</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="border p-2">{order._id}</td>

              <td className="border p-2">
                {order.user?.name} <br />
                <small>{order.user?.email}</small>
              </td>

              <td className="border p-2">₹{order.totalPrice}</td>

              {/* 🔽 STATUS DROPDOWN */}
              <td className="border p-2">
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                  className="border p-1 rounded"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border p-2">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
