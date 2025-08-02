import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Suppliersidebar from "./Suppliersidebar";

export default function Businessinfo() {
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
        console.log("Supplier data fetched:", data); // Debug log
        if (res.ok) {
          setSupplier(data.supplier);
        } else {
          console.error(data.message);
          setSupplier(null);
        }
      } catch (error) {
        console.error("Failed to fetch supplier user:", error);
        setSupplier(null);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchSupplierData();
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100 lg:flex lg:gap-8">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-6 self-start">
        <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">Business Information</h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : supplier ? (
          <div className="relative bg-white p-6 rounded-lg shadow mb-6">
            {/* Back Button */}
            <div className="absolute right-6 top-6">
              <button
                onClick={() => navigate("/profilesettings")}
                className="text-gray-600 hover:text-black flex items-center gap-1"
              >
                <MdArrowBack size={18} />
                <span>Back</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block text-sm text-gray-600">Company Name</label>
                <input
                  type="text"
                  value={supplier.company_name || ""}
                  readOnly
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Email Address</label>
                <input
                  type="email"
                  value={supplier.email || ""}
                  readOnly
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Company Location</label>
                <input
                  type="text"
                  value={supplier.company_location || ""}
                  readOnly
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Contact Number</label>
                <input
                  type="text"
                  value={supplier.phone || ""}
                  readOnly
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600">Business Types</label>
                <input
                  type="text"
                  value={
                    supplier.businessTypes?.length > 0
                      ? supplier.businessTypes.join(", ")
                      : "Not specified"
                  }
                  readOnly
                  className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-gray-100"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">No company data found.</p>
        )}
      </main>
    </div>
  );
}
