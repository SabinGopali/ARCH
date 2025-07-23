import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function SidebarItem({ name, icon, active, badge, children, onClick, link }) {
  const [open, setOpen] = useState(false);
  const hasChildren = Array.isArray(children) && children.length > 0;

  const handleClick = () => {
    if (hasChildren) {
      setOpen(!open);
    } else {
      onClick();
    }
  };

  // Content inside the sidebar item
  const Content = (
    <div
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors
        ${
          active
            ? "bg-purple-100 text-purple-700 font-semibold"
            : "hover:bg-purple-50 text-gray-700"
        }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-xl">{icon}</span>
        <span className="select-none">{name}</span>
      </div>
      <div className="flex items-center space-x-2">
        {badge && (
          <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full select-none">
            {badge}
          </span>
        )}
        {hasChildren && (
          <span className="text-gray-500 group-hover:text-purple-600 transition-transform duration-200">
            {open ? <FiChevronUp /> : <FiChevronDown />}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <>
      <li onClick={handleClick}>
        {link && !hasChildren ? (
          <Link to={link}>{Content}</Link>
        ) : (
          Content
        )}
      </li>

      {hasChildren && open && (
        <ul className="ml-6 mt-1 border-l border-purple-300">
          {children.map((child) => (
            <li
              key={child.name}
              onClick={onClick}
              className="pl-4 py-2 text-sm text-gray-700 hover:text-purple-700 hover:bg-purple-100 cursor-pointer rounded transition-colors select-none font-normal"
            >
              {child.link ? (
                <Link to={child.link} className="block w-full">
                  {child.name}
                </Link>
              ) : (
                child.name
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
