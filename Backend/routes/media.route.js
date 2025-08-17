import express from "express";
import { listMedia, createFolder, deleteFolder } from "../controllers/media.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
import { requireAnySupplier } from "../utils/roles.js";

const router = express.Router();

// List all media files and folders (restricted to supplier-owned media)
router.get("/list", verifyToken, requireAnySupplier, listMedia);

// Create a new media folder
router.post("/folder", verifyToken, requireAnySupplier, createFolder);

// Delete a media folder by id
router.delete("/folder/:id", verifyToken, requireAnySupplier, deleteFolder);

export default router;