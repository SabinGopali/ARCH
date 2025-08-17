import React, { useState, useEffect, useRef } from "react";
import {
  FiFolder,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiX,
  FiTrash2,
  FiMoreVertical,
} from "react-icons/fi";
import Suppliersidebar from "./Suppliersidebar"; // Ensure this exists

function getImageUrl(imagePath) {
  if (!imagePath) return "";
  let url = String(imagePath).replace(/\\/g, "/");
  // If already absolute, return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // Return relative path like /uploads/... so the dev proxy serves it
  if (!url.startsWith("/")) url = `/${url}`;
  return url;
}

function Mediacenter() {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpenForId, setMenuOpenForId] = useState(null);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [folderExpanded, setFolderExpanded] = useState(true);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [imageFolderMap, setImageFolderMap] = useState({});
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const menuRef = useRef(null);

  useEffect(() => {
    function onWindowClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpenForId(null);
      }
    }
    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, []);

  // Load media folders and files from backend
  useEffect(() => {
    const loadMedia = async () => {
      try {
        const res = await fetch("/backend/media/list", { credentials: "include" });
        const data = await res.json();
        if (res.ok) {
          const normalizedFolders = (data.folders || []).map((f) => ({
            id: f._id,
            name: f.name,
            type: "Custom",
            date: f.createdAt ? new Date(f.createdAt).toLocaleDateString("en-GB") : "",
            path: f.path,
          }));
          const normalizedImages = (data.files || []).map((f) => ({
            id: f.url,
            name: f.name || (f.url && f.url.split("/").pop()) || "image",
            url: getImageUrl(f.url),
            type: f.type === "variant" ? "Variant" : f.type === "store" ? "Store" : "Product",
            date: "",
          }));
          setFolders(normalizedFolders);
          setImages(normalizedImages);
        }
      } catch (e) {
        console.error("Failed to load media:", e);
      }
    };
    loadMedia();
  }, []);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add new folder
  const addFolder = async () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) return alert("Folder name cannot be empty");
    if (folders.some((f) => f.name.toLowerCase() === trimmedName.toLowerCase()))
      return alert("Folder with this name already exists");

    try {
      const res = await fetch("/backend/media/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: trimmedName }),
      });

      let data;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Backend did not return JSON:", text);
        alert("Server error: did not return JSON");
        return;
      }

      if (!res.ok) {
        return alert(data.error || "Failed to create folder");
      }

      const newFolder = {
        id: data.folder._id,
        name: data.folder.name,
        type: "Custom",
        date: data.folder.createdAt
          ? new Date(data.folder.createdAt).toLocaleDateString("en-GB")
          : "",
        path: data.folder.path,
      };

      setFolders([newFolder, ...folders]);
      setNewFolderName("");
      setIsCreatingFolder(false);
    } catch (e) {
      console.error("Create folder error:", e);
      alert("Failed to create folder");
    }
  };

  const toggleFolderExpand = () => setFolderExpanded((v) => !v);


  const handleMenuAction = async (action) => {
    if (action === "Download") {
      const file = images.find((img) => img.id === selectedFileId);
      if (file) {
        const a = document.createElement("a");
        a.href = file.url;
        a.download = file.name || "file";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else if (action === "Rename") {
      const file = images.find((img) => img.id === selectedFileId);
      if (!file) {
        setMenuOpenForId(null);
        return;
      }
      const suggested = file.name || (file.url.split("/").pop()) || "image";
      const newName = window.prompt("Enter new file name (with or without extension)", suggested);
      if (!newName || !newName.trim()) {
        setMenuOpenForId(null);
        return;
      }
      try {
        const res = await fetch("/backend/media/rename", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ currentUrl: file.url, newName: newName.trim() }),
        });
        const text = await res.text();
        let data;
        try { data = JSON.parse(text); } catch { data = null; }
        if (!res.ok) {
          alert((data && data.error) || `Failed to rename: ${res.status}`);
        } else {
          const updatedUrl = data.newUrl || file.url;
          const updatedName = data.newName || (updatedUrl.split("/").pop());
          setImages((prev) => prev.map((img) => (
            img.id === selectedFileId
              ? { ...img, id: updatedUrl, url: getImageUrl(updatedUrl), name: updatedName }
              : img
          )));
          setImageFolderMap((prev) => {
            if (!prev || !(selectedFileId in prev)) return prev;
            const copy = { ...prev };
            const folder = copy[selectedFileId];
            delete copy[selectedFileId];
            copy[updatedUrl] = folder;
            return copy;
          });
          setSelectedFileId(updatedUrl);
        }
      } catch (err) {
        console.error("Rename failed", err);
        alert("Failed to rename file");
      }
    }
    setMenuOpenForId(null);
  };

  const handleDropOnFolder = (e, folderId) => {
    e.preventDefault();
    const draggedImageId = e.dataTransfer.getData("imageId");
    if (draggedImageId) {
      setImageFolderMap((prev) => ({ ...prev, [draggedImageId]: folderId }));
      setOpenFolderId(folderId);
    }
  };

  const handleFolderClick = (folderId) => {
    setOpenFolderId((current) => (current === folderId ? null : folderId));
  };

  const imagesToShow = openFolderId
    ? images.filter((img) => imageFolderMap[img.id] === openFolderId)
    : images;

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-10">
      <div className="max-w-screen-2xl mx-auto px-4 lg:flex lg:gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 mb-10 lg:mb-0">
          <Suppliersidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <section className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Media Center</h1>
              <p className="text-gray-600">Images, Videos, Folders, PDF</p>
              <div className="ml-auto flex gap-3 items-center">
                {!isCreatingFolder ? (
                  <button
                    onClick={() => setIsCreatingFolder(true)}
                    className="bg-white text-black px-4 py-2.5 border border-black rounded-md text-sm shadow hover:bg-black hover:text-white transition flex items-center gap-1"
                  >
                    <FiPlus /> Create Folder
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="New folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") addFolder();
                        if (e.key === "Escape") {
                          setIsCreatingFolder(false);
                          setNewFolderName("");
                        }
                      }}
                      className="border border-gray-300 rounded-md px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
                    />
                    <button
                      onClick={addFolder}
                      className="bg-green-600 text-white px-3 py-1 rounded-md text-sm shadow hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingFolder(false);
                        setNewFolderName("");
                      }}
                      className="text-gray-500 hover:text-gray-700 transition"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
              <input
                type="search"
                placeholder="Search & Filter"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition"
              />
              <FiSearch className="absolute top-2.5 left-3 text-gray-400" size={20} />
            </div>

            {/* Folders */}
            <div className="mb-8">
              <div
                className="flex items-center gap-2 mb-3 cursor-pointer select-none"
                onClick={toggleFolderExpand}
              >
                {folderExpanded ? (
                  <FiChevronDown size={18} className="text-gray-600" />
                ) : (
                  <FiChevronRight size={18} className="text-gray-600" />
                )}
                <h2 className="font-semibold text-gray-700 text-lg select-none">Folders</h2>
              </div>

              {folderExpanded && (
                <div className="flex flex-wrap gap-4">
                  {filteredFolders.length === 0 ? (
                    <p className="text-gray-400">No folders found.</p>
                  ) : (
                    filteredFolders.map(({ id, name, type, date }) => (
                      <div
                        key={id}
                        className={`flex items-center gap-2 border rounded-md px-3 py-2 shadow-sm cursor-pointer transition bg-white min-w-[140px] relative ${
                          openFolderId === id
                            ? "border-orange-500 shadow-md"
                            : "border-gray-200 hover:shadow-md"
                        }`}
                        title={`${type} - ${date}`}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDropOnFolder(e, id)}
                        onClick={() => handleFolderClick(id)}
                      >
                        <FiFolder
                          className={`${
                            openFolderId === id ? "text-orange-600" : "text-orange-500"
                          }`}
                          size={20}
                        />
                        <div className="flex flex-col leading-tight flex-grow">
                          <span className="text-sm font-semibold text-gray-800">{name}</span>
                          <span className="text-xs text-gray-400">
                            {type} • {date}
                          </span>
                        </div>

                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Are you sure you want to delete folder "${name}"?`
                              )
                            ) {
                              try {
                                const res = await fetch(`/backend/media/folder/${id}`, {
                                  method: "DELETE",
                                  credentials: "include",
                                });
                                const text = await res.text();
                                let data;
                                try {
                                  data = JSON.parse(text);
                                } catch {
                                  console.error("Backend did not return JSON:", text);
                                }
                                if (!res.ok) {
                                  alert((data && data.error) || "Failed to delete folder");
                                  return;
                                }

                                setFolders((prev) =>
                                  prev.filter((folder) => folder.id !== id)
                                );
                                setImageFolderMap((prev) => {
                                  const newMap = { ...prev };
                                  Object.keys(newMap).forEach((imgId) => {
                                    if (newMap[imgId] === id) delete newMap[imgId];
                                  });
                                  return newMap;
                                });
                                if (openFolderId === id) setOpenFolderId(null);
                              } catch (err) {
                                console.error("Delete folder error:", err);
                                alert("Failed to delete folder");
                              }
                            }
                          }}
                          title="Delete Folder"
                          className="text-red-500 hover:text-red-700 transition p-1 rounded-md"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Show all images */}
            {openFolderId && (
              <div className="mb-4">
                <button
                  onClick={() => setOpenFolderId(null)}
                  className="text-sm text-blue-600 underline"
                >
                  Show All Images
                </button>
              </div>
            )}

            {/* Images */}
            <div>
              <h2 className="font-semibold text-gray-700 text-lg mb-4">
                {openFolderId
                  ? `Images in "${folders.find((f) => f.id === openFolderId)?.name}"`
                  : "All Images"}
              </h2>
              <div className="flex flex-wrap gap-4">
                {imagesToShow.length === 0 ? (
                  <p className="text-gray-400">No images to display.</p>
                ) : (
                  imagesToShow.map(({ id, name, url, type, date }) => (
                    <div
                      key={id}
                      className="border border-gray-200 rounded-md px-2 py-2 shadow-sm hover:shadow-md cursor-pointer transition bg-white min-w-[140px] flex flex-col items-stretch relative"
                      title={`${name} - ${type} - ${date}`}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData("imageId", id)}
                    >
                      <button
                        type="button"
                        aria-label="More actions"
                        className="absolute top-2 right-2 p-1 rounded hover:bg-gray-100 text-gray-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFileId(id);
                          setMenuOpenForId((prev) => (prev === id ? null : id));
                        }}
                      >
                        <FiMoreVertical size={18} />
                      </button>

                      <img
                        src={url}
                        alt={name}
                        className="w-32 h-20 object-cover rounded-md mb-2 mx-auto"
                        loading="lazy"
                      />
                      <span className="text-sm font-semibold text-gray-800 text-center">{name}</span>
                      <span className="text-xs text-gray-400 text-center">{type} • {date}</span>

                      {menuOpenForId === id && (
                        <ul ref={menuRef} className="absolute z-50 top-8 right-2 bg-white border border-gray-300 rounded-md shadow-lg w-48 text-gray-700 text-sm">
                          {["Rename", "Download"].map((action) => (
                            <li
                              key={action}
                              className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMenuAction(action);
                              }}
                            >
                              {action}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Mediacenter;