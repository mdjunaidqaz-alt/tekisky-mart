import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`
            }
          }
        );
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS CARDS */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Users" value={stats.users} />
          <StatCard title="Products" value={stats.products} />
          <StatCard title="Orders" value={stats.orders} />
          <StatCard title="Revenue" value={`₹${stats.revenue}`} />
        </div>
      )}

      {/* ADMIN ACTIONS */}
      <div className="space-y-4">
        <Link
          to="/admin/add-product"
          className="block text-blue-600 font-medium"
        >
          ➕ Add Product
        </Link>

        <Link
          to="/admin/users"
          className="block text-blue-600 font-medium"
        >
          👥 View Customers
        </Link>

        <Link
          to="/admin/orders"
          className="block text-blue-600 font-medium"
        >
          📦 View Orders
        </Link>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white shadow rounded p-6 text-center">
    <h3 className="text-gray-500">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default Dashboard;
