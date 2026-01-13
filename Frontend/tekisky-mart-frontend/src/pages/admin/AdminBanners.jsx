import { useEffect, useState } from "react";
import api from "../../services/api";

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
const [page, setPage] = useState(1);
const [pages, setPages] = useState(1);


const fetchBanners = async () => {
  const { data } = await api.get(`/banners/admin?page=${page}&limit=5`);
  setBanners(data.banners || []);
  setPages(data.pages);
};


  useEffect(() => {
    fetchBanners();
  }, [page]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("link", link);

    await api.post("/banners", formData);
    setTitle("");
    setLink("");
    setImage(null);
    fetchBanners();
  };

  const toggleActive = async (banner) => {
    await api.put(`/banners/${banner._id}`, {
      isActive: !banner.isActive
    });
    fetchBanners();
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete banner?")) return;
    await api.delete(`/banners/${id}`);
    fetchBanners();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeInUp">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Banners
      </h1>

      {/* CREATE BANNER */}
      <form
        onSubmit={submitHandler}
        className="bg-white border rounded-xl shadow-sm p-6 mb-10 space-y-4"
      >
        <h2 className="font-semibold text-gray-700">
          Add New Banner
        </h2>

        <input
          placeholder="Banner title"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Link (optional)"
          className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />

        <div className="border rounded-lg p-3 text-sm">
          <label className="block text-gray-600 mb-1">
            Banner Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
            className="text-sm"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition active:scale-95"
        >
          Add Banner
        </button>
      </form>

      {/* BANNER LIST */}
      <div className="space-y-4">
        {banners.map((banner) => (
          <div
            key={banner._id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
          >
            {/* IMAGE */}
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full sm:w-40 h-24 object-cover rounded-lg"
            />

            {/* INFO */}
            <div className="flex-1">
              <p className="font-semibold text-gray-800">
                {banner.title}
              </p>
              <p className="text-sm text-gray-500 break-all">
                {banner.link || "No link"}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => toggleActive(banner)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition ${
                  banner.isActive
                    ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                    : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {banner.isActive ? "Disable" : "Enable"}
              </button>

              <button
                onClick={() => deleteHandler(banner._id)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-red-600 border border-red-300 hover:bg-red-50 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* PAGINATION */}
<div className="flex justify-center items-center gap-4 mt-8">
  <button
    disabled={page === 1}
    onClick={() => setPage(page - 1)}
    className="px-4 py-2 border rounded-lg disabled:opacity-50"
  >
    ← Prev
  </button>

  <span className="font-medium text-gray-700">
    Page {page} of {pages}
  </span>

  <button
    disabled={page === pages}
    onClick={() => setPage(page + 1)}
    className="px-4 py-2 border rounded-lg disabled:opacity-50"
  >
    Next →
  </button>
</div>

    </div>
  );
};

export default AdminBanners;
