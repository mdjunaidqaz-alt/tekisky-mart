import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get("http://localhost:5000/api/products");
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const deleteProductHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeInUp">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Admin Products
      </h1>

      {/* TABLE WRAPPER (RESPONSIVE) */}
      <div className="overflow-x-auto bg-white border rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                Description
              </th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Stock</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {products.map((product) => (
              <tr
                key={product._id}
                className="hover:bg-gray-50 transition"
              >
                {/* IMAGE */}
                <td className="px-4 py-3">
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </td>

                {/* NAME */}
                <td className="px-4 py-3 font-medium text-gray-800">
                  {product.name}
                </td>

                {/* DESCRIPTION (HIDDEN ON MOBILE) */}
                <td className="px-4 py-3 text-gray-600 max-w-xs hidden md:table-cell">
                  {product.description}
                </td>

                {/* PRICE */}
                <td className="px-4 py-3 font-medium">
                  ₹{product.price}
                </td>

                {/* STOCK */}
                <td className="px-4 py-3">
                  {product.stock}
                </td>

                {/* ACTIONS */}
                <td className="px-4 py-3">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to={`/admin/product/${product._id}/edit`}
                      className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-center text-sm hover:bg-yellow-600 transition"
                    >
                      ✏️ Edit
                    </Link>

                    <button
                      onClick={() =>
                        deleteProductHandler(product._id)
                      }
                      className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition"
                    >
                      ❌ Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
