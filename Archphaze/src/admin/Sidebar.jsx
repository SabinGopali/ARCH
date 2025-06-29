// src/components/Sidebar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdDashboard, MdOutlinePeopleAlt, MdPayments,
  MdOutlineNotificationsNone, MdOutlineSettings, MdOutlineLocalOffer,
  MdOutlineListAlt, MdSupportAgent
} from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsTag } from "react-icons/bs";
import { PiBrowsersBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { FiChevronDown } from "react-icons/fi";

import logo from "/logo.webp"; // Your logo path

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-white shadow-md border-r flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="px-6 py-4">
          <img src={logo} alt="Logo" className="h-8" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-col px-4 space-y-2 text-gray-700 text-sm">
          <SidebarLink to="/dashboard" icon={<MdDashboard />} label="Dashboard" />
          <SidebarLink to="/user-management" icon={<MdOutlinePeopleAlt />} label="User Management" />
          <SidebarLink to="/bookings" icon={<MdOutlineListAlt />} label="Booking Management" />
          <SidebarLink to="/financials" icon={<MdPayments />} label="Financials" />
          <SidebarLink to="/notifications" icon={<MdOutlineNotificationsNone />} label="Notifications" />
          <SidebarLink to="/admin-list" icon={<RiAdminLine />} label="Admin list" />

          {/* Collapsible Placeholder */}
          <div className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer">
            <div className="flex items-center gap-2">
              <PiBrowsersBold size={18} />
              <span>Service</span>
            </div>
            <FiChevronDown className="text-gray-400" />
          </div>

          <SidebarLink to="/promotion" icon={<BsTag />} label="Promotion" />
          <SidebarLink to="/coupon" icon={<MdOutlineLocalOffer />} label="Coupon" />
          <SidebarLink to="/payment" icon={<MdPayments />} label="Payment" />
          <SidebarLink to="/reviews" icon={<FaRegStar />} label="Rating & Review" />
          <SidebarLink to="/error-reports" icon={<HiOutlineDocumentReport />} label="Error log reports" />
          <SidebarLink to="/support" icon={<MdSupportAgent />} label="Support Tools" />
          <SidebarLink to="/settings" icon={<MdOutlineSettings />} label="Settings" />
        </nav>
      </div>

      {/* Super Admin Footer with Logout */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="flex items-center gap-3">
          <img
            src="https://i.pravatar.cc/36?img=3"
            alt="Admin avatar"
            className="w-10 h-10 rounded-full"
          />
          <div className="text-sm">
            <p className="font-medium">Barakatullah</p>
            <p className="text-gray-500 text-xs">Admin</p>
          </div>
        </div>
        <button
          onClick={() => {
            // Replace with real logout logic
            console.log("Logging out...");
            localStorage.removeItem("authToken");
            window.location.href = "/login";
          }}
          className="text-red-600 text-sm hover:underline"
          title="Logout"
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

// Individual sidebar link
const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
        isActive ? "bg-teal-700 text-white" : "hover:bg-gray-100"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
