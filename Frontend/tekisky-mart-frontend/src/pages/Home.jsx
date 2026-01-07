import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../assets/components/ProductCard";
import Toast from "../assets/components/Toast";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
const Home = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");
  const { user } = useAuth();
useEffect(() => {
  getProducts({}).then((data) => {
    setProducts(data.products); // ✅ extract array
  });
}, []);
  const deleteProductHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Product deleted successfully");
    } catch (error) {
      alert("❌ Failed to delete product");
    }
  };
  useEffect(() => {
    api.get("/products").then((res) => {
      setProducts(res.data.products || []);
    });
  }, []);

  // 🔔 show toast on add to cart
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {/* Toast popup */}
      <Toast message={toast} />

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard
            key={p._id}
            product={p}
            showToast={showToast}
            onDelete={deleteProductHandler} 
          />
        ))}
      </div>
    </>
  );
};

export default Home;
