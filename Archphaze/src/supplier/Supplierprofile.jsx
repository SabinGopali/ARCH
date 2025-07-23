import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- import useNavigate
import { MdArrowBack } from "react-icons/md";
import Suppliersidebar from "./Suppliersidebar";

export default function Supplierprofile() {
  const navigate = useNavigate(); // <-- initialize navigate

  const [users] = useState([
    {
      _id: "1",
      username: "John Doe",
      email: "john.doe@example.com",
      role: "admin",
      createdAt: "2024-01-10T12:34:56Z",
    },
    {
      _id: "2",
      username: "Jane Smith",
      email: "jane.smith@example.com",
      role: "user",
      createdAt: "2024-02-20T08:15:00Z",
    },
    {
      _id: "3",
      username: "Bob Johnson",
      email: "bob.johnson@example.com",
      role: "editor",
      createdAt: "2024-03-05T16:45:30Z",
    },
  ]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getUserRole = (user) => {
    switch (user.role) {
      case "admin":
        return "Administrator";
      case "user":
        return "User";
      case "editor":
        return "Editor";
      default:
        return "Unknown";
    }
  };

  const handleGoBack = () => {
    navigate("/profilesettings"); // <-- use React Router's navigate
  };

  return (
    <div className="min-h-screen bg-gray-100 lg:flex lg:gap-8">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 sticky top-6 self-start">
        <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-xl font-semibold mb-6">User Profiles</h2>

        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user._id}
              className="relative bg-white p-6 rounded-lg shadow mb-6"
            >
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Name</label>
                  <input
                    type="text"
                    value={user.username || "No Name"}
                    readOnly
                    className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    readOnly
                    className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Role</label>
                  <input
                    type="text"
                    value={getUserRole(user)}
                    readOnly
                    className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Created Date</label>
                  <input
                    type="text"
                    value={formatDate(user.createdAt)}
                    readOnly
                    className="w-full p-2 rounded-md bg-gray-100 border border-gray-300"
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center mt-10">No users found.</p>
        )}
      </main>
    </div>
  );
}
