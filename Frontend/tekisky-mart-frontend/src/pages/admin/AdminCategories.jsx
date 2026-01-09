import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("regular");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchCategories = async () => {
    const { data } = await api.get("/categories");
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("type", type);
    if (type === "trending" && image) {
      formData.append("image", image);
    }

    if (editingId) {
      await api.put(`/categories/${editingId}`, formData);
    } else {
      await api.post("/categories", formData);
    }

    setName("");
    setType("regular");
    setImage(null);
    setEditingId(null);
    fetchCategories();
  };

  const editHandler = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
    setType(cat.type);
    setImage(null);
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  const toggleCategoryType = async (cat) => {
    const newType = cat.type === "trending" ? "regular" : "trending";

    await api.put(`/categories/${cat._id}`, {
      name: cat.name,
      type: newType,
    });

    fetchCategories();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeInUp">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Categories
      </h1>

      {/* FORM */}
      <form
        onSubmit={submitHandler}
        className="bg-white border rounded-xl shadow-sm p-6 mb-10 space-y-4"
      >
        <h2 className="font-semibold text-gray-700">
          {editingId ? "Edit Category" : "Add Category"}
        </h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="regular">Regular Category</option>
          <option value="trending">Trending Category</option>
        </select>

        {type === "trending" && (
          <div className="border rounded-lg p-3 text-sm">
            <label className="block text-gray-600 mb-1">
              Trending Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="text-sm"
            />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95"
        >
          {editingId ? "Update Category" : "Add Category"}
        </button>
      </form>

      {/* CATEGORY LIST */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* INFO */}
            <div className="flex items-center gap-3">
              {cat.type === "trending" && cat.image && (
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
              )}

              <div>
                <p className="font-semibold text-gray-800">
                  {cat.name}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {cat.type} category
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3 text-sm">
              <button
                onClick={() => toggleCategoryType(cat)}
                className={`px-3 py-1.5 rounded-lg border transition ${
                  cat.type === "trending"
                    ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                    : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat.type === "trending"
                  ? "Make Regular"
                  : "Make Trending"}
              </button>

              <button
                onClick={() => editHandler(cat)}
                className="px-3 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition"
              >
                Edit
              </button>

              <button
                onClick={() => deleteHandler(cat._id)}
                className="px-3 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;
