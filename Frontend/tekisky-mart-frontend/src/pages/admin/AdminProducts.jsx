import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../../services/api";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(
          `/products?page=${page}&limit=10`
        );

        setProducts(data.products || []);
        setPages(data.pages);
      } catch (error) {
        console.error("Failed to load products");
        setProducts([]);
      }
    };

    fetchProducts();
  }, [page]);

  const deleteProductHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;

    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Products</h1>

      {/* TABLE */}
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Image</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Stock</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product._id} className="border-b hover:bg-gray-50">
              <td className="p-3">
                <img
                  src={product.images?.[0] || "/no-image.png"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded"
                />
              </td>

              <td className="p-3 font-medium">{product.name}</td>
              <td className="p-3">₹{product.price}</td>
              <td className="p-3">{product.stock}</td>

              <td className="p-3 flex gap-2">
                <Link
                  to={`/admin/product/${product._id}/edit`}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                >
                  Edit
                </Link>

                <button
                  onClick={() => deleteProductHandler(product._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div className="flex justify-center items-center gap-4 mt-6">
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
  );
};

export default AdminProducts;
