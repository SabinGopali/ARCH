import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Suppliersidebar from "../supplier/Suppliersidebar";

export default function Updatesserform() {
  const { id } = useParams(); // Get sub-user ID from URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    email: "",
    name: "",
    password: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  // Fetch current sub-user data
  useEffect(() => {
    const fetchSubUser = async () => {
      try {
        const res = await fetch("/backend/subuser/list", {
          credentials: "include",
        });
        const data = await res.json();
        const target = data.find((user) => user._id === id);
        if (!target) throw new Error("Sub-user not found");
        setFormData({
          role: target.role || "",
          email: target.email || "",
          name: target.username || "",
          password: "",
          isActive: target.isActive || false,
        });
      } catch (err) {
        alert("Error loading sub-user");
      }
    };
    fetchSubUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/backend/subuser/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          role: formData.role,
          email: formData.email,
          name: formData.name,
          password: formData.password || undefined, // Optional update
          isActive: formData.isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      alert("Sub-user updated successfully");
      navigate("/usermanagement");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="w-full lg:w-64 mb-10 lg:mb-0">
            <Suppliersidebar />
          </aside>

          <main className="flex-grow w-full">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-6">Update Sub User</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Role */}
                <div>
                  <label className="block text-sm font-medium mb-1">Role:</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  >
                    <option value="">Select Role</option>
                    <option value="Full Supplier Access">Full Supplier Access</option>
                    <option value="Asset Management Control">Asset Management Control</option>
                  </select>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">Email:</label>
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
                  <label className="block text-sm font-medium mb-1">Name:</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                {/* Password (optional) */}
                <div>
                  <label className="block text-sm font-medium mb-1">Password (optional):</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  />
                </div>

                {/* isActive Toggle */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                  <label className="text-sm font-medium">Active</label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/usermanagement")}
                    className="border border-gray-300 text-gray-700 px-5 py-2 rounded text-sm hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${
                      loading
                        ? "bg-orange-300 cursor-not-allowed"
                        : "bg-orange-500 hover:bg-orange-600"
                    } text-white px-6 py-2 rounded text-sm`}
                  >
                    {loading ? "Updating..." : "Update"}
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