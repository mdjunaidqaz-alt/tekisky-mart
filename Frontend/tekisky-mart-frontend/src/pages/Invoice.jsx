import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const Invoice = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => setOrder(res.data));
  }, [id]);

  if (!order) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow">
      <h1 className="text-2xl font-bold mb-4">Invoice</h1>
      {order.orderItems.map((i) => (
        <div key={i.product} className="flex justify-between">
          <span>{i.name} x {i.quantity}</span>
          <span>₹{i.price * i.quantity}</span>
        </div>
      ))}
      <hr className="my-4" />
      <div className="text-right font-bold">Total: ₹{order.totalPrice}</div>
    </div>
  );
};

export default Invoice;
