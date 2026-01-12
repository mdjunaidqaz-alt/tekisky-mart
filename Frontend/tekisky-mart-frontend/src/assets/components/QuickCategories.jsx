import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const QuickCategories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get("/categories/trending");
        setCategories(data);
      } catch (error) {
        console.error("Failed to load trending categories");
      }
    };

    fetchTrending();
  }, []);

  if (categories.length === 0) return null;

return (
  <div className="relative bg-white border-b">

    {/* LEFT GRADIENT */}
    <div className="pointer-events-none absolute left-0 top-0 h-full w-10 bg-gradient-to-r from-white to-transparent z-10" />

    {/* RIGHT GRADIENT */}
    <div className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-white to-transparent z-10" />

    {/* SCROLL AREA */}
    <div className="overflow-x-auto scrollbar-hide">
      <div className="py-4">
        <div className="flex gap-6 justify-center">

          {categories.slice(0, 7).map((cat) => (
            <div
              key={cat._id}
              onClick={() => navigate(`/products?category=${cat._id}`)}
              className="cursor-pointer min-w-[90px] flex flex-col items-center group"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 border overflow-hidden flex items-center justify-center transition group-hover:shadow-md group-hover:-translate-y-0.5">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm mt-2 font-medium text-gray-700 group-hover:text-blue-600 transition text-center">
                {cat.name}
              </p>
            </div>
          ))}

          {/* MORE */}
          <div
            onClick={() => navigate("/categories")}
            className="cursor-pointer min-w-[90px] flex flex-col items-center group"
          >
            <div className="w-16 h-16 rounded-full border flex items-center justify-center text-xl text-gray-500 transition group-hover:bg-gray-100 group-hover:text-blue-600 group-hover:shadow-md">
              +
            </div>
            <p className="text-sm mt-2 font-medium text-gray-700 group-hover:text-blue-600 transition">
              More
            </p>
          </div>

        </div>
      </div>
    </div>

  </div>
);


};

export default QuickCategories;
