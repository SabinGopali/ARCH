// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  MdDashboard, MdOutlinePeopleAlt, MdPayments,
  MdOutlineNotificationsNone, 
  MdOutlineListAlt, MdSupportAgent
} from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { BsTag } from "react-icons/bs";
import { PiBrowsersBold } from "react-icons/pi";
import { RiAdminLine } from "react-icons/ri";
import { FiChevronDown, FiMenu } from "react-icons/fi";

import logo from "/logo.webp"; // Your logo path

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white p-2 rounded shadow-md"
        >
          <FiMenu size={24} />
        </button>
      </div>

      <aside
        className={`fixed z-40 md:static top-0 left-0 h-screen w-64 bg-white shadow-md border-r flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="overflow-y-auto flex-grow">
          {/* Logo */}
          <div className="px-6 py-4 flex justify-center">
           <Link to="/dashboard"> <img src={logo} alt="Logo" className="h-12 md:h-14 object-contain" /></Link>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col px-4 space-y-1 text-gray-700 text-sm">
            <SidebarLink to="/dashboard" icon={<MdDashboard />} label="Dashboard" />
            <SidebarLink to="/userinfo" icon={<MdOutlinePeopleAlt />} label="User Management" />
            <SidebarLink to="/careerinfo" icon={<MdOutlineListAlt />} label="Career Info" />
            <SidebarLink to="/partnersinfo" icon={<MdSupportAgent />} label="Company Partners Info" />
            <SidebarLink to="/financials" icon={<MdPayments />} label="Arch Shop Management" />
            <SidebarLink to="/servicesinfo" icon={<MdOutlineNotificationsNone />} label="Arch Services Management" />

            {/* Collapsible Placeholder */}
            
        
          </nav>
        </div>

        {/* Super Admin Footer with Logout */}
        <div className="flex items-center justify-between px-4 py-4 border-t">
         
          <button className="text-red-600 text-sm hover:underline"
            title="Logout">
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

const SidebarLink = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
        isActive ? "bg-black text-white" : "hover:bg-gray-100"
      }`
    }
  >
    {icon}
    <span>{label}</span>
  </NavLink>
);

export default Sidebar;
