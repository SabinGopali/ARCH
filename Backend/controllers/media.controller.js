import fs from "fs";
import path from "path";
import MediaFolder from "../models/mediaFolder.model.js";
import Product from "../models/product.model.js";
import StoreProfile from "../models/store.model.js";

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
        if (typeof imgPath === "string") {
          const normalized = imgPath.replace(/\\/g, "/");
          const url = normalized.startsWith("/") ? normalized : `/${normalized}`;
          if (url.startsWith("/uploads/")) {
            fileEntries.push({
              name: path.basename(url),
              url,
              type: "product",
            });
          }
        }
      });
      (product.variants || []).forEach((variant) => {
        (variant.images || []).forEach((imgPath) => {
          if (typeof imgPath === "string") {
            const normalized = imgPath.replace(/\\/g, "/");
            const url = normalized.startsWith("/") ? normalized : `/${normalized}`;
            if (url.startsWith("/uploads/")) {
              fileEntries.push({
                name: path.basename(url),
                url,
                type: "variant",
              });
            }
          }
        });
      });
    }

    // Include store profile images (logo and bgImage) for this supplier
    const storeProfile = await StoreProfile.findOne({ userId: ownerUserId }).select("logo bgImage");
    if (storeProfile) {
      const addStoreImage = (imgPathRaw) => {
        if (!imgPathRaw) return;
        const normalized = String(imgPathRaw).replace(/\\/g, "/");
        const url = normalized.startsWith("/") ? normalized : `/${normalized}`;
        if (url.startsWith("/uploads/")) {
          fileEntries.push({
            name: path.basename(url),
            url,
            type: "store",
          });
        }
      };
      addStoreImage(storeProfile.logo);
      addStoreImage(storeProfile.bgImage);
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

export async function deleteFolder(req, res) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Folder id is required" });
    }

    const ownerUserId = getActingOwnerUserIdFromReq(req);

    const deleted = await MediaFolder.findOneAndDelete({ _id: id, ownerUserId });
    if (!deleted) {
      return res.status(404).json({ error: "Folder not found" });
    }

    return res.json({ success: true, deletedId: id });
  } catch (err) {
    return res.status(500).json({ error: "Failed to delete folder", details: err.message });
  }
}

export async function renameFile(req, res) {
  try {
    const { currentUrl, newName } = req.body || {};
    if (!currentUrl || !newName) {
      return res.status(400).json({ error: "currentUrl and newName are required" });
    }

    const normalizeUploadsUrl = (input) => {
      if (!input) return null;
      let s = String(input).replace(/\\/g, "/").trim();
      const lower = s.toLowerCase();
      const idx = lower.indexOf("/uploads/");
      if (idx !== -1) {
        s = s.slice(idx);
      }
      if (s.toLowerCase().startsWith("uploads/")) {
        s = "/" + s;
      }
      const qIdx = s.indexOf("?");
      if (qIdx !== -1) s = s.slice(0, qIdx);
      const hIdx = s.indexOf("#");
      if (hIdx !== -1) s = s.slice(0, hIdx);
      s = s.replace(/\/{2,}/g, "/");
      if (!s.toLowerCase().startsWith("/uploads/")) {
        return null;
      }
      return s;
    };

    const oldUrl = normalizeUploadsUrl(currentUrl);
    if (!oldUrl) {
      return res.status(400).json({ error: "Invalid currentUrl" });
    }

    const sanitize = (name) => {
      const base = path.basename(String(name));
      const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "");
      return cleaned;
    };

    const oldDiskPath = path.join(process.cwd(), oldUrl.replace(/^\/+/g, ""));
    if (!fs.existsSync(oldDiskPath)) {
      return res.status(404).json({ error: "File not found" });
    }

    const dirOnDisk = path.dirname(oldDiskPath);
    const dirUrl = path.dirname(oldUrl).replace(/\\/g, "/");
    const oldExt = path.extname(oldDiskPath).toLowerCase();

    const requestedName = sanitize(newName);
    if (!requestedName) {
      return res.status(400).json({ error: "Invalid new name" });
    }

    const requestedExt = path.extname(requestedName);
    const finalFileName = requestedExt ? requestedName : `${requestedName}${oldExt}`;

    const newDiskPath = path.join(dirOnDisk, finalFileName);
    const newUrl = `${dirUrl}/${finalFileName}`.replace(/\\/g, "/");

    if (fs.existsSync(newDiskPath)) {
      return res.status(409).json({ error: "A file with the new name already exists" });
    }

    // Authorization: ensure the user owns references to this file in DB (product or store)
    const ownerUserId = getActingOwnerUserIdFromReq(req);

    const products = await Product.find({ userRef: ownerUserId }).select("images variants.images");
    const storeProfile = await StoreProfile.findOne({ userId: ownerUserId }).select("logo bgImage");

    const arrayContainsOldUrl = (arr) => (arr || []).some((img) => normalizeUploadsUrl(img) === oldUrl);

    const isReferencedByOwner =
      (products || []).some(
        (p) => arrayContainsOldUrl(p.images) || (p.variants || []).some((v) => arrayContainsOldUrl(v.images))
      ) ||
      (storeProfile &&
        (normalizeUploadsUrl(storeProfile.logo) === oldUrl ||
          normalizeUploadsUrl(storeProfile.bgImage) === oldUrl));

    if (!isReferencedByOwner) {
      return res.status(403).json({ error: "Not authorized to rename this file" });
    }

    // Perform disk rename
    await fs.promises.rename(oldDiskPath, newDiskPath);

    // Update DB references
    for (const product of products) {
      let changed = false;

      if (Array.isArray(product.images) && product.images.length) {
        let modified = false;
        const updated = product.images.map((img) => {
          const normalized = normalizeUploadsUrl(img);
          if (normalized && normalized === oldUrl) {
            modified = true;
            return newUrl;
          }
          return img;
        });
        if (modified) {
          product.images = updated;
          changed = true;
        }
      }

      if (Array.isArray(product.variants) && product.variants.length) {
        for (const variant of product.variants) {
          if (!Array.isArray(variant.images) || variant.images.length === 0) continue;
          let variantModified = false;
          const updatedVariantImages = variant.images.map((img) => {
            const normalized = normalizeUploadsUrl(img);
            if (normalized && normalized === oldUrl) {
              variantModified = true;
              return newUrl;
            }
            return img;
          });
          if (variantModified) {
            variant.images = updatedVariantImages;
            changed = true;
          }
        }
      }

      if (changed) {
        await product.save();
      }
    }

    if (storeProfile) {
      let updated = false;
      if (normalizeUploadsUrl(storeProfile.logo) === oldUrl) {
        storeProfile.logo = newUrl;
        updated = true;
      }
      if (normalizeUploadsUrl(storeProfile.bgImage) === oldUrl) {
        storeProfile.bgImage = newUrl;
        updated = true;
      }
      if (updated) {
        await storeProfile.save();
      }
    }

    return res.json({ success: true, currentUrl: oldUrl, newUrl, newName: finalFileName });
  } catch (err) {
    return res.status(500).json({ error: "Failed to rename file", details: err.message });
  }
}