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
              Authorization: `Bearer ${userInfo.token}`,
            },
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
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeInUp">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Admin Dashboard
      </h1>

      {/* STATS CARDS */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Users" value={stats.users} />
          <StatCard title="Products" value={stats.products} />
          <StatCard title="Orders" value={stats.orders} />
          <StatCard title="Revenue" value={`₹${stats.revenue}`} />
        </div>
      )}

      {/* ADMIN ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardLink to="/admin/add-product" label="➕ Add Product" />
        <DashboardLink to="/admin/products" label="📦 Manage Products" />
        <DashboardLink to="/admin/categories" label="📂 Manage Categories" />
        <DashboardLink to="/admin/banners" label="🖼 Manage Banners" />
        <DashboardLink to="/admin/orders" label="📦 View Orders" />
        <DashboardLink to="/admin/users" label="👥 View Customers" />
        <DashboardLink to="/admin/ratings" label="⭐ Product Ratings" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
    <h3 className="text-sm text-gray-500 uppercase tracking-wide">
      {title}
    </h3>
    <p className="text-3xl font-bold mt-3 text-gray-800">
      {value}
    </p>
  </div>
);

const DashboardLink = ({ to, label }) => (
  <Link
    to={to}
    className="flex items-center justify-between bg-white border rounded-xl p-5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:shadow-sm transition"
  >
    <span>{label}</span>
    <span className="text-gray-400">→</span>
  </Link>
);

export default Dashboard;
