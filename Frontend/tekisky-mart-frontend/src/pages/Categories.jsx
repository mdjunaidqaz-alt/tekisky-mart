import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRegularCategories = async () => {
      try {
        const { data } = await api.get("/categories/regular");
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories");
      }
    };

    fetchRegularCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">
        All Categories
      </h1>

      {categories.length === 0 ? (
        <div className="min-h-[40vh] flex items-center justify-center text-gray-500">
          No categories found
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {categories.map((cat) => (
            <div
              key={cat._id}
              onClick={() =>
                navigate(`/products?category=${cat._id}`)
              }
              className="
                cursor-pointer
                bg-white
                border
                rounded-xl
                p-6
                text-center
                font-medium
                text-gray-700
                hover:shadow-lg
                hover:-translate-y-1
                transition
                duration-300
              "
            >
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
