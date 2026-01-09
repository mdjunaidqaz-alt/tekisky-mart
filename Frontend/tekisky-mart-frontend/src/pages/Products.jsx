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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* PAGE TITLE */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Products
        </h1>
        {(keyword || category) && (
          <p className="text-sm text-gray-500 mt-1">
            Showing results
            {keyword && (
              <span>
                {" "}
                for <span className="font-medium">“{keyword}”</span>
              </span>
            )}
          </p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
          No products found
        </div>
      ) : (
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            gap-4
          "
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
