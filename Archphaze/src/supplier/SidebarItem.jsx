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

  // Auto-open if a child route is active
  useEffect(() => {
    if (children?.some((child) => location.pathname === child.link)) {
      setDropdownOpen(true);
    }
  }, [location.pathname, children]);

  if (children && children.length > 0) {
    return (
      <li>
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors
            ${active ? "bg-black text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}
          `}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span>{name}</span>
          </div>
          <span>{dropdownOpen ? <FiChevronDown /> : <FiChevronRight />}</span>
        </div>

        {dropdownOpen && (
          <ul className="pl-8 mt-1 space-y-1">
            {children.map((child) => (
              <li key={child.name}>
                <Link
                  to={child.link}
                  onClick={() => {
                    setDropdownOpen(false); // Close dropdown on click
                    onClick?.();            // Close sidebar on mobile
                  }}
                  className={`block p-1 rounded-md transition-colors text-sm
                    ${location.pathname === child.link ? "bg-black text-white font-medium" : "hover:bg-gray-100 text-gray-600"}
                  `}
                >
                  {child.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li>
      <Link
        to={link}
        onClick={onClick}
        className={`flex items-center justify-between p-2 rounded-md transition-colors
          ${active ? "bg-black text-white font-semibold" : "text-gray-700 hover:bg-gray-100"}
        `}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{name}</span>
        </div>
        {badge && (
          <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5">
            {badge}
          </span>
        )}
      </Link>
    </li>
  );
}
