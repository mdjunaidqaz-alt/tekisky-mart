import { useState } from "react";
import api from "../../services/api";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    category: ""
  });

  const [images, setImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length > 3) {
      alert("Maximum 3 images allowed");
      return;
    }

    const formData = new FormData();

    // text fields
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    // image files
    for (let i = 0; i < images.length; i++) {
      formData.append("images", images[i]);
    }

    try {
      await api.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("✅ Product added successfully");

      // reset form
      setForm({
        name: "",
        description: "",
        price: "",
        discount: "",
        stock: "",
        category: ""
      });
      setImages([]);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Product Name" className="input" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input" />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="input" />
        <input name="discount" value={form.discount} onChange={handleChange} placeholder="Discount %" className="input" />
        <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" className="input" />
        <input name="category" value={form.category} onChange={handleChange} placeholder="Category ID" className="input" />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
