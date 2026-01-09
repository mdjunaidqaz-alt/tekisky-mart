import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const HeroSlider = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/banners").then((res) => setBanners(res.data));
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners]);

  if (banners.length === 0) return null;

  const banner = banners[index];

  return (
    <div className="relative max-w-7xl mx-auto mt-6 px-4">
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <AnimatePresence mode="wait">
          <motion.img
            key={banner._id}
            src={banner.image}
            alt={banner.title}
            onClick={() => banner.link && navigate(banner.link)}
            className="
              w-full
              h-[180px]
              sm:h-[260px]
              md:h-[340px]
              lg:h-[420px]
              object-cover
              cursor-pointer
              hover:scale-[1.02]
              transition-transform
              duration-500
            "
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>
      </div>

      {/* DOT INDICATORS (CSS ONLY) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition ${
              i === index
                ? "bg-white scale-125"
                : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
