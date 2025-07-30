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
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white lg:flex lg:gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 bg-white border-r min-h-screen">
        <Suppliersidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-8">
          {/* Page Title */}
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your seller profile and business information.</p>
          </div>

          {/* Seller Info */}
          <section className="flex flex-col sm:flex-row sm:items-center gap-6 border-b pb-6">
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
          </section>

          {/* Business Info Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Business Settings
            </h2>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InfoCard
                title="Seller Profile"
                description="Manage your public seller profile and logo."
                iconColor="from-blue-400 to-blue-600"
                link="/supplierprofile"
              />
              <InfoCard
                title="Business Information"
                description="Update your company registration and identity."
                iconColor="from-indigo-400 to-indigo-600"
                link="/businessinfo"
              />
            </div>

            {/* Account Management Section */}
            <AccountManagementCard />
          </section>
        </div>
      </main>
    </div>
  );
}

// Info card for settings
const InfoCard = ({ title, description, iconColor, link }) => {
  return (
    <a
      href={link}
      className="block bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-lg transition rounded-lg p-5 flex gap-4 items-start cursor-pointer"
    >
      <div
        className={`w-12 h-12 rounded-md bg-gradient-to-br ${iconColor} flex items-center justify-center text-white text-xl font-bold shadow-inner`}
      >
        {title[0]}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </a>
  );
};

// Simplified Account management card
const AccountManagementCard = () => {
  const actions = [
    {
      name: "Change Password",
      description: "Update your login credentials securely.",
      link: "/change-password",
    },
    {
      name: "Close Account",
      description: "Permanently delete your seller account.",
      link: "/close-account",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Account Management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((item, idx) => (
          <a
            key={idx}
            href={item.link}
            className="border border-gray-100 hover:border-gray-300 rounded-lg p-4 transition bg-gray-50 hover:bg-white"
          >
            <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
            <p className="text-xs text-gray-600">{item.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
};
