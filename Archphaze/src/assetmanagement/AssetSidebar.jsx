import React, { useState } from "react";
import {
  Home,
  FileText,
  Wrench,
  Users,
  ClipboardList,
  Building2,
  Settings,
  Package,
  FileSearch,
  Menu,
  X,
} from "lucide-react";

export default function AssetSidebar() {
  const [active, setActive] = useState("Dashboard");
  const [showSidebar, setShowSidebar] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, submenu: [] },
    {
      name: "Assets",
      icon: <Package size={18} />,
      submenu: ["Asset List", "Add Asset", "Categories", "Tracking"],
    },
    {
      name: "Inspections",
      icon: <FileSearch size={18} />,
      submenu: ["Scheduled", "Reports"],
    },
    {
      name: "Reports",
      icon: <FileText size={18} />,
      submenu: ["Asset Reports", "Depreciation", "Maintenance Reports"],
    },
    {
      name: "Maintenance",
      icon: <Wrench size={18} />,
      submenu: ["Work Orders", "Preventive", "History"],
    },
    {
      name: "Vendors & Brands",
      icon: <Building2 size={18} />,
      submenu: ["Vendors", "Brands"],
    },
    {
      name: "Users",
      icon: <Users size={18} />,
      submenu: ["User Management", "Roles & Permissions"],
    },
    { name: "Form Builder", icon: <ClipboardList size={18} />, submenu: [] },
    { name: "Settings", icon: <Settings size={18} />, submenu: [] },
  ];

  return (
    <>
      {/* Mobile toggle button */}
      <div className="md:hidden flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-2xl font-bold text-red-500">OCTA</h1>
        <button onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md p-4 flex flex-col
        md:relative md:translate-x-0 transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo for desktop */}
        <h1 className="hidden md:block text-2xl font-bold text-red-500 mb-8">
          OCTA
        </h1>

        {/* Menu */}
        <nav className="flex-1">
          {menu.map((item, i) => (
            <div key={i} className="mb-2">
              <button
                onClick={() => setActive(item.name)}
                className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm ${
                  active === item.name
                    ? "bg-red-100 text-red-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </button>

              {/* Submenu */}
              {active === item.name && item.submenu.length > 0 && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((sub, j) => (
                    <button
                      key={j}
                      className="block text-xs text-gray-600 hover:text-red-500"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-30 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
}
