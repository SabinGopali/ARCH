import React, { useState, useEffect, useRef } from "react";
import {
  FiFolder,
  FiSearch,
  FiChevronDown,
  FiChevronRight,
  FiPlus,
  FiX,
  FiTrash2,
} from "react-icons/fi";
import Suppliersidebar from "./Suppliersidebar"; // Make sure this exists

const foldersData = [
  { id: 1, name: "Women", type: "System", date: "09.06.2024" },
];

const staticImages = [
  {
    id: 101,
    name: "Sunset Beach",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=150&q=80",
    type: "Image",
    date: "10.07.2025",
  },
  {
    id: 102,
    name: "Mountain View",
    url: "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=150&q=80",
    type: "Image",
    date: "15.07.2025",
  },
  {
    id: 103,
    name: "City Lights",
    url: "https://images.unsplash.com/photo-1468071174046-657d9d351a40?auto=format&fit=crop&w=150&q=80",
    type: "Image",
    date: "20.07.2025",
  },
];

function getImageUrl(imagePath) {
  if (!imagePath) return "";
  let url = String(imagePath).replace(/\\/g, "/");
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.startsWith("/")) url = url.slice(1);
    const base = (typeof window !== "undefined" && window.location && window.location.origin)
      ? (window.location.origin.includes("localhost") ? "http://localhost:3000" : window.location.origin)
      : "http://localhost:3000";
    url = `${base}/${url}`;
  }
  return url;
}

function Mediacenter() {
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    fileId: null,
  });
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [folderExpanded, setFolderExpanded] = useState(true);
  const [openFolderId, setOpenFolderId] = useState(null);
  const [imageFolderMap, setImageFolderMap] = useState({});
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const contextMenuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        setContextMenu({ ...contextMenu, visible: false });
      }
    }
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, [contextMenu]);

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
            type: "Image",
            date: "",
          }));
          setFolders(normalizedFolders);
          setImages(normalizedImages);
        }
      } catch (e) {
        // swallow for now
      }
    };
    loadMedia();
  }, []);

  const filteredFolders = folders.filter((folder) =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFolder = async () => {
    const trimmedName = newFolderName.trim();
    if (!trimmedName) {
      alert("Folder name cannot be empty");
      return;
    }
    if (
      folders.some((f) => f.name.toLowerCase() === trimmedName.toLowerCase())
    ) {
      alert("Folder with this name already exists");
      return;
    }
    try {
      const res = await fetch("/backend/media/folder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: trimmedName }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create folder");
        return;
      }
      const f = data.folder;
      const newFolder = {
        id: f._id,
        name: f.name,
        type: "Custom",
        date: f.createdAt ? new Date(f.createdAt).toLocaleDateString("en-GB") : "",
        path: f.path,
      };
      setFolders([newFolder, ...folders]);
      setNewFolderName("");
      setIsCreatingFolder(false);
    } catch (e) {
      alert("Failed to create folder");
    }
  };

  function toggleFolderExpand() {
    setFolderExpanded((v) => !v);
  }

  const handleContextMenu = (e, fileId) => {
    e.preventDefault();
    setSelectedFileId(fileId);
    setContextMenu({
      visible: true,
      x: e.pageX,
      y: e.pageY,
      fileId,
    });
  };

  const handleMenuAction = (action) => {
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
      setContextMenu({ ...contextMenu, visible: false });
      return;
    }
    alert(`You clicked ${action} on file ID: ${selectedFileId}`);
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleDropOnFolder = (e, folderId) => {
    e.preventDefault();
    const draggedImageId = e.dataTransfer.getData("imageId");
    if (draggedImageId) {
      setImageFolderMap((prev) => ({
        ...prev,
        [draggedImageId]: folderId,
      }));
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
       
         <aside className="w-full lg:w-64 mb-10 lg:mb-0">
                     <Suppliersidebar />
          </aside>
       

        {/* Main Content */}
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
                    title="Create Folder"
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
                      title="Add Folder"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsCreatingFolder(false);
                        setNewFolderName("");
                      }}
                      className="text-gray-500 hover:text-gray-700 transition"
                      title="Cancel"
                    >
                      <FiX size={24} />
                    </button>
                  </div>
                )}
              </div>
            </header>

            {/* Search Bar */}
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

            {/* Folders Section */}
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
                        className={`flex items-center gap-2 border rounded-md px-3 py-2 shadow-sm cursor-pointer transition bg-white min-w-[140px] relative
                          ${
                            openFolderId === id
                              ? "border-orange-500 shadow-md"
                              : "border-gray-200 hover:shadow-md"
                          }
                        `}
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

                        {/* Delete folder button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (
                              window.confirm(
                                `Are you sure you want to delete folder "${name}"?`
                              )
                            ) {
                              setFolders((prev) =>
                                prev.filter((folder) => folder.id !== id)
                              );
                              // Remove image assignments to deleted folder
                              setImageFolderMap((prev) => {
                                const newMap = { ...prev };
                                Object.keys(newMap).forEach((imgId) => {
                                  if (newMap[imgId] === id) delete newMap[imgId];
                                });
                                return newMap;
                              });
                              if (openFolderId === id) setOpenFolderId(null);
                            }
                          }}
                          title="Delete Folder"
                          className="text-red-500 hover:text-red-700 transition p-1 rounded-md"
                          aria-label={`Delete folder ${name}`}
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Show all images button if folder open */}
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

            {/* Images Section */}
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
                      className="border border-gray-200 rounded-md px-2 py-2 shadow-sm hover:shadow-md cursor-pointer transition bg-white min-w-[140px] flex flex-col items-center"
                      title={`${name} - ${type} - ${date}`}
                      onContextMenu={(e) => handleContextMenu(e, id)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("imageId", id);
                      }}
                    >
                      <img
                        src={url}
                        alt={name}
                        className="w-32 h-20 object-cover rounded-md mb-2"
                        loading="lazy"
                      />
                      <span className="text-sm font-semibold text-gray-800">{name}</span>
                      <span className="text-xs text-gray-400">
                        {type} • {date}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Context Menu */}
            {contextMenu.visible && (
              <ul
                ref={contextMenuRef}
                style={{ top: contextMenu.y, left: contextMenu.x }}
                className="fixed bg-white border border-gray-300 rounded-md shadow-lg w-48 text-gray-700 text-sm z-50"
              >
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => handleMenuAction("Assign/Edit to Product")}
                >
                  Assign/Edit to Product
                </li>
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => handleMenuAction("Rename")}
                >
                  Rename
                </li>
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => handleMenuAction("Download")}
                >
                  Download
                </li>
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer text-red-600"
                  onClick={() => handleMenuAction("Send Trash")}
                >
                  Send Trash
                </li>
                <li
                  className="px-4 py-2 hover:bg-orange-100 cursor-pointer"
                  onClick={() => handleMenuAction("Cleanup Folder")}
                >
                  Cleanup Folder
                </li>
              </ul>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default Mediacenter;