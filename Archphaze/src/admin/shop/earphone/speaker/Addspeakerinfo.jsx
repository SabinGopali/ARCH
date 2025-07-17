import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../Sidebar";

export default function Addspeakerinfo() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company_name: "",
    description: "",
    price: "",
    sizes: [],
    color: "",
    client_image: null,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sizeOptions = ["XS", "S", "M", "L", "XL"];
  const colorOptions = ["#FF0000", "#FFFFFF", "#00FFFF"]; // red, white, cyan

  const handleChange = (e) => {
    const { id, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      const reader = new FileReader();

      reader.onloadend = () => {
        setFormData({ ...formData, client_image: reader.result });
        setPreviewImage(reader.result);
      };

      if (file) reader.readAsDataURL(file);
    } else if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        sizes: prev.sizes.includes(value)
          ? prev.sizes.filter((s) => s !== value)
          : [...prev.sizes, value],
      }));
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };

  const handleColorSelect = (color) => {
    setFormData({ ...formData, color });
  };

  const handleCancelOrBack = () => {
    if (
      !formData.client_image &&
      formData.company_name.trim() === "" &&
      formData.description.trim() === "" &&
      formData.price === ""
    ) {
      navigate(-1);
    } else {
      setFormData({
        company_name: "",
        description: "",
        price: "",
        sizes: [],
        color: "",
        client_image: null,
      });
      setPreviewImage(null);
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.client_image) return setError("Product image is required.");
    if (!formData.company_name.trim()) return setError("Product name is required.");
    if (!formData.description.trim()) return setError("Description is required.");
    if (!formData.price.trim()) return setError("Price is required.");
    if (formData.sizes.length === 0) return setError("Please select at least one size.");
    if (!formData.color) return setError("Please select a color.");

    setLoading(true);
    setTimeout(() => {
      const existing = JSON.parse(localStorage.getItem("products") || "[]");

      const newEntry = {
        ...formData,
        createdAt: new Date().toISOString(),
        id: Date.now(),
      };

      localStorage.setItem("products", JSON.stringify([...existing, newEntry]));

      setLoading(false);
      alert("Product added successfully!");
      navigate("/speakerinfo");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg border border-transparent hover:border-gray-500 transition-all duration-300">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add Product Info</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Image Upload */}
            <div>
              <label htmlFor="client_image" className="block text-sm font-medium text-gray-700 mb-1">
                Product Image
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
                  alt="Preview"
                  className="mt-4 w-32 h-32 object-contain rounded shadow"
                />
              )}
            </div>

            {/* Product Name */}
            <div>
              <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                Product Name
              </label>
              <input
                id="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Headphones"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            </div>

            {/* Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (Rs.)
              </label>
              <input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1178"
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
                placeholder="e.g. A blend of streetwear and minimalism."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none"
              ></textarea>
            </div>

            {/* Select Sizes */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Select Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {sizeOptions.map((size) => (
                  <label
                    key={size}
                    className={`border px-3 py-1 rounded cursor-pointer text-sm ${
                      formData.sizes.includes(size)
                        ? "bg-black text-white"
                        : "bg-white text-black border-black"
                    }`}
                  >
                    <input
                      type="checkbox"
                      value={size}
                      checked={formData.sizes.includes(size)}
                      onChange={handleChange}
                      className="hidden"
                    />
                    {size}
                  </label>
                ))}
              </div>
            </div>

            {/* Select Color */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-2">Select Color</p>
              <div className="flex gap-3">
                {colorOptions.map((c) => (
                  <div
                    key={c}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                      formData.color === c ? "border-black" : "border-gray-300"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => handleColorSelect(c)}
                  ></div>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-2">
              <button
                type="button"
                onClick={handleCancelOrBack}
                className="bg-gray-200 text-gray-800 px-5 py-2 rounded-lg hover:bg-gray-300"
              >
                {formData.company_name || formData.description || formData.client_image ? "Clear" : "Back"}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50"
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
