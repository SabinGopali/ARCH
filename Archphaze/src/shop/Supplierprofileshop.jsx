import React from "react";
import { Link } from "react-router-dom";

export default function Supplierprofileshop() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Header */}
      <div className="bg-gradient-to-l from-lime-500 via-emerald-500 to-teal-500 py-8 px-6 md:px-12 flex justify-between items-center max-w-7xl mx-auto rounded-b-3xl shadow-lg mb-8">
        <div>
          <h1 className="text-white font-extrabold text-3xl md:text-4xl leading-snug">
            SUPPLIER PROFILE
          </h1>
          <p className="text-white text-sm md:text-base mt-2 opacity-90">
            Store Information & Contact
          </p>
        </div>
        <Link to="/supplierproduct">
          <button className="bg-orange-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-orange-600 transition duration-300">
            Back to Store
          </button>
        </Link>
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { label: "📍 Location", value: "Kathmandu, Nepal" },
            { label: "📅 Joined", value: "4+ years ago" },
            { label: "📞 Contact Number", value: "+977-9800000000" },
            { label: "🏢 Company Name", value: "Fast Delivery Pvt. Ltd." },
            { label: "📧 Email", value: "support@fastdelivery.com" },
            {
              label: "🌐 Website",
              value: (
                <a
                  href="https://www.fastdelivery.com"
                  className="text-blue-600 underline hover:text-blue-800"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.fastdelivery.com
                </a>
              ),
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl shadow-md p-6"
            >
              <p className="text-sm font-semibold text-gray-600 mb-1">{item.label}</p>
              <p className="text-base font-medium text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
