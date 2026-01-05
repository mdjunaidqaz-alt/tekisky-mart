import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productService";
import ProductCard from "../assets/components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [params] = useSearchParams();

  useEffect(() => {
    getProducts({ keyword: params.get("keyword") }).then(setProducts);
  }, [params]);

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
};

export default Products;
