import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
const [emailError, setEmailError] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

const handleChange = (e) => {
  setForm({ ...form, [e.target.name]: e.target.value });

  if (e.target.name === "email") {
    const email = e.target.value;
    if (!email.includes("@") ) {
      setEmailError(true);
    } else {
      setEmailError(false);
    }
  }
};


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;


    try {
      await login(form);
      setLoginSuccess(true);

      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 3000);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-xl shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login to Tekisky Mart
        </h2>
        {loginSuccess && (
          <div
            className="
    mb-4
    flex
    items-center
    gap-3
    bg-green-50
    border
    border-green-200
    text-green-700
    px-4
    py-3
    rounded-lg
    animate-[scaleIn_0.4s_ease-out]
  "
          >
            <span className="text-xl animate-bounce">✅</span>
            <span className="text-sm font-medium">Login successful</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
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

            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
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
            value={form.password}
            onChange={handleChange}
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
            Login
          </button>
        </form>

        {/* LINKS */}
        <div className="mt-6 flex items-center justify-between text-sm">
          <Link to="/register" className="text-blue-600 hover:underline">
            Create account
          </Link>

          <Link to="/forgot-password" className="text-blue-600 hover:underline">
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
