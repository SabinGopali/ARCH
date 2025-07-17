import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useSelector } from "react-redux";

export default function Addservicesinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) return setError("Service Title is required.");
    if (!description.trim()) return setError("Description is required.");
    if (!video) return setError("Video file is required.");

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("s_title", title);
      formData.append("s_description", description);
      formData.append("s_link", video);
      formData.append("userRef", currentUser._id);
      formData.append("userMail", currentUser.email);

      const res = await fetch("/backend/services/create", {
        method: "POST",
        body: formData, // No content-type header here
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.error || "Failed to add service.");
      }

      alert("Service added successfully!");
      navigate("/servicesinfo");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  const handleCancelOrBack = () => {
    if (!title && !description && !video) {
      navigate(-1);
    } else {
      setTitle("");
      setDescription("");
      setVideo(null);
      setVideoPreview(null);
      setError("");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Service Information
          </h2>

          {error && (
            <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="group">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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

            <div className="group">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
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

            <div className="group">
              <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Video File
              </label>
              <input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleVideoChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm"
              />
              {videoPreview && (
                <video
                  src={videoPreview}
                  controls
                  className="mt-4 w-full max-h-52 rounded-lg shadow"
                />
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 transition-all shadow-md hover:shadow-lg"
              >
                {!title && !description && !video ? "Back" : "Clear"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`${
                  loading
                    ? "bg-gray-400"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                } text-white px-6 py-2 rounded-lg transition-all shadow-md hover:shadow-xl`}
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
