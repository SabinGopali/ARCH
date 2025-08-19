import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import Suppliersidebar from "./Suppliersidebar";

export default function Accountinfo() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([
    {
      _id: "1",
      name: "ABC Traders",
      email: "abc@example.com",
      location: "Kathmandu, Nepal",
      number: "+977-1234567890",
      businessType: "Retail",
    },
    {
      _id: "2",
      name: "XYZ Solutions",
      email: "xyz@example.com",
      location: "Pokhara, Nepal",
      number: "+977-9876543210",
      businessType: "IT Services",
    },
    {
      _id: "3",
      name: "Nepal Textiles",
      email: "textiles@example.com",
      location: "Biratnagar, Nepal",
      number: "+977-9801234567",
      businessType: "Manufacturing",
    },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedCompanies = [...companies];
    updatedCompanies[index][field] = value;
    setCompanies(updatedCompanies);
  };

  const handleSave = (company) => {
    // Handle save logic here (e.g., API call)
    alert(`Saved changes for ${company.name}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex lg:gap-8">
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
        <h2 className="text-xl font-semibold mb-6">Account Information</h2>

        {companies.length > 0 ? (
          companies.map((company, index) => (
            <div
              key={company._id}
              className="relative bg-white p-6 rounded-lg shadow mb-6"
            >
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
                    value={company.name}
                    onChange={(e) => handleInputChange(index, "name", e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Email Address</label>
                  <input
                    type="email"
                    value={company.email}
                    onChange={(e) => handleInputChange(index, "email", e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Company Location</label>
                  <input
                    type="text"
                    value={company.location}
                    onChange={(e) => handleInputChange(index, "location", e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Contact Number</label>
                  <input
                    type="text"
                    value={company.number}
                    onChange={(e) => handleInputChange(index, "number", e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600">Business Type</label>
                  <input
                    type="text"
                    value={company.businessType}
                    onChange={(e) => handleInputChange(index, "businessType", e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 bg-white"
                  />
                </div>
              </div>

              <div className="mt-6 text-right">
                <button
                  onClick={() => handleSave(company)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">No companies found.</p>
        )}
      </main>
    </div>
  );
}
