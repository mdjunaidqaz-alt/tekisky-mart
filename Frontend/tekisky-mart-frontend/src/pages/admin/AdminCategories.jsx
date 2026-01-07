import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
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

    if (editingId) {
      await api.put(`/categories/${editingId}`, { name });
    } else {
      await api.post("/categories", { name });
    }

    setName("");
    setEditingId(null);
    fetchCategories();
  };

  const editHandler = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await api.delete(`/categories/${id}`);
    fetchCategories();
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      {/* Add / Edit */}
      <form onSubmit={submitHandler} className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border p-2 flex-1"
          required
        />
        <button className="bg-blue-600 text-white px-4 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* Category List */}
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="flex justify-between items-center border p-2 mb-2"
        >
          <span>{cat.name}</span>
          <div className="space-x-3">
            <button
              onClick={() => editHandler(cat)}
              className="text-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => deleteHandler(cat._id)}
              className="text-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCategories;
