import { createContext, useContext, useState } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
  <div className="fixed top-20 right-4 flex items-center gap-3 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-slide-in">
    
    {/* ✅ ANIMATED CHECK ICON */}
    <div className="checkmark">
      <svg
        viewBox="0 0 52 52"
        className="w-6 h-6"
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

    <span className="text-sm font-medium">{toast}</span>
  </div>
)}

    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
