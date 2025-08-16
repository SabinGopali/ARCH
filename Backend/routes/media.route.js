import express from "express";
import { listMedia, createFolder } from "../controllers/media.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
import { requireAnySupplier } from "../utils/roles.js";

const router = express.Router();

// List all media files and folders (restricted to supplier-owned media)
router.get("/list", verifyToken, requireAnySupplier, listMedia);

// Create a new media folder
router.post("/folder", verifyToken, requireAnySupplier, createFolder);

export default router;
