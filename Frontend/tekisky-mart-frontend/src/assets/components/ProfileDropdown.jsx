import { useState } from "react";

const ProfileDropdown = ({ user, onLogout }) => {
  const [show, setShow] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

return (
  <div className="relative">
    {/* Profile Button */}
    <button
      onClick={() => setShow(!show)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 transition text-sm font-medium"
    >
      <span className="h-7 w-7 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 text-sm">
        {user.name.charAt(0).toUpperCase()}
      </span>
      <span className="hidden sm:block">{user.name}</span>
    </button>

    {/* Dropdown */}
    {show && (
      <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border z-50 overflow-hidden">
        
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <p className="font-semibold text-gray-800 text-sm">My Profile</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>

        {/* Content */}
        <div className="px-4 py-3 space-y-3 text-sm">
          <div>
            <span className="text-gray-500 text-xs">Username</span>
            <p className="font-medium text-gray-800">{user.name}</p>
          </div>

          <div>
            <span className="text-gray-500 text-xs">Email</span>
            <p className="font-medium text-gray-800 truncate">
              {user.email}
            </p>
          </div>

          <div>
            <span className="text-gray-500 text-xs">Password</span>
            <div className="flex items-center justify-between">
              <span className="tracking-widest text-gray-700">
                ********
              </span>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-blue-600 text-xs hover:underline"
              >
                View
              </button>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition border-t"
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

};

export default ProfileDropdown;
