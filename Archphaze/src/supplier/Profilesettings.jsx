import React, { useState, useEffect } from "react";
import { FiCopy } from "react-icons/fi";
import { FaLink } from "react-icons/fa";
import Suppliersidebar from "./Suppliersidebar";

export default function Profilesettings() {
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // User info state
  const [sellerID, setSellerID] = useState(null);
  const [username, setUsername] = useState("sabin");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch user info once on mount
  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/backend/user/me", {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setSellerID(data._id);
          setUsername(data.username);
        }
      } catch {
        // Optionally handle error silently here
      }
    }
    fetchUser();
  }, []);

  // Clipboard copy helper
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // Modal handlers
  const openDeleteModal = () => {
    setDeletePassword("");
    setDeleteReason("");
    setDeleteError("");
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeletePassword("");
    setDeleteReason("");
    setDeleteError("");
  };

  // Handle deletion request (flag user for admin approval)
  const handleRequestDeletion = async () => {
    if (!deleteReason.trim()) {
      setDeleteError("Please provide a reason for deleting your account.");
      return;
    }
    if (!deletePassword) {
      setDeleteError("Please enter your password.");
      return;
    }
    if (!sellerID) {
      setDeleteError("User ID missing, unable to request deletion.");
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      const res = await fetch(`/backend/user/request-deletion/${sellerID}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: deletePassword, deletionReason: deleteReason }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Deletion request sent for admin approval.");
        closeDeleteModal();
      } else {
        setDeleteError(data.message || "Failed to request account deletion.");
      }
    } catch (error) {
      setDeleteError(error.message || "An error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-white lg:flex lg:gap-8">
      {/* Mobile Sidebar Toggle */}
      <div className="px-4 py-4 lg:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white border shadow rounded-md hover:bg-gray-100 transition"
          aria-label="Toggle Sidebar"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Aside */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:hidden`}
      >
        <Suppliersidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-6 self-start">
        <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="w-full max-w-6xl mx-auto bg-white rounded-xl shadow-md p-8 space-y-8">
          <div className="border-b pb-4">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your seller profile and business information.
            </p>
          </div>

          <section className="flex flex-col sm:flex-row sm:items-center gap-6 border-b pb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-500">$</span>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-gray-800">{username}</span>
                <FaLink className="text-blue-500" />
              </div>
              <div className="text-sm text-gray-600 flex items-center gap-2">
                Seller ID:{" "}
                <span className="font-mono">{sellerID || "Loading..."}</span>
                <FiCopy
                  onClick={() => sellerID && handleCopy(sellerID)}
                  className={`cursor-pointer text-gray-500 hover:text-black transition ${
                    sellerID ? "" : "cursor-not-allowed opacity-50"
                  }`}
                />
              </div>
            </div>
          </section>

          {/* Business Settings Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Business Settings</h2>

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

            <AccountManagementCard openDeleteModal={openDeleteModal} />
          </section>
        </div>

        {/* Delete confirmation modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-transparent flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Confirm Account Deletion</h3>
              <p className="mb-4">
                Please provide a reason and enter your password to confirm deleting your account. This
                action will send a deletion request for admin approval.
              </p>

              <div className="mb-4">
                <label
                  htmlFor="deleteReason"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Reason for deleting your account
                </label>
                <textarea
                  id="deleteReason"
                  rows={3}
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Please briefly explain your reason for deletion"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <input
                type="password"
                placeholder="Your password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                autoFocus
              />

              {deleteError && (
                <p className="text-red-600 text-sm mb-2">{deleteError}</p>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={closeDeleteModal}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleRequestDeletion}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Sending..." : "Send Deletion Request"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// InfoCard and AccountManagementCard remain unchanged
const InfoCard = ({ title, description, iconColor, link }) => (
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

const AccountManagementCard = ({ openDeleteModal }) => {
  const actions = [
    {
      name: "Change Password",
      description: "Update your login credentials securely.",
      link: "/change-password",
    },
    {
      name: "Request Account Deletion",
      description:
        "Send a request to permanently delete your seller account (admin approval required).",
      action: openDeleteModal,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="font-semibold text-gray-800 text-lg mb-4">Account Management</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {actions.map((item, idx) =>
          item.link ? (
            <a
              key={idx}
              href={item.link}
              className="border border-gray-100 hover:border-gray-300 rounded-lg p-4 transition bg-gray-50 hover:bg-white"
            >
              <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
              <p className="text-xs text-gray-600">{item.description}</p>
            </a>
          ) : (
            <button
              key={idx}
              onClick={item.action}
              className="border border-gray-100 hover:border-gray-300 rounded-lg p-4 transition bg-gray-50 hover:bg-white text-left"
            >
              <h4 className="text-sm font-medium text-gray-900 mb-1">{item.name}</h4>
              <p className="text-xs text-gray-600">{item.description}</p>
            </button>
          )
        )}
      </div>
    </div>
  );
};
