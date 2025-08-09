  import React, { useState, useCallback } from "react";
  import Cropper from "react-easy-crop";
  import Slider from "@mui/material/Slider";
  import { Dialog, DialogActions, DialogContent } from "@mui/material";
  import Suppliersidebar from "../Suppliersidebar";
  import { useNavigate } from "react-router-dom";

  function getCroppedImg(imageSrc, crop, zoom) {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = () => resolve(image);
        image.onerror = reject;
        image.src = url;
      });

    return createImage(imageSrc).then((image) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = crop.width;
      canvas.height = crop.height;

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );

      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to crop image."));
          }
        }, "image/jpeg");
      });
    });
  }

  export default function StoreProfile() {
    const navigate = useNavigate();

    const [companyDescription, setCompanyDescription] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [postCode, setPostCode] = useState("");
    const [logoFile, setLogoFile] = useState(null);
    const [bgImageFile, setBgImageFile] = useState(null);

    const [imageToCrop, setImageToCrop] = useState(null);
    const [croppingFor, setCroppingFor] = useState("logo");
    const [openCrop, setOpenCrop] = useState(false);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const daysOfWeek = [
      "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
    ];
    const [openingHours, setOpeningHours] = useState(
      daysOfWeek.map((day) => ({
        day,
        open: "10:00",
        close: "18:00",
        enabled: true,
      }))
    );

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
        const croppedBlob = await getCroppedImg(imageToCrop, croppedAreaPixels, zoom);
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

    const getPreview = (fileOrPath) => {
      if (!fileOrPath) return null;
      return typeof fileOrPath === "string"
        ? fileOrPath
        : URL.createObjectURL(fileOrPath);
    };

    const fullAddress = [street, city, "Nepal", postCode].filter(Boolean).join(", ");
    const mapQuery = encodeURIComponent(fullAddress || "Nepal");

    const handleSave = async () => {
      try {
        const form = new FormData();
        form.append("companyDescription", companyDescription);
        form.append("city", city);
        form.append("street", street);
        form.append("postCode", postCode);
        form.append("openingHours", JSON.stringify(openingHours));
        if (logoFile instanceof File) form.append("logo", logoFile);
        if (bgImageFile instanceof File) form.append("bgImage", bgImageFile);

        const res = await fetch("/backend/store/create", {
          method: "POST",
          body: form,
          credentials: "include",
        });

        const data = await res.json();

        console.log("Backend response:", data);

        if (!res.ok) {
          const errorMessage =
            data?.message && data.message !== "Failed to save store profile"
              ? data.message
              : `Server responded with ${res.status}. Please check your input.`;

          alert(`Failed to save store profile: ${errorMessage}`);
          return;
        }

        alert("Store profile saved successfully!");
        navigate("/storeprofile"); // or wherever you want to redirect
      } catch (err) {
        console.error("Unexpected error:", err);
        alert("Unexpected error occurred. Please try again later.");
      }
    };

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="p-4 md:p-8 lg:flex lg:gap-8 relative z-10">
          <aside className="hidden lg:block w-62 sticky top-6 self-start">
            <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
          </aside>

          <main className="flex-1 shadow-md rounded-xl overflow-hidden bg-white p-6">
            <h2 className="text-xl font-semibold text-gray-800">Store Profile</h2>
            <p className="text-gray-500 mb-6">Edit your store’s public information</p>

            {/* Logo Upload */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                {getPreview(logoFile) ? (
                  <img src={getPreview(logoFile)} className="w-full h-full object-cover" alt="Logo" />
                ) : (
                  <span className="flex h-full items-center justify-center text-gray-600">Logo</span>
                )}
              </div>
              <input type="file" id="logoUpload" accept="image/*" onChange={(e) => handleImageChange(e, "logo")} className="hidden" />
              <label htmlFor="logoUpload" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded cursor-pointer">Upload Logo</label>
            </div>

            {/* Background Upload */}
            <div className="flex flex-col items-center gap-3 mb-6">
              <div className="w-full h-40 bg-gray-100 overflow-hidden rounded-lg">
                {getPreview(bgImageFile) ? (
                  <img src={getPreview(bgImageFile)} className="w-full h-full object-cover" alt="Background" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-600">Background Image</div>
                )}
              </div>
              <input type="file" id="bgUpload" accept="image/*" onChange={(e) => handleImageChange(e, "background")} className="hidden" />
              <label htmlFor="bgUpload" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded cursor-pointer">Upload Background</label>
            </div>

            {/* Company Description */}
            <label className="block text-sm font-semibold mb-1 text-gray-600">Company Description</label>
            <textarea
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded px-4 py-2 mb-6"
              placeholder="Write a brief description of your company"
            />

            {/* Store Address */}
            <h3 className="font-bold text-sm text-gray-600 uppercase mb-2">Store Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <input value="Nepal" disabled className="w-full border bg-gray-100 cursor-not-allowed px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">City</label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className="w-full border px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Street</label>
                <input value={street} onChange={(e) => setStreet(e.target.value)} className="w-full border px-4 py-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Post Code</label>
                <input value={postCode} onChange={(e) => setPostCode(e.target.value)} className="w-full border px-4 py-2" />
              </div>
            </div>

            {/* Map Preview */}
            <div className="mb-6">
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
            <div className="mb-6">
              <h3 className="font-bold text-sm text-gray-600 uppercase mb-2">Opening Hours</h3>
              {openingHours.map(({ day, open, close, enabled }) => (
                <div key={day} className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 w-28">
                    <input type="checkbox" checked={enabled} onChange={() => handleToggle(day)} />
                    <span className="text-sm font-medium">{day}</span>
                  </label>
                  <input type="time" value={open} onChange={(e) => updateTime(day, "open", e.target.value)} disabled={!enabled} className="border px-2 py-1 w-24" />
                  <span>–</span>
                  <input type="time" value={close} onChange={(e) => updateTime(day, "close", e.target.value)} disabled={!enabled} className="border px-2 py-1 w-24" />
                </div>
              ))}
            </div>

            <button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded">
              Save Store Profile
            </button>
          </main>
        </div>

        {/* Image Crop Dialog */}
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
            <Slider value={zoom} min={1} max={3} step={0.1} onChange={(e, zoom) => setZoom(zoom)} className="mt-4" />
          </DialogContent>
          <DialogActions>
            <button onClick={() => setOpenCrop(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
            <button onClick={handleCropSave} className="px-4 py-2 bg-purple-600 text-white rounded">Save</button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
