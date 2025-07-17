import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../Sidebar";

export default function Updateteamsinfo() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    username: "",
    post: "",
    post_description: "",
    facebook: "",
    linkedin: "",
    team_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        console.log("Fetching team with id:", id);
        const res = await fetch(`/backend/team/getallteams/${id}`);
        const data = await res.json();
        console.log("Response data:", data);

        if (!res.ok) {
          setError(data.message || "Failed to fetch team info");
          setFetching(false);
          return;
        }

        // Adjust these keys based on your backend response!
        setFormData({
          username: data.Username || "",
          post: data.t_post || "",
          post_description: data.t_description || "",
          facebook: data.t_fblink || "",
          linkedin: data.t_lnlink || "",
          team_image: null, // don't prefill file input, just preview image
        });

        setPreviewImage(
          data.t_image ? `http://localhost:3000/${data.t_image}` : null
        );
      } catch (err) {
        setError("Error fetching team info: " + err.message);
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchTeam();
    else {
      setError("No team ID provided.");
      setFetching(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, team_image: file }));
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username.trim()) return setError("Username is required.");
    if (!formData.post.trim()) return setError("Post is required.");
    if (!formData.post_description.trim())
      return setError("Description is required.");

    try {
      setLoading(true);
      setError("");

      const updateData = new FormData();
      updateData.append("Username", formData.username);
      updateData.append("t_post", formData.post);
      updateData.append("t_description", formData.post_description);
      updateData.append("t_fblink", formData.facebook);
      updateData.append("t_lnlink", formData.linkedin);
      if (formData.team_image)
        updateData.append("team_image", formData.team_image);
      updateData.append("userRef", currentUser._id);
      updateData.append("userMail", currentUser.email);

      const res = await fetch(`/backend/team/update/${id}`, {
        method: "POST", // or PUT if your backend expects it
        body: updateData,
      });

      const data = await res.json();
      if (!res.ok) return setError(data.message || "Failed to update team info.");

      alert("Team member updated successfully!");
      navigate("/teamsinfo");
    } catch (err) {
      setError("Update failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrBack = () => {
    const hasChanges =
      formData.username ||
      formData.post ||
      formData.post_description ||
      formData.facebook ||
      formData.linkedin ||
      formData.team_image;

    if (!hasChanges) {
      navigate(-1);
    } else {
      setFormData({
        username: "",
        post: "",
        post_description: "",
        facebook: "",
        linkedin: "",
        team_image: null,
      });
      setPreviewImage(null);
      setError("");
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-screen bg-white">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p>Loading team info...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Update Team Member
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div>
              <label
                htmlFor="team_image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Team Image
              </label>
              <input
                id="team_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
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
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Post */}
            <div>
              <label
                htmlFor="post"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Post
              </label>
              <input
                id="post"
                type="text"
                value={formData.post}
                onChange={handleChange}
                placeholder="e.g. UI/UX Designer"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="post_description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="post_description"
                rows={3}
                value={formData.post_description}
                onChange={handleChange}
                placeholder="Short bio or team role"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none"
              />
            </div>

            {/* Social Links */}
            <div>
              <label
                htmlFor="facebook"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Facebook
              </label>
              <input
                id="facebook"
                type="url"
                value={formData.facebook}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="linkedin"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                LinkedIn
              </label>
              <input
                id="linkedin"
                type="url"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-600 text-sm text-center">{error}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 shadow-md"
              >
                {formData.username || formData.team_image ? "Clear" : "Back"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-md disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
