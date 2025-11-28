import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "react-icons/md";
import { motion } from "framer-motion";
import { sidebarMenu } from "../data/sidebarMenu";
import { useAuth } from "../context/AuthContext.jsx"; // you will add this later

const Sidebar = () => {
  const { role } = useAuth(); // 'admin' | 'support' | 'employee'
//   const role = "admin"; // temporary hardcoded role for demonstration
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = sidebarMenu[role] || [];

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.div
      animate={{ width: isOpen ? 260 : 80 }}
      className="h-screen bg-primary text-white flex flex-col shadow-xl transition-all duration-300"
    >
      {/* TOP LOGO + TOGGLE */}
      <div className="flex items-center justify-between px-4 py-6">
        <h1 className="text-2xl font-bold whitespace-nowrap">
          {isOpen ? "IncidentIQ" : "IQ"}
        </h1>

        <button onClick={toggleSidebar} className="text-white opacity-80 hover:opacity-100">
          <Icons.MdMenu size={26} />
        </button>
      </div>

      {/* MENU ITEMS */}
      <div className="mt-4 space-y-1">
        {menuItems.map((item, index) => {
          const Icon = Icons[item.icon];

          return (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg mx-2 transition
                ${isActive ? "bg-white text-primary font-semibold" : "hover:bg-white/10"}`
              }
            >
              <Icon size={22} />
              {isOpen && <span className="text-sm">{item.label}</span>}
            </NavLink>
          );
        })}
      </div>

      {/* BOTTOM ACTION: LOGOUT */}
      <div className="mt-auto px-4 pb-6">
        <button
          onClick={() => {}}
          className="flex items-center gap-3 px-4 py-3 rounded-lg w-full bg-white/10 hover:bg-white/20"
        >
          <Icons.MdLogout size={22} />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
