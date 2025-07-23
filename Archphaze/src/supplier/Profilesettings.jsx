import React from "react";
import { FiCopy } from "react-icons/fi";
import { FaLink } from "react-icons/fa";
import Suppliersidebar from "./Suppliersidebar";

export default function Profilesettings() {
  const sellerID = "NPDZR81KX1";

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:flex lg:gap-8">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-6 self-start">
        <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="max-w-screen-xl mx-auto bg-white rounded-xl shadow-sm p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Setting</h1>
          </div>

          {/* Seller Info */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 border-b pb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-500">$</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800">sabin</span>
                <FaLink className="text-blue-500" />
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                Seller ID: <span className="font-mono">{sellerID}</span>
                <FiCopy
                  onClick={() => handleCopy(sellerID)}
                  className="cursor-pointer text-gray-500 hover:text-black transition"
                />
              </div>
            </div>
          </div>

          {/* Business Info Section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Business Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Cards with links */}
              <InfoCard
                title="Seller Profile"
                description="Manage Seller Profile"
                iconColor="from-blue-400 to-blue-600"
                link="/supplierprofile"
              />
              <InfoCard
                title="Business Information"
                description="Your identity info"
                iconColor="from-indigo-400 to-indigo-600"
                link="/businessinfo"
              />
              <InfoCard
                title="Account Setting"
                description="Manage Login Account"
                iconColor="from-purple-400 to-purple-600"
                link="/accountinfo"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Reusable Card Component with link support
const InfoCard = ({ title, description, iconColor, link }) => {
  return (
    <a
      href={link}
      className="block bg-gray-50 hover:bg-white border hover:shadow-md transition rounded-lg p-4 flex gap-4 items-start cursor-pointer no-underline"
    >
      <div
        className={`w-12 h-12 rounded-md bg-gradient-to-br ${iconColor} flex items-center justify-center text-white text-xl font-bold`}
      >
        {title[0]}
      </div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
};
