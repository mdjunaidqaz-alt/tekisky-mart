import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminRatings = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products/admin/ratings").then((res) => {
      setProducts(res.data);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeInUp">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        Product Ratings & Reviews
      </h1>

      {products.map((product) => (
        <div
          key={product._id}
          className="bg-white border rounded-xl shadow-sm mb-8 overflow-hidden"
        >
          {/* PRODUCT HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-800">
              {product.name}
            </h2>

            <span className="text-sm font-medium text-yellow-600">
              ⭐ Average Rating: {product.averageRating.toFixed(1)}
            </span>
          </div>

          {/* RATINGS */}
          <div className="px-6 py-4">
            {product.ratings.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No ratings yet
              </p>
            ) : (
              <div className="space-y-4">
                {product.ratings.map((r, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="font-medium text-gray-800">
                        {r.user?.name}
                      </p>
                      <span className="text-sm text-yellow-600 font-semibold">
                        ⭐ {r.rating}
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 mt-1">
                      {r.user?.email}
                    </p>

                    {r.comment && (
                      <p className="mt-2 text-sm italic text-gray-700">
                        “{r.comment}”
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRatings;
