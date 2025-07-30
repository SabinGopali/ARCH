import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import Slider from "@mui/material/Slider";
import { Dialog, DialogActions, DialogContent } from "@mui/material";
import Suppliersidebar from "./Suppliersidebar";

// Image cropping utility
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

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(URL.createObjectURL(blob));
      }, "image/jpeg");
    });
  });
}

export default function Store() {
  const [storeName, setStoreName] = useState("Rocky Mountain High");
  const [city, setCity] = useState("Nepal");
  const [street, setStreet] = useState("");
  const [postCode, setPostCode] = useState("");

  const [logo, setLogo] = useState(null);
  const [bgImage, setBgImage] = useState(null);

  const [imageToCrop, setImageToCrop] = useState(null);
  const [croppingFor, setCroppingFor] = useState("logo");
  const [openCrop, setOpenCrop] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
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
    const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels, zoom);
    if (croppingFor === "logo") {
      setLogo(croppedImage);
    } else {
      setBgImage(croppedImage);
    }
    setOpenCrop(false);
  };

  const handleSave = () => {
    const storeData = {
      storeName,
      city,
      street,
      postCode,
      logo,
      bgImage,
      openingHours,
    };
    console.log("Saving store data:", storeData);
    alert("Store profile saved! (check console for data)");
  };

  const mapQuery = encodeURIComponent(`${street}, ${city}, ${postCode}`);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-4 md:p-8 lg:flex lg:gap-8 relative z-10">
        <aside className="hidden lg:block w-62 sticky top-6 self-start">
          <Suppliersidebar sidebarOpen={true} setSidebarOpen={() => {}} />
        </aside>

        <main className="flex-1 shadow-md rounded-xl overflow-hidden bg-white p-6">
          <h2 className="text-xl font-semibold text-gray-800">Store Profile</h2>
          <p className="text-gray-500 mb-6">
            Edit contact data that will be visible for your users on store’s profile
          </p>

          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 mb-8">
            {/* Logo Upload */}
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                {logo ? (
                  <img src={logo} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-gray-600">Logo</span>
                )}
              </div>
              <input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "logo")}
                className="hidden"
              />
              <label
                htmlFor="logoUpload"
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded shadow"
              >
                Upload Logo
              </label>
            </div>

            {/* Background Image Upload */}
            <div className="flex flex-col items-center justify-center gap-3 w-full">
              <div className="w-full rounded-lg overflow-hidden bg-gray-100">
                {bgImage ? (
                  <img
                    src={bgImage}
                    alt="Background Preview"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 flex items-center justify-center text-lg font-bold text-gray-600">
                    Background Image
                  </div>
                )}
              </div>
              <input
                id="bgUpload"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, "background")}
                className="hidden"
              />
              <label
                htmlFor="bgUpload"
                className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-1 rounded shadow"
              >
                Upload Background Image
              </label>
            </div>
          </div>

          {/* Store Name + Address */}
          <label className="block text-sm font-semibold mb-1 text-gray-600">Your Store Name</label>
          <input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-2 mb-6"
          />

          <h3 className="font-bold text-sm text-gray-600 uppercase mb-2">Store Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500">City</label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Street</label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Post Code</label>
              <input
                value={postCode}
                onChange={(e) => setPostCode(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-md px-4 py-2"
              />
            </div>
          </div>

          {/* Google Map */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Map Preview</h4>
            <div className="border rounded-lg overflow-hidden h-64 w-full">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps?q=${mapQuery || "Asia"}&output=embed`}
                allowFullScreen
                loading="lazy"
                title="Store Location Map"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div className="mb-6">
            <h3 className="font-bold text-sm text-gray-600 uppercase mb-2">Opening Hours</h3>
            {openingHours.map(({ day, open, close, enabled }) => (
              <div key={day} className="flex items-center gap-4 mb-4">
                <label className="flex items-center gap-2 w-28">
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleToggle(day)}
                    className="accent-purple-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{day}</span>
                </label>
                <input
                  type="time"
                  value={open}
                  onChange={(e) => updateTime(day, "open", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-24"
                  disabled={!enabled}
                />
                <span>–</span>
                <input
                  type="time"
                  value={close}
                  onChange={(e) => updateTime(day, "close", e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-24"
                  disabled={!enabled}
                />
              </div>
            ))}
          </div>

          <button
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded shadow"
          >
            Save Store Profile
          </button>
        </main>
      </div>

      {/* Cropping Dialog */}
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
          <div className="mt-4">
            <Slider
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button onClick={() => setOpenCrop(false)} className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button onClick={handleCropSave} className="text-sm px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white">
            Save
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
