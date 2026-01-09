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
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Reset Password</h2>

      <input
        type="password"
        placeholder="New password"
        className="w-full border p-2 mb-3"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submitHandler}
        className="bg-green-600 text-white w-full py-2 rounded"
      >
        Reset Password
      </button>
    </div>
  );
};

export default ResetPassword;
