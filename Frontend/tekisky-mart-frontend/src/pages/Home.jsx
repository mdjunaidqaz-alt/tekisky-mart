import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../assets/components/ProductCard";
import Toast from "../assets/components/Toast";
import useAuth from "../hooks/useAuth";
import api from "../services/api";
import QuickCategories from "../assets/components/QuickCategories";
import HeroSlider from "./HeroSlider";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    getProducts({}).then((data) => {
      setProducts(data.products);
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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {/* TOAST */}
      <Toast message={toast} />

      {/* QUICK CATEGORIES */}
      <div className="mt-4">
        <QuickCategories />
      </div>

      {/* HERO SLIDER */}
      <HeroSlider />

      {/* PRODUCTS SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
          Latest Products
        </h2>

        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-4
            sm:gap-6
          "
        >
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              showToast={showToast}
              onDelete={deleteProductHandler}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
