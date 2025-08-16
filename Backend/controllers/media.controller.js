import fs from "fs";
import path from "path";
import Product from "../models/product.model.js";

function getActingOwnerUserIdFromReq(req) {
	if (req.user?.isSubUser) {
		return req.user.supplierRef || req.user.supplierId;
	}
	return req.user?.id;
}

export const listMedia = async (req, res) => {
	try {
		const ownerUserId = getActingOwnerUserIdFromReq(req);
		if (!ownerUserId) {
			return res.status(403).json({ error: "Unauthorized" });
		}

		const products = await Product.find({ userRef: String(ownerUserId) }).select(
			"images variants"
		);

		const uniqueUrls = new Set();
		for (const product of products) {
			for (const url of product.images || []) {
				if (typeof url === "string" && url.trim()) uniqueUrls.add(url);
			}
			for (const variant of product.variants || []) {
				for (const url of variant.images || []) {
					if (typeof url === "string" && url.trim()) uniqueUrls.add(url);
				}
			}
		}

		const files = Array.from(uniqueUrls).map((url) => ({
			url,
			name: path.basename(url),
		}));

		return res.json({ folders: [], files });
	} catch (err) {
		return res.status(500).json({ error: "Failed to list media", details: err.message });
	}
};

export const createFolder = async (req, res) => {
	try {
		const ownerUserId = getActingOwnerUserIdFromReq(req);
		const rawName = String(req.body?.name || "").trim();
		if (!ownerUserId) return res.status(403).json({ error: "Unauthorized" });
		if (!rawName) return res.status(400).json({ error: "Folder name required" });

		const safeName = rawName.replace(/[^a-zA-Z0-9-_\s]/g, "").replace(/\s+/g, "-");
		const folderFsPath = path.join(process.cwd(), "uploads", "folders", String(ownerUserId), safeName);
		if (!fs.existsSync(folderFsPath)) {
			fs.mkdirSync(folderFsPath, { recursive: true });
		}

		const folder = {
			_id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
			name: rawName,
			path: path.join("/uploads/folders", String(ownerUserId), safeName).replace(/\\/g, "/"),
			createdAt: new Date().toISOString(),
		};

		return res.status(201).json({ folder });
	} catch (err) {
		return res.status(500).json({ error: "Failed to create folder", details: err.message });
	}
};