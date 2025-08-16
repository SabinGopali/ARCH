import fs from "fs";
import path from "path";
import MediaFolder from "../models/mediaFolder.model.js";
import Product from "../models/product.model.js";

function getOwnerRef(req) {
  if (req.user?.isSubUser) {
    return req.user.supplierRef || req.user.supplierId;
  }
  return req.user?.id;
}

function toSlug(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\-\s_]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

const MEDIA_ROOT = path.join(process.cwd(), "uploads", "media");

export async function listMedia(req, res) {
  try {
    const userRef = getOwnerRef(req);
    if (!userRef) return res.status(400).json({ error: "Missing user context" });

    // Query only this supplier's product and variant images from DB
    const products = await Product.find({ userRef })
      .select("images variants createdAt")
      .lean();

    const seen = new Set();
    const files = [];

    const pushUrl = (url) => {
      if (!url) return;
      if (seen.has(url)) return;
      seen.add(url);
      files.push({ name: url.split("/").pop(), url });
    };

    for (const p of products) {
      (p.images || []).forEach(pushUrl);
      (p.variants || []).forEach((v) => (v.images || []).forEach(pushUrl));
    }

    // List folders from DB for this user
    const folders = await MediaFolder.find({ userRef }).sort({ createdAt: -1 }).lean();

    res.json({ files, folders });
  } catch (err) {
    res.status(500).json({ error: "Failed to list media" });
  }
}

export async function createFolder(req, res) {
  try {
    const userRef = getOwnerRef(req);
    const { name } = req.body;
    if (!userRef) return res.status(400).json({ error: "Missing user context" });
    if (!name || !String(name).trim()) return res.status(400).json({ error: "Folder name is required" });

    const slug = toSlug(name);
    if (!slug) return res.status(400).json({ error: "Invalid folder name" });

    // Ensure base dir exists
    const userMediaBase = path.join(MEDIA_ROOT, String(userRef));
    if (!fs.existsSync(userMediaBase)) {
      fs.mkdirSync(userMediaBase, { recursive: true });
    }

    const folderFsPath = path.join(userMediaBase, slug);
    const publicPath = path.join("/uploads", "media", String(userRef), slug);

    // Create folder on FS if needed
    if (!fs.existsSync(folderFsPath)) {
      fs.mkdirSync(folderFsPath, { recursive: true });
    }

    // Upsert in DB
    const existing = await MediaFolder.findOne({ userRef, slug });
    if (existing) {
      return res.status(200).json({ folder: existing });
    }

    const folder = await MediaFolder.create({ userRef, name: String(name).trim(), slug, path: publicPath });
    res.status(201).json({ folder });
  } catch (err) {
    res.status(500).json({ error: "Failed to create folder" });
  }
}