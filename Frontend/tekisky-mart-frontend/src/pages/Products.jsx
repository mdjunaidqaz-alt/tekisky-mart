import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../assets/components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();

  const keyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";

  useEffect(() => {
    getProducts({ keyword, category }).then((data) => {
      setProducts(data.products);
    });
  }, [keyword, category]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      {products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
