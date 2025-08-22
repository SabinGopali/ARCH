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
} from "lucide-react";

export default function AssetSidebar({ isOpen, onClose }) {
  const [active, setActive] = useState("Dashboard");
  const [internalOpen, setInternalOpen] = useState(false);

  const open = typeof isOpen === "boolean" ? isOpen : internalOpen;
  const handleClose = () => {
    if (typeof isOpen === "boolean") {
      onClose && onClose();
    } else {
      setInternalOpen(false);
    }
  };

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
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md p-4 flex flex-col transform transition-transform duration-300
        md:relative md:z-auto md:shadow-none md:translate-x-0
        ${open ? "translate-x-0" : "-translate-x-full"}`}
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
      {open && (
        <div
          className="fixed inset-0 bg-black opacity-30 md:hidden z-30"
          onClick={handleClose}
        />
      )}
    </>
  );
}
