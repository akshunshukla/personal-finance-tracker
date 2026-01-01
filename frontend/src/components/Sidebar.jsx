import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  PieChart,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ open, setOpen }) => {
  const { logout, user } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Transactions", path: "/transactions", icon: ArrowRightLeft },
    { name: "Analytics", path: "/analytics", icon: PieChart },
  ];

  return (
    <div
      className={`fixed z-50 md:static top-0 left-0 h-full w-64 bg-white border-r
  transform transition-transform duration-300
  ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Header with Role Badge */}
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-blue-600">Finance Tracker</h1>
        <div className="mt-3">
          <p className="text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </p>
          <span className="inline-block bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase mt-1">
            {user?.role || "Guest"}
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
