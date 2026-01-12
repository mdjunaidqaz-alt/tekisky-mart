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
    // navigate("/admin/products");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fadeInUp">
      <div className="bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Edit Product
        </h1>

        {/* EXISTING IMAGES */}
        {productImages.length > 0 && (
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-600 mb-2">
              Current Images
            </p>
            <div className="flex flex-wrap gap-3">
              {productImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="product"
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
                />
              ))}
            </div>
          </div>
        )}

        <form onSubmit={submitHandler} className="space-y-4">

          {/* IMAGE UPLOAD */}
          <div className="border rounded-lg p-3 text-sm">
            <label className="block text-gray-600 mb-1">
              Upload New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
              className="text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Uploading new images will replace existing ones
            </p>
          </div>

          {/* PRODUCT NAME */}
          <input
            className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product Name"
          />

          {/* PRICE & STOCK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
            />

            <input
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="Stock"
            />
          </div>

          {/* DESCRIPTION */}
          <textarea
            className="w-full border rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />

          {/* CATEGORY */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
