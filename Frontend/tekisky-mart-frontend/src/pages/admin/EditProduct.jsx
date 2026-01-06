import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [productImages, setProductImages] = useState([]);
  const [images, setImages] = useState(null);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("http://localhost:5000/api/categories");
      setCategories(data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      setName(data.name);
      setPrice(data.price);
      setStock(data.stock);
      setDescription(data.description);
      setProductImages(data.images || []);
    };

    fetchProduct();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("category", category);


    if (images) {
      for (let i = 0; i < images.length; i++) {
        formData.append("images", images[i]);
      }
    }

    await axios.put(`http://localhost:5000/api/products/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Product updated successfully");
    navigate("/admin/products");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <div className="flex gap-3 mb-4">
        {productImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="product"
            className="w-20 h-20 object-cover rounded border"
          />
        ))}
      </div>

      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(e.target.files)}
          className="w-full border p-2"
        />
        <p className="text-sm text-gray-500">
          Uploading new images will replace existing ones
        </p>

        <input
          className="w-full border p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
        />

        <input
          className="w-full border p-2"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
        />

        <input
          className="w-full border p-2"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
        />

        <textarea
          className="w-full border p-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
