import { useState } from "react";
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
      { name: "Customers", icon: <FiUsers />, link: "/customers" },
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
          { name: "Manage Products ", link: "/manageproduct" },
          { name: "Add Product", link: "/addproduct" },
          { name: "Media Center", link: "/mediacenter" },
        ],
      },
      { name: "Integrations", icon: <FiRepeat />, link: "/integrations" },
      { name: "Analytic", icon: <FiBarChart2 />, link: "/analytics" },
      { name: "Invoice", icon: <FiFileText />, link: "/invoices" },
      { name: "Discount", icon: <FiPercent />, link: "/discounts" },
    ],
  },
  {
    title: "Settings",
    items: [
      { name: "Settings", icon: <FiSettings />, link: "/profilesettings" },
      { name: "Security", icon: <FiShield />, link: "/security" },
      { name: "Get Help", icon: <FiHelpCircle />, link: "/help" },
    ],
  },
];

export default function Suppliersidebar() {
  const [active, setActive] = useState("Dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Sidebar */}
      <div
        className={`sticky top-24 z-30 h-[calc(100vh-96px)] w-64 bg-white shadow-md border-r p-4 overflow-auto hide-scrollbar
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xs text-gray-500 uppercase mb-2">{section.title}</h3>
            <ul>
              {section.items.map((item) => (
                <SidebarItem
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  active={active === item.name}
                  badge={item.badge}
                  children={item.children}
                  link={item.link}
                  onClick={() => {
                    setActive(item.name);
                    setIsOpen(false); // close sidebar on mobile after click
                  }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Toggle button - fixed at top right */}
      <div className="md:hidden fixed top-24 right-0 z-40">
        <button
          onClick={toggleSidebar}
          className="m-2 p-2 rounded-md bg-white shadow-md border"
          aria-label="Toggle sidebar"
        >
          {isOpen ? <FiX size={20} /> : <FiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
        />
      )}
    </>
  );
}
