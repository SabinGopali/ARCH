import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

export default function Supplierprofileshop() {
  const { currentUser } = useSelector((state) => state.user);
  const { userId } = useParams();
  const [supplier, setSupplier] = useState(null);
  const [storeProfile, setStoreProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPublic(userIdParam) {
      try {
        const res = await fetch(`/backend/store/public/${userIdParam}`);
        const data = await res.json();
        if (res.ok) {
          setStoreProfile(data.storeProfile);
          setSupplier(data.supplier || null);
        } else {
          console.error(data.message || 'Failed to fetch public store');
        }
      } catch (err) {
        console.error("Error fetching public store:", err);
      }
    }

    const fetchSupplierData = async () => {
      try {
        const res = await fetch("/backend/user/supplier-users", {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setSupplier(data.supplier);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching supplier:", err);
      }
    };

    const fetchStoreProfile = async () => {
      try {
        const res = await fetch(`/backend/store/get/${currentUser._id}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setStoreProfile(data.storeProfile);
        } else {
          console.error(data.message);
        }
      } catch (err) {
        console.error("Error fetching store profile:", err);
      }
    };

    setLoading(true);
    if (userId) {
      fetchPublic(userId).finally(() => setLoading(false));
    } else if (currentUser?._id) {
      Promise.all([fetchSupplierData(), fetchStoreProfile()]).finally(() =>
        setLoading(false)
      );
    }
  }, [currentUser, userId]);

  if (loading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="relative py-10 px-6 md:px-12 max-w-7xl mx-auto rounded-3xl shadow-lg mb-8 overflow-hidden">
        <img
          src={
            storeProfile?.bgImage
              ? `http://localhost:3000/${storeProfile.bgImage}`
              : "https://via.placeholder.com/1200x300?text=Store+Banner"
          }
          alt="Store Banner"
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/1200x300?text=Store+Banner";
          }}
        />

        {/* Dark translucent container for company info */}
        <div className="relative z-10 max-w-5xl mx-auto bg-black/60 rounded-2xl px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden">
              <img
                src={
                  storeProfile?.logo
                    ? `http://localhost:3000/${storeProfile.logo}`
                    : "https://via.placeholder.com/80x80?text=Logo"
                }
                alt="Company Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-2xl md:text-3xl leading-snug">
                {supplier?.company_name || "Supplier Store"}
              </h1>
              <p className="text-white text-sm md:text-base opacity-90 mt-1">
                📍 {storeProfile?.city || "N/A"}, {storeProfile?.street || ""}
              </p>
              <p className="text-white text-sm md:text-base opacity-90">
                📧 {supplier?.email || "N/A"}
              </p>
            </div>
          </div>
          <Link to={userId ? "/shopindex" : "/supplierproduct"}>
            <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300">
              {userId ? 'Back to Shop' : 'Back to Store'}
            </button>
          </Link>
        </div>
      </div>

      {/* Profile Info Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InfoCard label="📧 Email" value={supplier?.email || "N/A"} />
          <InfoCard
            label="🏙️ Address"
            value={`${storeProfile?.street || ""}, ${storeProfile?.city || ""}, ${storeProfile?.postCode || ""}`}
          />
          <InfoCard label="📞 Phone" value={supplier?.phone || "N/A"} />
          <InfoCard label="📝 Description" value={storeProfile?.companyDescription || "No description"} />
        </div>
      </div>

      {/* Opening Hours Section */}
      {storeProfile?.openingHours?.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 md:px-12 pb-12">
          <h2 className="text-xl font-semibold mb-4">⏰ Opening Hours</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {storeProfile.openingHours.map(({ day, open, close, enabled }, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border px-4 py-2 rounded-md bg-gray-50 shadow-sm"
              >
                <span className="font-medium">{day}</span>
                {enabled ? (
                  <span className="text-green-600 font-medium">
                    {open} – {close}
                  </span>
                ) : (
                  <span className="text-gray-400 italic">Closed</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable info card component
function InfoCard({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-md p-6">
      <p className="text-sm font-semibold text-gray-600 mb-1">{label}</p>
      <p className="text-base font-medium text-gray-900">{value}</p>
    </div>
  );
}
