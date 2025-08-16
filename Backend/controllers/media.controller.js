import fs from "fs";
import path from "path";
import MediaFolder from "../models/mediaFolder.model.js";

const uploadsRoot = path.join(process.cwd(), "uploads");

// Recursively collect image files from the uploads directory
function walkDirCollectFiles(dirPath) {
  const entries = fs.existsSync(dirPath)
    ? fs.readdirSync(dirPath, { withFileTypes: true })
    : [];

  const files = [];
  const allowedImageExt = new Set([".jpeg", ".jpg", ".png", ".webp", ".gif"]);

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      files.push(...walkDirCollectFiles(fullPath));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!allowedImageExt.has(ext)) continue; // Only include images

      const relativePath = path.relative(uploadsRoot, fullPath).split(path.sep).join("/");
      const url = `/uploads/${relativePath}`;
      files.push({ name: entry.name, url });
    }
  }

  return files;
}

// List all media files and folders
export async function listMedia(req, res) {
  try {
    const files = walkDirCollectFiles(uploadsRoot);
    const folders = await MediaFolder.find().sort({ createdAt: -1 });

    return res.json({ files, folders });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list media", details: err.message });
  }
}

// Create a new media folder in DB
export async function createFolder(req, res) {
  try {
    const { name } = req.body;

    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    const folder = await MediaFolder.create({ name: String(name).trim() });
    return res.status(201).json({ folder });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create folder", details: err.message });
  }
}
