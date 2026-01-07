import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import ProductCard from "../assets/components/ProductCard";
import Toast from "../assets/components/Toast";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [toast, setToast] = useState("");

useEffect(() => {
  getProducts({}).then((data) => {
    setProducts(data.products); // ✅ extract array
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
          />
        ))}
      </div>
    </>
  );
};

export default Home;
