import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Suppliersidebar from "./Suppliersidebar";
import { useSelector } from "react-redux";

export default function Supplierprofile() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplierData = async () => {
      try {
        const res = await fetch("/backend/user/supplier-users", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setSupplier(data.supplier); // Only use the main supplier
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error("Failed to fetch supplier user:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchSupplierData();
    }
  }, [currentUser]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUserRole = (user) => {
    if (user?.isAdmin) return "Administrator";
    if (user?.isSupplier) return "Supplier";
    if (user?.role) return user.role.charAt(0).toUpperCase() + user.role.slice(1);
    return "User";
  };

  const handleGoBack = () => {
    navigate("/profilesettings");
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex lg:gap-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 mb-10 lg:mb-0">
        <Suppliersidebar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">User Profile</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : supplier ? (
          <div className="relative bg-white p-6 rounded-lg shadow mb-6">
            {/* Back Button */}
            <div className="absolute right-6 top-6">
              <button
                onClick={handleGoBack}
                className="text-gray-600 hover:text-black flex items-center gap-1"
              >
                <MdArrowBack size={18} />
                <span>Back</span>
              </button>
            </div>

            {/* Supplier Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  value={supplier.username || "No Name"}
                  readOnly
                  className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={supplier.email}
                  readOnly
                  className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Role</label>
                <input
                  type="text"
                  value={getUserRole(supplier)}
                  readOnly
                  className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Created Date</label>
                <input
                  type="text"
                  value={formatDate(supplier.createdAt)}
                  readOnly
                  className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No supplier found.</p>
        )}
      </main>
    </div>
  );
}