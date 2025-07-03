import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Addservicesinfo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add your save logic here
    console.log({ title, description, video });
    alert("Service added successfully!");
    navigate("/services-info");
  };

  const handleCancelOrBack = () => {
    if (title === "" && description === "" && video === "") {
      navigate(-1);
    } else {
      setTitle("");
      setDescription("");
      setVideo("");
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
            Add Service Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="group">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Service Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                placeholder="e.g. Web Development"
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
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm resize-none"
                placeholder="e.g. Creating scalable and responsive websites..."
              ></textarea>
            </div>

            {/* Video URL Field */}
            <div className="group">
              <label
                htmlFor="video"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Video URL
              </label>
              <input
                id="video"
                type="url"
                value={video}
                onChange={(e) => setVideo(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
                placeholder="e.g. https://example.com/video.mp4"
              />
              {video && (
                <video
                  src={video}
                  controls
                  className="mt-4 w-full max-h-52 rounded-lg shadow"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
              >
                {title === "" && description === "" && video === ""
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
