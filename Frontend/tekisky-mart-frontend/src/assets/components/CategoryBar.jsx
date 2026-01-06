import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CategoryBar = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("http://localhost:5000/api/categories");
      setCategories(data);
    };
    fetchCategories();
  }, []);

  return (
    <div className="flex gap-4 p-4 overflow-x-auto bg-gray-100">
      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => navigate(`/products?category=${cat._id}`)}
          className="px-4 py-2 bg-white border rounded hover:bg-blue-600 hover:text-white"
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
