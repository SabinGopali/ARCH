import express from "express";
import { listMedia, createFolder } from "../controllers/media.controller.js";

const router = express.Router();

// List all media files and folders
router.get("/list", listMedia);

// Create a new media folder
router.post("/folder", createFolder);

export default router;
