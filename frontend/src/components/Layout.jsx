import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";

const Layout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/40 z-40 md:hidden ${
          open ? "block" : "hidden"
        }`}
      />

      <Sidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
          <button onClick={() => setOpen(true)}>
            <Menu size={24} />
          </button>
          <span className="font-bold text-blue-600">Finance Tracker</span>
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
