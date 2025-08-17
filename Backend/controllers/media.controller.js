import fs from "fs";
import path from "path";
import MediaFolder from "../models/mediaFolder.model.js";
import Product from "../models/product.model.js";

const uploadsRoot = path.join(process.cwd(), "uploads");

function getActingOwnerUserIdFromReq(req) {
  if (req.user?.isSubUser) {
    return req.user.supplierRef || req.user.supplierId;
  }
  return req.user?.id;
}

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
    const ownerUserId = getActingOwnerUserIdFromReq(req);

    // Gather images from products owned by this user (including variant images)
    const products = await Product.find({ userRef: ownerUserId }).select("images variants.images");

    const fileEntries = [];

    for (const product of products) {
      (product.images || []).forEach((imgPath) => {
        if (typeof imgPath === "string" && imgPath.startsWith("/uploads/")) {
          fileEntries.push({
            name: path.basename(imgPath),
            url: imgPath,
            type: "product",
          });
        }
      });
      (product.variants || []).forEach((variant) => {
        (variant.images || []).forEach((imgPath) => {
          if (typeof imgPath === "string" && imgPath.startsWith("/uploads/")) {
            fileEntries.push({
              name: path.basename(imgPath),
              url: imgPath,
              type: "variant",
            });
          }
        });
      });
    }

    // Deduplicate by URL
    const urlToFile = new Map();
    for (const file of fileEntries) {
      if (!urlToFile.has(file.url)) {
        urlToFile.set(file.url, file);
      }
    }

    // Ensure the file actually exists on disk
    const files = Array.from(urlToFile.values())
      .filter((file) => {
        const diskPath = path.join(process.cwd(), file.url.replace(/^\/+/, ""));
        return fs.existsSync(diskPath);
      })
      .map((file) => ({ name: file.name, url: file.url, type: file.type }));

    // Only folders owned by this supplier
    const folders = await MediaFolder.find({ ownerUserId: ownerUserId }).sort({ createdAt: -1 });

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

    const ownerUserId = getActingOwnerUserIdFromReq(req);

    const folder = await MediaFolder.create({ name: String(name).trim(), ownerUserId });
    return res.status(201).json({ folder });
  } catch (err) {
    return res.status(500).json({ error: "Failed to create folder", details: err.message });
  }
}
