import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../Sidebar";
import { useSelector } from "react-redux";

export default function Updateservicesinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setVideo] = useState(null); // file object
  const [videoPreview, setVideoPreview] = useState(""); // preview url or existing src
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchServiceInfo = async () => {
      try {
        const res = await fetch(`/backend/services/getallservices/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch service information.");
          setFetching(false);
          return;
        }

        setTitle(data.s_title || "");
        setDescription(data.s_description || "");
        setVideoPreview(`http://localhost:3000${data.s_link || ""}`); // assumed s_link starts with /uploads/...
        setFetching(false);
      } catch (err) {
        setError(err.message || "Something went wrong while fetching data.");
        setFetching(false);
      }
    };

    if (id) {
      fetchServiceInfo();
    } else {
      setError("No service ID provided.");
      setFetching(false);
    }
  }, [id]);

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

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("s_title", title);
      formData.append("s_description", description);
      if (video) {
        formData.append("s_link", video);
      }
      formData.append("userRef", currentUser._id);
      formData.append("userMail", currentUser.email);

      const res = await fetch(`/backend/services/update/${id}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        return setError(data.message || "Failed to update service information.");
      }

      alert("Service information updated successfully!");
      navigate("/servicesinfo");
    } catch (err) {
      setError(err.message || "Something went wrong while updating.");
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
      setVideoPreview("");
      setError("");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Service Information
          </h2>

          {error && (
            <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
          )}

          {fetching ? (
            <p className="text-center">Loading service details...</p>
          ) : (
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
                  Upload New Video (optional)
                </label>
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
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
                  {loading ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
