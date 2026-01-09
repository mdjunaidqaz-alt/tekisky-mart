import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const submitHandler = async () => {
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid token");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800 text-center">
          Reset Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your new password below
        </p>

        <input
          type="password"
          placeholder="New password"
          className="
            w-full
            border
            rounded-lg
            px-3
            py-2.5
            text-sm
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
          "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={submitHandler}
          className="
            w-full
            bg-green-600
            text-white
            py-2.5
            rounded-lg
            font-medium
            hover:bg-green-700
            transition
            active:scale-95
          "
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
