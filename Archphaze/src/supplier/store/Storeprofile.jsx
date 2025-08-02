import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FiEdit2 } from "react-icons/fi";
import Suppliersidebar from "../Suppliersidebar";

const Storeprofile = () => {
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
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8 lg:flex lg:gap-8 relative z-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-62 sticky top-6 self-start">
          <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto space-y-6 px-4 md:px-0">
          {/* Banner */}
          <section className="bg-white rounded-xl p-6 border relative">
            <div className="relative h-56 md:h-64 rounded-xl overflow-hidden bg-gray-300">
              <img
                src="https://source.unsplash.com/1200x400/?office,store"
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-6 bg-white rounded-xl px-6 py-3 shadow-lg border border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-medium border-4 border-white shadow">
                Image
              </div>
              <div className="text-gray-800">
                <h2 className="text-2xl font-semibold">{supplier?.company_name || "Loading..."}</h2>
                <p className="text-sm">{supplier?.isAdmin ? "Admin" : "Supplier"}</p>
              </div>
            </div>
          </section>

          {/* Personal Info */}
          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Personal Information
            </h3>

            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : supplier ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <p className="text-gray-500">Company Name</p>
                  <p className="font-medium">{supplier.company_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Username</p>
                  <p className="font-medium">{supplier.username || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email Address</p>
                  <p className="font-medium">{supplier.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone Number</p>
                  <p className="font-medium">{supplier.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-500">User Role</p>
                  <p className="font-medium">{supplier.isAdmin ? "Admin" : "Supplier"}</p>
                </div>
                <div>
                  <p className="text-gray-500">Business Type</p>
                  <p className="font-medium">
                    {supplier.businessTypes?.length
                      ? supplier.businessTypes.join(", ")
                      : "Not specified"}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No supplier data found.</p>
            )}
          </section>

          {/* Keep other sections unchanged */}
          {/* Description */}
          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {supplier?.description || "No description available."}
            </p>
          </section>

          {/* Address */}
          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">Country</p>
                <p className="font-medium">{supplier?.country || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">City</p>
                <p className="font-medium">{supplier?.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Street</p>
                <p className="font-medium">{supplier?.street || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Postal Code</p>
                <p className="font-medium">{supplier?.postalCode || "N/A"}</p>
              </div>
            </div>
          </section>

          {/* Opening Hours */}
          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Opening Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              {[  
                { day: "Monday", open: "09:00 AM", close: "06:00 PM", openStatus: true },
                { day: "Tuesday", open: "09:00 AM", close: "06:00 PM", openStatus: true },
                { day: "Wednesday", open: "09:00 AM", close: "06:00 PM", openStatus: true },
                { day: "Thursday", open: "09:00 AM", close: "06:00 PM", openStatus: true },
                { day: "Friday", open: "09:00 AM", close: "06:00 PM", openStatus: true },
                { day: "Saturday", open: "", close: "", openStatus: false },
                { day: "Sunday", open: "", close: "", openStatus: false },
              ].map(({ day, open, close, openStatus }) => (
                <div
                  key={day}
                  className="flex justify-between items-center border px-4 py-2 rounded-md bg-gray-50"
                >
                  <span className="font-medium">{day}</span>
                  {openStatus ? (
                    <span className="text-green-600">{open} – {close}</span>
                  ) : (
                    <span className="text-gray-400 italic">Closed</span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Storeprofile;
