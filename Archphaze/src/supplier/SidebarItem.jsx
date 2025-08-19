import { Link, useLocation } from "react-router-dom";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function SidebarItem({
  name,
  icon,
  link,
  active,
  badge,
  children,
  onClick,
}) {
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Auto-open dropdown if any child route is active
  useEffect(() => {
    if (children?.some((child) => location.pathname === child.link)) {
      setDropdownOpen(true);
    }
  }, [location.pathname, children]);

  // Function to toggle dropdown
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // If there are children (nested menu)
  if (children && children.length > 0) {
    return (
      <li>
        <button
          onClick={toggleDropdown}
          className={`flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200
            ${active ? "bg-black text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}
          `}
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">{icon}</span>
            <span className="text-sm">{name}</span>
          </div>
          <span className="text-gray-500">
            {dropdownOpen ? <FiChevronDown /> : <FiChevronRight />}
          </span>
        </button>

        {/* Dropdown menu */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            dropdownOpen ? "max-h-80 mt-1" : "max-h-0"
          }`}
        >
          <ul className="pl-10 space-y-1">
            {children.map((child) => (
              <li key={child.name}>
                <Link
                  to={child.link}
                  onClick={() => {
                    onClick?.(); // Close sidebar on mobile
                  }}
                  className={`block px-2 py-1.5 rounded-md text-sm transition-colors
                    ${
                      location.pathname === child.link
                        ? "bg-black text-white font-medium"
                        : "hover:bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }

  // If no children, render a normal link
  return (
    <li>
      <Link
        to={link}
        onClick={onClick}
        className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200
          ${active ? "bg-black text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}
        `}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon}</span>
          <span className="text-sm">{name}</span>
        </div>
        {badge && (
          <span className="text-xs font-medium bg-red-500 text-white rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
