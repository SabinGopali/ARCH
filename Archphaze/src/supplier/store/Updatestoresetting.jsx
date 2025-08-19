import React, { useState, useEffect, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Suppliersidebar from "../Suppliersidebar";
import { useNavigate, useParams } from "react-router-dom";

// Placeholder cropping function — replace with your real one
async function getCroppedImg(imageSrc, crop, zoom) {
  // Stub: just returns original image blob for simplicity
  return fetch(imageSrc).then(res => res.blob());
}

export default function Updatestoresetting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [companyDescription, setCompanyDescription] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [postCode, setPostCode] = useState("");
  const [logoFile, setLogoFile] = useState(null); // can be File or string URL/path
  const [bgImageFile, setBgImageFile] = useState(null); // can be File or string URL/path

  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppingFor, setCroppingFor] = useState("logo");
  const [openCrop, setOpenCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];
  const [openingHours, setOpeningHours] = useState(
    daysOfWeek.map((day) => ({
      day,
      open: "10:00",
      close: "18:00",
      enabled: true,
    }))
  );

  useEffect(() => {
    if (!id) return;

    async function fetchProfile() {
      try {
        const res = await fetch(`/backend/store/get/${id}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          console.warn("No existing profile or error fetching");
          return;
        }

        const data = await res.json();
        if (data?.storeProfile) {
          const p = data.storeProfile;

          setCompanyDescription(p.companyDescription || "");
          setCity(p.city || "");
          setStreet(p.street || "");
          setPostCode(p.postCode || "");
          setLogoFile(p.logo || null);
          setBgImageFile(p.bgImage || null);

          if (Array.isArray(p.openingHours)) {
            const mappedHours = daysOfWeek.map((day) => {
              const oh = p.openingHours.find((o) => o.day === day);
              return oh
                ? {
                    day,
                    open: oh.open || "10:00",
                    close: oh.close || "18:00",
                    enabled: oh.enabled !== undefined ? oh.enabled : true,
                  }
                : {
                    day,
                    open: "10:00",
                    close: "18:00",
                    enabled: true,
                  };
            });
            setOpeningHours(mappedHours);
          }
        }
      } catch (error) {
        console.error("Failed to fetch store profile:", error);
      }
    }

    fetchProfile();
  }, [id]);

  const handleToggle = (day) => {
    setOpeningHours((prev) =>
      prev.map((entry) =>
        entry.day === day ? { ...entry, enabled: !entry.enabled } : entry
      )
    );
  };

  const updateTime = (day, field, value) => {
    setOpeningHours((prev) =>
      prev.map((entry) =>
        entry.day === day ? { ...entry, [field]: value } : entry
      )
    );
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageToCrop(reader.result);
        setCroppingFor(type);
        setOpenCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageToCrop, crop, zoom);
      const fileName = croppingFor === "logo" ? "logo.jpeg" : "background.jpeg";
      const file = new File([croppedBlob], fileName, { type: "image/jpeg" });

      if (croppingFor === "logo") {
        setLogoFile(file);
      } else {
        setBgImageFile(file);
      }
      setOpenCrop(false);
    } catch (error) {
      console.error("Cropping error:", error);
      alert("Failed to crop image. Please try again.");
    }
  };

  // FIXED getPreview function to handle both backend paths and File objects
  const getPreview = (fileOrPath) => {
    if (!fileOrPath) return null;

    if (typeof fileOrPath === "string") {
      // If string starts with http or https, return as is
      if (fileOrPath.startsWith("http") || fileOrPath.startsWith("https")) {
        return fileOrPath;
      } else {
        // Otherwise assume relative path from backend, prepend server URL
        return `http://localhost:3000/${fileOrPath}`;
      }
    }

    // If File object (from input), create temporary URL
    return URL.createObjectURL(fileOrPath);
  };

  const fullAddress = [street, city, "Nepal", postCode].filter(Boolean).join(", ");
  const mapQuery = encodeURIComponent(fullAddress || "Nepal");

  const handleSave = async () => {
    if (!id) {
      alert("User ID missing. Please log in.");
      return;
    }

    try {
      const form = new FormData();
      form.append("userId", id);
      form.append("companyDescription", companyDescription);
      form.append("city", city);
      form.append("street", street);
      form.append("postCode", postCode);
      form.append("openingHours", JSON.stringify(openingHours));
      if (logoFile instanceof File) form.append("logo", logoFile);
      else if (typeof logoFile === "string") form.append("logoPath", logoFile);
      if (bgImageFile instanceof File) form.append("bgImage", bgImageFile);
      else if (typeof bgImageFile === "string") form.append("bgImagePath", bgImageFile);

      const res = await fetch("/backend/store/create", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Failed to update store profile: ${data.message || res.statusText}`);
        return;
      }

      alert("Store profile updated successfully!");
      navigate("/storeprofile");
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Unexpected error occurred. Please try again later.");
    }
  };

return (
  <div className="min-h-screen bg-gray-100">
    {/* Mobile Sidebar Toggle */}
    <div className="px-4 py-4 lg:hidden">
      <button
        onClick={() => setSidebarOpen && setSidebarOpen((v) => !v)}
        className="p-2 bg-white border shadow rounded-md hover:bg-gray-100 transition"
        aria-label="Toggle Sidebar"
      >
        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    {/* Mobile Aside */}
    <aside
      className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:hidden`}
    >
      <Suppliersidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen || (()=>{})} />
    </aside>
    {sidebarOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden" onClick={() => setSidebarOpen && setSidebarOpen(false)} />
    )}

    <div className="p-4 md:p-8 lg:flex lg:gap-8 relative z-10">
      <aside className="hidden lg:block w-64 sticky top-6 self-start">
        <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
      </aside>
<main className="flex-1 shadow-md rounded-xl overflow-hidden bg-white p-6">
  <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Profile</h2>
  <p className="text-gray-500 mb-8">Edit your store’s public information</p>

  {/* Logo & Background side by side */}
  <div className="flex flex-col  md:gap-8 mb-8">
    {/* Logo Upload */}
    <div className="flex flex-col items-center gap-3 mb-6 md:mb-0 md:flex-1">
      <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
        {getPreview(logoFile) ? (
          <img src={getPreview(logoFile)} className="w-full h-full object-cover" alt="Logo" />
        ) : (
          <span className="flex h-full items-center justify-center text-gray-600">Logo</span>
        )}
      </div>
      <input
        type="file"
        id="logoUpload"
        accept="image/*"
        onChange={(e) => handleImageChange(e, "logo")}
        className="hidden"
      />
      <label
        htmlFor="logoUpload"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded cursor-pointer"
      >
        Upload Logo
      </label>
    </div>

    {/* Background Upload */}
    <div className="flex flex-col items-center gap-3 md:flex-1">
      <div className="w-full h-40 bg-gray-100 overflow-hidden rounded-lg">
        {getPreview(bgImageFile) ? (
          <img src={getPreview(bgImageFile)} className="w-full h-full object-cover" alt="Background" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            Background Image
          </div>
        )}
      </div>
      <input
        type="file"
        id="bgUpload"
        accept="image/*"
        onChange={(e) => handleImageChange(e, "background")}
        className="hidden"
      />
      <label
        htmlFor="bgUpload"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded cursor-pointer"
      >
        Upload Background
      </label>
    </div>
  </div>

  {/* Company Description */}
  <label className="block text-sm font-semibold mb-1 text-gray-600">Company Description</label>
  <textarea
    value={companyDescription}
    onChange={(e) => setCompanyDescription(e.target.value)}
    rows={4}
    className="w-full border border-gray-300 rounded px-4 py-2 mb-8"
    placeholder="Write a brief description of your company"
  />

  {/* Store Address in 2 columns */}
  <h3 className="font-bold text-sm text-gray-600 uppercase mb-3">Store Address</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
    <div>
      <label className="text-sm font-medium text-gray-500">Country</label>
      <input
        value="Nepal"
        disabled
        className="w-full border bg-gray-100 cursor-not-allowed px-4 py-2 rounded"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-500">City</label>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-500">Street</label>
      <input
        value={street}
        onChange={(e) => setStreet(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
    </div>
    <div>
      <label className="text-sm font-medium text-gray-500">Post Code</label>
      <input
        value={postCode}
        onChange={(e) => setPostCode(e.target.value)}
        className="w-full border px-4 py-2 rounded"
      />
    </div>
  </div>

  {/* Map Preview */}
  <div className="mb-8">
    <h4 className="text-sm font-semibold text-gray-600 mb-2">Map Preview</h4>
    <iframe
      src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
      title="Store Location"
      className="w-full h-64 border rounded-lg"
      allowFullScreen
      loading="lazy"
    />
  </div>

  {/* Opening Hours */}
  <div className="mb-8">
    <h3 className="font-bold text-sm text-gray-600 uppercase mb-3">Opening Hours</h3>
    {openingHours.map(({ day, open, close, enabled }) => (
      <div key={day} className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 w-28 cursor-pointer select-none">
          <input type="checkbox" checked={enabled} onChange={() => handleToggle(day)} />
          <span className="text-sm font-medium">{day}</span>
        </label>
        <input
          type="time"
          value={open}
          onChange={(e) => updateTime(day, "open", e.target.value)}
          disabled={!enabled}
          className="border px-2 py-1 w-24 rounded"
        />
        <span>–</span>
        <input
          type="time"
          value={close}
          onChange={(e) => updateTime(day, "close", e.target.value)}
          disabled={!enabled}
          className="border px-2 py-1 w-24 rounded"
        />
      </div>
    ))}
  </div>

  <button
    onClick={handleSave}
    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded transition-colors duration-200"
  >
    Save Store Profile
  </button>
</main>

    </div>

    {/* Image Crop Dialog remains unchanged */}
    <Dialog open={openCrop} onClose={() => setOpenCrop(false)} maxWidth="sm" fullWidth>
      <DialogContent>
        <div className="relative w-full h-[300px] bg-black">
          <Cropper
            image={imageToCrop}
            crop={crop}
            zoom={zoom}
            aspect={croppingFor === "logo" ? 1 : 16 / 9}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>
        <Slider
          value={zoom}
          min={1}
          max={3}
          step={0.1}
          onChange={(e, zoom) => setZoom(zoom)}
          className="mt-4"
        />
      </DialogContent>
      <DialogActions>
        <button onClick={() => setOpenCrop(false)} className="px-4 py-2 bg-gray-200 rounded">
          Cancel
        </button>
        <button onClick={handleCropSave} className="px-4 py-2 bg-purple-600 text-white rounded">
          Save
        </button>
      </DialogActions>
    </Dialog>
  </div>
);
}
