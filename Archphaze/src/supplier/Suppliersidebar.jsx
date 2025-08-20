import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FiGrid,
  FiShoppingBag,
  FiUsers,
  FiMessageSquare,
  FiBox,
  FiRepeat,
  FiBarChart2,
  FiFileText,
  FiPercent,
  FiSettings,
  FiShield,
  FiHelpCircle,
  FiMenu,
  FiX,
} from "react-icons/fi";
import SidebarItem from "./SidebarItem";

const sections = [
  {
    title: "Menu",
    items: [
      { name: "Dashboard", icon: <FiGrid />, link: "/supplierdashboard" },
      { name: "Order", icon: <FiShoppingBag />, badge: 16, link: "/order" },
      { name: "Customers", icon: <FiUsers />, badge: 8,  link: "/customers" },
      { name: "Message", icon: <FiMessageSquare />, link: "/messages" },
    ],
  },
  {
    title: "Tools",
    items: [
      {
        name: "Product",
        icon: <FiBox />,
        children: [
          { name: "Manage Products", link: "/manageproduct" },
          { name: "Add Product", link: "/addproduct" },
          { name: "Media Center", link: "/mediacenter" },
        ],
      },
      { name: "Integrations", icon: <FiRepeat />, link: "/integrations" },
      { name: "Analytic", icon: <FiBarChart2 />, link: "/analytics" },
      { name: "Invoice", icon: <FiFileText />, link: "/invoices" },
      {
        name: "Store",
        icon: <FiShoppingBag />,
        children: [
          { name: "Store Profile", link: "/storeprofile" },
          { name: "Store Settings", link: "/storesettings" },
        ],
      },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "Settings", icon: <FiSettings />, link: "/profilesettings" },
      { name: "User Management", icon: <FiUsers />, link: "/usermanagement" },
      { name: "Security", icon: <FiShield />, link: "/security" },
      { name: "Get Help", icon: <FiHelpCircle />, link: "/help" },
    ],
  },
];

export default function Suppliersidebar({ sidebarOpen, setSidebarOpen }) {
  // Support both controlled (via props) and uncontrolled (internal state) modes
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof sidebarOpen === "boolean" && typeof setSidebarOpen === "function";
  const isOpen = isControlled ? sidebarOpen : internalOpen;
  const location = useLocation();
  const activePath = location.pathname;

  const toggleSidebar = () => {
    if (isControlled) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const handleItemClick = () => {
    if (isControlled) {
      setSidebarOpen(false);
    } else {
      setInternalOpen(false);
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sticky top-24 z-30 h-[calc(100vh-96px)] w-64 bg-white shadow-md border-r p-4 overflow-auto hide-scrollbar
          ${
            // Only apply slide-in/out transforms when operating in uncontrolled (self-managed) mode.
            // In controlled mode, parents typically animate their own <aside>, so duplicating transforms
            // here would cause the content to slide away even when the container is visible.
            isControlled
              ? ""
              : `transform transition-transform duration-300 ease-in-out ${
                  isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0`
          }`}
      >
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xs text-gray-500 uppercase mb-2">
              {section.title}
            </h3>
            <ul>
              {section.items.map((item) => {
                const isActive =
                  activePath === item.link ||
                  item.children?.some((child) => activePath === child.link);

                return (
                  <SidebarItem
                    key={item.name}
                    name={item.name}
                    icon={item.icon}
                    link={item.link}
                    badge={item.badge}
                    children={item.children}
                    active={isActive}
                    onClick={handleItemClick}
                  />
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Toggle button - top right for mobile (only in uncontrolled mode) */}
      {!isControlled && (
        <div className="md:hidden fixed top-24 right-0 z-40">
          <button
            onClick={toggleSidebar}
            className="m-2 p-2 rounded-md bg-white shadow-md border"
            aria-label="Toggle sidebar"
          >
            {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      )}

      {/* Mobile Overlay (only in uncontrolled mode) */}
      {!isControlled && isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
        />
      )}
    </>
  );
}
