import React, { useState } from "react";
import Suppliersidebar from "../supplier/Suppliersidebar";
import { Link } from "react-router-dom";

export default function AddUserForm() {
  const [formData, setFormData] = useState({
    role: "",
    email: "",
    name: "",
    password: "",
    sendEmail: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-[20rem] xl:w-[22rem]">
            <Suppliersidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-grow w-full">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Add User</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Roles */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <span className="text-red-500">*</span> Roles:
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-700"
                  >
                    <option value="">Please Select</option>
                    <option value="Seller">Full Supplier Access</option>
                    <option value="Manager">Asset Management Control</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <span className="text-red-500">*</span> Email:
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <span className="text-red-500">*</span> Name:
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    <span className="text-red-500">*</span> Password:
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

         
                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <Link to="/usermanagement">
                  <button
                    type="button"
                    className="border border-gray-300 text-gray-700 px-5 py-2 rounded text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  </Link>
                  <button
                    type="submit"
                    className="bg-orange-500 text-white px-6 py-2 rounded text-sm hover:bg-orange-600"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
