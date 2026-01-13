import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminRatings = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const { data } = await api.get(
          `/products/admin/ratings?page=${page}`
        );

        setProducts(data.products);
        setPages(data.pages);
      } catch (error) {
        console.error("Failed to load ratings");
      }
    };

    fetchRatings();
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">
        Product Ratings & Reviews
      </h1>

      {products.map((product) => (
        <div key={product._id} className="mb-8 border rounded-xl">
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <h2 className="font-semibold">{product.name}</h2>
            <span className="text-yellow-600">
              ⭐ {product.averageRating.toFixed(1)}
            </span>
          </div>

          <div className="p-6 space-y-4">
            {product.ratings.length === 0 ? (
              <p>No ratings yet</p>
            ) : (
              product.ratings.map((r, i) => (
                <div key={i} className="border p-4 rounded">
                  <p className="font-medium">
                    {r.user?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {r.user?.email}
                  </p>
                  <p className="text-yellow-600">⭐ {r.rating}</p>
                  {r.comment && (
                    <p className="italic">“{r.comment}”</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      {/* PAGINATION */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 border rounded"
        >
          ← Prev
        </button>

        <span>
          Page {page} of {pages}
        </span>

        <button
          disabled={page === pages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 border rounded"
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default AdminRatings;
