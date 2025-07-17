import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar";

export default function Addteamsinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    Username: "",
    t_post: "",
    t_description: "",
    t_fblink: "",
    t_lnlink: "",
    t_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, t_image: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleCancelOrBack = () => {
    const hasData = Object.values(formData).some((val) => val);
    if (!hasData) {
      navigate(-1);
    } else {
      setFormData({
        Username: "",
        t_post: "",
        t_description: "",
        t_fblink: "",
        t_lnlink: "",
        t_image: null,
      });
      setPreviewImage(null);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.t_image) return setError("Team image is required.");
    if (!formData.Username.trim()) return setError("Username is required.");
    if (!formData.t_post.trim()) return setError("Post is required.");
    if (!formData.t_description.trim()) return setError("Description is required.");

    try {
      setLoading(true);
      setError("");

      const body = new FormData();
      body.append("t_image", formData.t_image);
      body.append("Username", formData.Username);
      body.append("t_post", formData.t_post);
      body.append("t_description", formData.t_description);
      body.append("t_fblink", formData.t_fblink);
      body.append("t_lnlink", formData.t_lnlink);
      body.append("userRef", currentUser._id);
      body.append("userMail", currentUser.email);

      const res = await fetch("/backend/team/create", {
        method: "POST",
        body,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.error || "Failed to create team member.");
      }

      alert("Team member created successfully!");
      navigate("/teamsinfo");
    } catch (err) {
      setLoading(false);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Add Team Member
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div>
              <label htmlFor="t_image" className="block text-sm font-medium text-gray-700 mb-1">
                Team Image
              </label>
              <input
                id="t_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-contain rounded shadow"
                />
              )}
            </div>

            {/* Username */}
            <div>
              <label htmlFor="Username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="Username"
                type="text"
                value={formData.Username}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>

            {/* Post */}
            <div>
              <label htmlFor="t_post" className="block text-sm font-medium text-gray-700 mb-1">
                Post
              </label>
              <input
                id="t_post"
                type="text"
                value={formData.t_post}
                onChange={handleChange}
                placeholder="e.g. UI/UX Designer"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="t_description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="t_description"
                rows={3}
                value={formData.t_description}
                onChange={handleChange}
                placeholder="Brief summary of the role or background."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm resize-none"
              />
            </div>

            {/* Facebook */}
            <div>
              <label htmlFor="t_fblink" className="block text-sm font-medium text-gray-700 mb-1">
                Facebook Link
              </label>
              <input
                id="t_fblink"
                type="url"
                value={formData.t_fblink}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="t_lnlink" className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn Link
              </label>
              <input
                id="t_lnlink"
                type="url"
                value={formData.t_lnlink}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black shadow-sm"
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 shadow-md"
              >
                {Object.values(formData).some((v) => v) ? "Clear" : "Back"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md disabled:opacity-50"
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
