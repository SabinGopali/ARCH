import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineBarChart,
  AiOutlineAppstore,
  AiOutlineShoppingCart,
  AiOutlineUsergroupAdd,
  AiOutlineShop,
  AiOutlineSetting,
  AiOutlineClose,
} from "react-icons/ai";
import { FaBullhorn } from "react-icons/fa";

export default function Suppliersidebar({ sidebarOpen, setSidebarOpen }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { icon: <AiOutlineHome />, label: "Dashboard", route: "/supplierdashboard" },
    {
      icon: <AiOutlineBarChart />,
      label: "Products",
      children: [
        { label: "Manage Products", route: "/manageproduct" },
        { label: "Add Product", route: "/addproduct" },
        { label: "Media Center", route: "/mediacenter" },
      ],
    },
    { icon: <AiOutlineAppstore />, label: "Inventory", route: "/inventory" },
    { icon: <AiOutlineShoppingCart />, label: "Orders", route: "/orders" },
    { icon: <AiOutlineUsergroupAdd />, label: "Customers", route: "/customers" },
    { icon: <FaBullhorn />, label: "Marketing", route: "/marketing" },
    { icon: <AiOutlineShop />, label: "Stores", route: "/stores" },
    { icon: <AiOutlineSetting />, label: "Settings", route: "/settings" },
  ];

  return (
    <aside
      className={`bg-white border rounded-lg shadow-md w-64
        lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:relative lg:translate-x-0 lg:z-auto
        ${sidebarOpen ? "block" : "hidden"} lg:block`}
    >
      <div className="flex justify-between items-center p-4 lg:hidden border-b">
        <span className="text-lg font-bold">Menu</span>
        <button
          onClick={() => setSidebarOpen(false)}
          className="hover:text-gray-700 transition"
        >
          <AiOutlineClose size={20} />
        </button>
      </div>

      <nav className="px-4 pt-4 pb-6 space-y-2 overflow-y-auto h-full">
        {menuItems.map((item, index) => {
          const isDropdown = !!item.children;
          const isActive = activeIndex === index;
          const isOpen = isDropdown && isActive;

          const handleClick = () => {
            if (isDropdown) {
              setActiveIndex((prev) => (prev === index ? null : index));
            } else {
              navigate(item.route);
              setActiveIndex(index);
            }
          };

          return (
            <div key={index}>
              <button
                onClick={handleClick}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-lg text-sm font-medium transition
                  ${isActive ? "bg-gray-100 text-black font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {isDropdown && (
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                )}
              </button>

              {isOpen &&
                item.children.map((child, subIndex) => (
                  <button
                    key={subIndex}
                    onClick={() => navigate(child.route)}
                    className="ml-12 mt-1 mb-1 block w-full text-left text-sm text-gray-600 hover:text-black hover:underline transition"
                  >
                    {child.label}
                  </button>
                ))}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
