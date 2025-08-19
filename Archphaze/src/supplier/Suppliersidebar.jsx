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
      { name: "Customers", icon: <FiUsers />, badge: 8, link: "/customers" },
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

export default function Suppliersidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const activePath = location.pathname;

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-26 left-0 z-40 
          bg-white rounded-r-2xl shadow-lg
          transform transition-transform duration-300 ease-in-out
          w-64 sm:w-56 md:w-64
          h-[calc(85vh-2rem)] md:h-screen
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Scrollable content */}
        <div
          className="h-full overflow-y-auto overscroll-contain touch-pan-y p-4"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h3 className="text-xs font-semibold tracking-wide text-gray-400 uppercase mb-3 px-2">
                {section.title}
              </h3>
              <ul className="space-y-1">
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
                      onClick={() => setIsOpen(false)}
                    />
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* Toggle button - middle left (mobile only) */}
      <div className="md:hidden fixed top-1/2 left-0 -translate-y-1/2 z-50">
        <button
          onClick={toggleSidebar}
          className="p-3 rounded-r-lg bg-black text-white shadow-md focus:outline-none focus:ring-2 focus:ring-black"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
        />
      )}
    </>
  );
}
