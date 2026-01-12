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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const { user } = useAuth();

  // ✅ SINGLE SOURCE OF TRUTH
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts({ page });
      setProducts(data.products);
      setPages(data.pages);
    };

    fetchProducts();
  }, [page]);

  const deleteProductHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      alert("✅ Product deleted successfully");
    } catch {
      alert("❌ Failed to delete product");
    }
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  return (
    <>
      {/* TOAST */}
      <Toast message={toast} />

      {/* QUICK CATEGORIES */}
      <div className="max-w-7xl mx-auto px-4 mt-4">
        <QuickCategories />
      </div>

      {/* HERO SLIDER */}
      <HeroSlider />

      {/* PRODUCTS */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
          Latest Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              showToast={showToast}
              onDelete={deleteProductHandler}
            />
          ))}
        </div>

        {/* ✅ PAGINATION */}
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            ← Prev
          </button>

          <span className="font-medium">
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            Next →
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
