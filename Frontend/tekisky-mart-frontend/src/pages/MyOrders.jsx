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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="border p-2">{order._id}</td>
                <td className="border p-2">₹{order.totalPrice}</td>
                <td className="border p-2">{order.orderStatus}</td>
                <td className="border p-2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="border p-2">
                  <Link to={`/order/${order._id}`} className="text-blue-600">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
