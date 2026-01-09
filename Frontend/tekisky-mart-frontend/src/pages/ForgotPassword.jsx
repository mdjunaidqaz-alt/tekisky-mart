import { useState } from "react";
import api from "../services/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const submitHandler = async () => {
    try {
      await api.post("/auth/forgot-password", { email });
      alert("Reset link sent to email");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        className="w-full border p-2 mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        onClick={submitHandler}
        className="bg-blue-600 text-white w-full py-2 rounded"
      >
        Send Reset Link
      </button>
    </div>
  );
};

export default ForgotPassword;
