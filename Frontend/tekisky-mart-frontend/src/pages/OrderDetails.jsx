import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`
          }
        }
      );
      setOrder(data);
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-6">Loading invoice...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow">
      <h1 className="text-2xl font-bold mb-4">Order Invoice</h1>

      {/* Order Info */}
      <div className="mb-6">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {order.orderStatus}</p>
      </div>

      {/* Customer Info */}
      <div className="mb-6">
        <h2 className="font-semibold mb-2">Customer</h2>
        <p>{order.user.name}</p>
        <p>{order.user.email}</p>
      </div>

      {/* Items Table */}
      <table className="w-full border mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Product</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.orderItems.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item.product.name}</td>
              <td className="border p-2">{item.qty}</td>
              <td className="border p-2">₹{item.price}</td>
              <td className="border p-2">
                ₹{item.qty * item.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total */}
      <div className="text-right text-xl font-bold">
        Total: ₹{order.totalPrice}
      </div>
    </div>
  );
};

export default OrderDetails;
