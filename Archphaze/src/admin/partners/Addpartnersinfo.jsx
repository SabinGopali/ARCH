import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useSelector } from "react-redux";

export default function Addpartnersinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    c_logo: "",
    c_name: "",
    c_description: "",
    c_link: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.c_name.trim()) return setError("Company Name is required");
    if (!formData.c_description.trim()) return setError("Description is required");
    if (!formData.c_logo.trim()) return setError("Company Logo URL is required");
    if (!formData.c_link.trim()) return setError("Company Website URL is required");

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/backend/Partners/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          userMail: currentUser.email,
        }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        return setError(data.message || "Failed to add company details.");
      }

      alert("Company details added successfully!");
      navigate("/partnersinfo");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleCancelOrBack = () => {
    if (
      formData.c_logo === "" &&
      formData.c_name === "" &&
      formData.c_description === "" &&
      formData.c_link === ""
    ) {
      navigate(-1);
    } else {
      setFormData({
        c_logo: "",
        c_name: "",
        c_description: "",
        c_link: "",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Company Details
          </h2>

          {error && (
            <p className="text-red-600 mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo URL Field */}
            <div>
              <label
                htmlFor="c_logo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Logo URL
              </label>
              <input
                id="c_logo"
                type="url"
                value={formData.c_logo}
                onChange={handleChange}
                placeholder="https://example.com/logo.png"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
              {formData.c_logo && (
                <img
                  src={formData.c_logo}
                  alt="Company Logo Preview"
                  className="mt-4 w-32 h-32 object-contain rounded shadow"
                />
              )}
            </div>

            {/* Company Name Field */}
            <div>
              <label
                htmlFor="c_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                id="c_name"
                type="text"
                value={formData.c_name}
                onChange={handleChange}
                placeholder="e.g. Tech Solutions"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>

            {/* Description Field */}
            <div>
              <label
                htmlFor="c_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="c_description"
                rows={4}
                value={formData.c_description}
                onChange={handleChange}
                placeholder="e.g. Innovative tech company delivering software solutions."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Company URL Field */}
            <div>
              <label
                htmlFor="c_link"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Website URL
              </label>
              <input
                id="c_link"
                type="url"
                value={formData.c_link}
                onChange={handleChange}
                placeholder="https://example.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 shadow-md"
              >
                {formData.c_logo === "" &&
                formData.c_name === "" &&
                formData.c_description === "" &&
                formData.c_link === ""
                  ? "Back"
                  : "Clear"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
