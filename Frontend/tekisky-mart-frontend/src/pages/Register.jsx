import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [emailError, setEmailError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    // ONLY @ condition
    if (name === "email") {
      if (!value.includes("@")) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (emailError) return;

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/auth/register",
        form
      );

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Create Account
        </h2>

        <form onSubmit={submitHandler} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="
              w-full
              border
              rounded-lg
              px-3
              py-2.5
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            className={`
              w-full
              border
              rounded-lg
              px-3
              py-2.5
              text-sm
              focus:outline-none
              focus:ring-2
              ${emailError ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}
            `}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="
              w-full
              border
              rounded-lg
              px-3
              py-2.5
              text-sm
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
            required
          />

          <button
            type="submit"
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
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
