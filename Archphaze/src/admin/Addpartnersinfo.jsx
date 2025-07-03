import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Addpartnersinfo() {
  const [logo, setLogo] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your actual save logic
    console.log({ logo, name, description, url });
    alert("Company details added successfully!");
    navigate("/partners-info"); // or wherever your list page is
  };

  const handleCancelOrBack = () => {
    if (logo === "" && name === "" && description === "" && url === "") {
      navigate(-1);
    } else {
      setLogo("");
      setName("");
      setDescription("");
      setUrl("");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Company Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo URL Field */}
            <div className="group">
              <label
                htmlFor="logo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Logo URL
              </label>
              <input
                id="logo"
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://example.com/logo.png"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
              />
              {logo && (
                <img
                  src={logo}
                  alt="Company Logo Preview"
                  className="mt-4 w-32 h-32 object-contain rounded shadow"
                />
              )}
            </div>

            {/* Company Name Field */}
            <div className="group">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tech Solutions"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
              />
            </div>

            {/* Description Field */}
            <div className="group">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Innovative tech company delivering software solutions."
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm resize-none"
              ></textarea>
            </div>

            {/* Company URL Field */}
            <div className="group">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Company Website URL
              </label>
              <input
                id="url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
              >
                {logo === "" &&
                name === "" &&
                description === "" &&
                url === ""
                  ? "Back"
                  : "Clear"}
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-md hover:shadow-xl"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
