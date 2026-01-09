import { useEffect, useState } from "react";

const Toast = ({ message }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 2300);
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (!message || !show) return null;

  return (
    <div className="fixed top-20 right-5 z-50 animate-slide-in">
      <div className="flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg">

        {/* ✅ DRAWING CHECK ICON */}
        <div className="w-7 h-7">
          <svg
            viewBox="0 0 52 52"
            className="checkmark"
          >
            <circle
              cx="26"
              cy="26"
              r="25"
              fill="none"
              className="checkmark-circle"
            />
            <path
              fill="none"
              d="M14 27 l7 7 l17 -17"
              className="checkmark-check"
            />
          </svg>
        </div>

        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
