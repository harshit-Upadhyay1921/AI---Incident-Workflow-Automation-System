import React from "react";
import { useAuth } from "../context/AuthContext";
import * as Icons from "react-icons/md";

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 border-b border-gray-200">

      <h2 className="text-xl font-semibold text-primary">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">

        {/* User Name */}
        <div className="text-gray-700 font-medium">
          {currentUser?.name}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#053B2C] transition"
        >
          <Icons.MdLogout size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
