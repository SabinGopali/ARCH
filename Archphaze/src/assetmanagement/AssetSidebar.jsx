import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/logo.webp";
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
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function AssetSidebar() {
  const [active, setActive] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <Home size={18} />, link: "/assetdashboard", submenu: [] },
    {
      name: "Assets",
      icon: <Package size={18} />,
      link: "#",
      submenu: [
        { name: "Asset List", link: "/assets/list" },
        { name: "Add Asset", link: "/assets/add" },
        { name: "Categories", link: "/assets/categories" },
        { name: "Tracking", link: "/assets/tracking" },
      ],
    },
    {
      name: "Inventory",
      icon: <ClipboardList size={18} />,
      link: "#",
      submenu: [
        { name: "Manage Product", link: "/assetmanageproduct" },
        { name: "Add Product", link: "/inventory/add-product" },
        { name: "Media Center", link: "/inventory/media-center" },
      ],
    },
    {
      name: "Inspections",
      icon: <FileSearch size={18} />,
      link: "#",
      submenu: [
        { name: "Scheduled", link: "/inspections/scheduled" },
        { name: "Reports", link: "/inspections/reports" },
      ],
    },
    {
      name: "Reports",
      icon: <FileText size={18} />,
      link: "#",
      submenu: [
        { name: "Asset Reports", link: "/reports/assets" },
        { name: "Depreciation", link: "/reports/depreciation" },
        { name: "Maintenance Reports", link: "/reports/maintenance" },
      ],
    },
    {
      name: "Maintenance",
      icon: <Wrench size={18} />,
      link: "#",
      submenu: [
        { name: "Work Orders", link: "/maintenance/work-orders" },
        { name: "Preventive", link: "/maintenance/preventive" },
        { name: "History", link: "/maintenance/history" },
      ],
    },
    {
      name: "Vendors & Brands",
      icon: <Building2 size={18} />,
      link: "#",
      submenu: [
        { name: "Vendors", link: "/vendors" },
        { name: "Brands", link: "/brands" },
      ],
    },
    {
      name: "Users",
      icon: <Users size={18} />,
      link: "#",
      submenu: [
        { name: "User Management", link: "/users" },
        { name: "Roles & Permissions", link: "/users/roles" },
      ],
    },
    { name: "Form Builder", icon: <ClipboardList size={18} />, link: "/form-builder", submenu: [] },
    { name: "Settings", icon: <Settings size={18} />, link: "/settings", submenu: [] },
  ];

  const toggleMenu = (name) => {
    setActive(active === name ? "" : name);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed left-2 top-4 z-50 bg-white border rounded-full p-2 shadow-md"
        onClick={() => setShowSidebar(!showSidebar)}
        aria-label="Toggle sidebar"
      >
        {showSidebar ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md p-4 flex flex-col z-40
        md:relative md:h-auto md:self-stretch md:translate-x-0 transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <img src={logo} className="hidden md:block text-2xl font-bold text-red-500 mb-8" />

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto">
          {menu.map((item, i) => (
            <div key={i} className="mb-2">
              {item.submenu.length === 0 ? (
                <Link
                  to={item.link}
                  onClick={() => setActive(item.name)}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                    active === item.name
                      ? "bg-red-100 text-red-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.name)}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-md text-sm transition-colors duration-200 ${
                      active === item.name
                        ? "bg-red-100 text-red-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      {item.name}
                    </div>
                    {active === item.name ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {/* Submenu */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      active === item.name ? "max-h-60 mt-1" : "max-h-0"
                    }`}
                  >
                    {item.submenu.map((sub, j) => (
                      <Link
                        key={j}
                        to={sub.link}
                        className="block px-6 py-1 text-xs text-gray-600 hover:text-red-500 rounded-md transition-colors duration-200"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black opacity-30 md:hidden z-30"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
}
