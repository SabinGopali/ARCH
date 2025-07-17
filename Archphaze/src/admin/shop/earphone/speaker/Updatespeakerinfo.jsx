import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "../../../Sidebar";

export default function Updatespeakerinfo() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    client_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const res = await fetch(`/backend/client/getallclients/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch client info");
        } else {
          setFormData({
            company_name: data.company_name || "",
            description: data.description || "",
            client_image: null,
          });
          setPreviewImage(data.client_image || null);
        }
      } catch (err) {
        setError(err.message || "Something went wrong while fetching data.");
      } finally {
        setFetching(false);
      }
    };

    if (id) {
      fetchClient();
    } else {
      setError("No client ID provided.");
      setFetching(false);
    }
  }, [id]);

  const handleChange = (e) => {
    if (e.target.type === "file") {
      const file = e.target.files[0];
      setFormData({ ...formData, client_image: file });
      setPreviewImage(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.company_name.trim()) return setError("Company name is required.");
    if (!formData.description.trim()) return setError("Description is required.");

    try {
      setLoading(true);
      setError("");

      const updateData = new FormData();
      updateData.append("company_name", formData.company_name);
      updateData.append("description", formData.description);
      if (formData.client_image) updateData.append("client_image", formData.client_image);
      updateData.append("userRef", currentUser._id);
      updateData.append("userMail", currentUser.email);

      const res = await fetch(`/backend/client/update/${id}`, {
        method: "POST",
        body: updateData,
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        return setError(data.message || "Failed to update client info.");
      }

      alert("Client information updated successfully!");
      navigate("/clientinfo");
    } catch (err) {
      setError(err.message || "Something went wrong.");
      setLoading(false);
    }
  };

  const handleCancelOrBack = () => {
    if (
      !formData.client_image &&
      formData.company_name.trim() === "" &&
      formData.description.trim() === ""
    ) {
      navigate(-1);
    } else {
      setFormData({
        company_name: "",
        description: "",
        client_image: null,
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
          <p>Loading client info...</p>
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
            Update Client Details
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Client Image Upload */}
            <div>
              <label htmlFor="client_image" className="block text-sm font-medium text-gray-700 mb-1">
                Client Image
              </label>
              <input
                id="client_image"
                type="file"
                accept="image/*"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Client"
                  className="mt-4 w-32 h-32 object-contain rounded shadow"
                />
              )}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                id="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Tech Solutions"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g. IT company specializing in web apps..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none"
              ></textarea>
            </div>

            {/* Error */}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300 shadow-md"
              >
                {formData.company_name || formData.description || formData.client_image
                  ? "Clear"
                  : "Back"}
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
