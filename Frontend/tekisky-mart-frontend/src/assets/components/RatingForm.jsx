import { useEffect, useState } from "react";
// import api from "../services/api";
import api from "../../services/api";

const RatingForm = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canRate, setCanRate] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const checkCanRate = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) return;

      const { data } = await api.get(
        `/orders/can-rate/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      setCanRate(data.canRate);
    };

    checkCanRate();
  }, [productId]);

  const submitHandler = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    await api.post(
      `/products/${productId}/rate`,
      { rating, comment },
      {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    setSubmitted(true);
    // alert("Thanks for your rating!");
  };

  if (!canRate || submitted) return null;

  return (
  <div className="mb-6 max-w-xl bg-white border rounded-xl p-4 shadow-sm">
    <p className="text-sm font-semibold text-gray-800 mb-3">
      Rate this product
    </p>

    {/* ⭐ STAR RATING */}
    <div className="flex items-center gap-1 mb-3">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={submitted}
          onClick={() => setRating(star)}
          className={`text-2xl transition ${
            rating >= star
              ? "text-yellow-400"
              : "text-gray-300"
          } ${
            submitted
              ? "cursor-not-allowed opacity-50"
              : "hover:scale-110"
          }`}
        >
          ★
        </button>
      ))}
    </div>

    {/* COMMENT */}
    <input
      value={comment}
      onChange={(e) => setComment(e.target.value)}
      disabled={submitted}
      placeholder="Write a short review (optional)"
      className={`w-full border rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        submitted ? "bg-gray-100 cursor-not-allowed" : ""
      }`}
    />

    {/* SUBMIT / SUCCESS */}
    {!submitted ? (
      <button
        onClick={submitHandler}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
      >
        Submit Review
      </button>
    ) : (
      <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
        ✅ Thank you! Your review has been submitted.
      </div>
    )}
  </div>
);

};

export default RatingForm;
