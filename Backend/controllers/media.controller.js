import fs from "fs";
import path from "path";
import MediaFolder from "../models/mediaFolder.model.js";

const uploadsRoot = path.join(process.cwd(), "uploads");

function walkDirCollectFiles(dirPath, baseUrlPrefix) {
  const entries = fs.existsSync(dirPath) ? fs.readdirSync(dirPath, { withFileTypes: true }) : [];
  const files = [];
  const allowedImageExt = new Set([".jpeg", ".jpg", ".png", ".webp", ".gif"]);
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDirCollectFiles(fullPath, baseUrlPrefix));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (!allowedImageExt.has(ext)) continue; // Only expose images for now
      const relativePath = path.relative(uploadsRoot, fullPath).split(path.sep).join("/");
      const url = `/uploads/${relativePath}`;
      files.push({ name: entry.name, url });
    }
  }
  return files;
}

export async function listMedia(req, res) {
  try {
    // Collect all files under uploads
    const files = walkDirCollectFiles(uploadsRoot, "/uploads");

    // Return folders from DB
    const folders = await MediaFolder.find().sort({ createdAt: -1 });

    return res.json({ files, folders });
  } catch (err) {
    return res.status(500).json({ error: "Failed to list media", details: err.message });
  }
}

export async function createFolder(req, res) {
  try {
    const { name } = req.body || {};
    if (!name || !String(name).trim()) {
      return res.status(400).json({ error: "Folder name is required" });
    }

    // Create DB entry only (UI is virtual folders; not mapping to disk)
    const folder = await MediaFolder.create({ name: String(name).trim() });
    return res.status(201).json({ folder });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create folder", details: err.message });
  }
}