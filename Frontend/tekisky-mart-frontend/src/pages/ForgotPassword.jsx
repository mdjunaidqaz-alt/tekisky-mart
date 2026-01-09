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
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-500 text-center mb-6">
          Enter your registered email to receive a reset link
        </p>

        <input
          type="email"
          placeholder="Email address"
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
            focus:ring-blue-500
          "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={submitHandler}
          className="
            w-full
            bg-blue-600
            text-white
            py-2.5
            rounded-lg
            font-medium
            hover:bg-blue-700
            transition
            active:scale-95
          "
        >
          Send Reset Link
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
