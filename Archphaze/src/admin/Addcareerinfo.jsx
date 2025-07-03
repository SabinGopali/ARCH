import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Addcareerinfo() {
  const [position, setPosition] = useState("");
  const [vacancy, setVacancy] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your save logic here
  };

  const handleCancelOrBack = () => {
    if (position === "" && vacancy === "") {
      navigate(-1); // Go back to previous page
    } else {
      setPosition("");
      setVacancy("");
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
            Add Career Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Position Field */}
            <div className="group">
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Position Title
              </label>
              <input
                id="position"
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                placeholder="e.g. Frontend Developer"
              />
            </div>

            {/* Vacancy Field */}
            <div className="group">
              <label
                htmlFor="vacancy"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Number of Vacancies
              </label>
              <input
                id="vacancy"
                type="number"
                value={vacancy}
                onChange={(e) => setVacancy(e.target.value)}
                required
                min="1"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                placeholder="e.g. 2"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
              >
                {position === "" && vacancy === "" ? "Back" : "Clear"}
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
