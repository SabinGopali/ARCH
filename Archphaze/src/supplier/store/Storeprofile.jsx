import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Suppliersidebar from "../Suppliersidebar";
import { Link, useNavigate } from "react-router-dom";

const Storeprofile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [supplier, setSupplier] = useState(null);
  const [storeProfile, setStoreProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

    if (currentUser?._id || currentUser?.id) {
      fetchSupplierData();
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchStoreProfile = async () => {
      const supplierOwnerId = currentUser?.isSubUser
        ? currentUser?.supplierId || currentUser?.supplierRef
        : currentUser?._id || currentUser?.id;
      if (!supplierOwnerId) return;

      try {
        const res = await fetch(`/backend/store/get/${supplierOwnerId}`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();

        if (res.ok) {
          setStoreProfile(data.storeProfile);
        } else {
          console.error(data.message || "Error fetching store profile");
          setStoreProfile(null);
        }
      } catch (error) {
        console.error("Error fetching store profile:", error);
        setStoreProfile(null);
      }
    };

    fetchStoreProfile();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8 lg:flex lg:gap-8 relative z-10">
        <aside className="hidden lg:block w-62 sticky top-6 self-start">
          <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
        </aside>

        <main className="flex-1 max-w-7xl mx-auto space-y-6 px-4 md:px-0">
          <section className="bg-white rounded-xl p-6 border relative">
            <div className="relative h-56 md:h-64 rounded-xl overflow-hidden bg-gray-300">
              <img
                src={
                  storeProfile?.bgImage
                    ? `http://localhost:3000/${storeProfile.bgImage}`
                    : "https://source.unsplash.com/1200x400/?office,store"
                }
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://source.unsplash.com/1200x400/?office,store";
                }}
              />
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-6 bg-white rounded-xl px-6 py-3 shadow-lg border border-gray-200">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow overflow-hidden">
                {storeProfile?.logo ? (
                  <img
                    src={`http://localhost:3000/${storeProfile.logo}`}
                    alt="Store Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/80?text=No+Logo";
                    }}
                  />
                ) : (
                  <span className="text-gray-500 text-sm font-medium">No Image</span>
                )}
              </div>
              <div className="text-gray-800">
                <h2 className="text-2xl font-semibold">
                  {supplier?.company_name || "Loading..."}
                </h2>
                <p className="text-sm">Supplier</p>
              </div>
            </div>
          </section>

          

          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>

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
                  <p className="font-medium">Supplier</p>
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
          
          <div className="flex justify-end">
            <Link to={`/updatestoresetting/${(currentUser?.isSubUser ? (currentUser?.supplierId || currentUser?.supplierRef) : (currentUser?._id || ""))}`}>
              <button
                disabled={!currentUser?._id && !currentUser?.supplierId && !currentUser?.supplierRef}
                className={`font-semibold py-2 px-4 rounded-md shadow ${
                  (currentUser?._id || currentUser?.supplierId || currentUser?.supplierRef)
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 cursor-not-allowed text-gray-200"
                }`}
              >
                Update Store Profile
              </button>
            </Link>
          </div>

          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Description</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              {storeProfile?.companyDescription || "No description available."}
            </p>
          </section>

          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
              <div>
                <p className="text-gray-500">Country</p>
                <p className="font-medium">{storeProfile?.country || "Nepal"}</p>
              </div>
              <div>
                <p className="text-gray-500">City</p>
                <p className="font-medium">{storeProfile?.city || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Street</p>
                <p className="font-medium">{storeProfile?.street || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Postal Code</p>
                <p className="font-medium">{storeProfile?.postCode || "N/A"}</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 border">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Opening Hours</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              {storeProfile?.openingHours?.map(({ day, open, close, enabled }) => (
                <div
                  key={day}
                  className="flex justify-between items-center border px-4 py-2 rounded-md bg-gray-50"
                >
                  <span className="font-medium">{day}</span>
                  {enabled ? (
                    <span className="text-green-600">
                      {open} – {close}
                    </span>
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
