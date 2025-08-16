import express from "express";
import { listMedia, createFolder } from "../controllers/media.controller.js";

const router = express.Router();

router.get("/list", listMedia);
router.post("/folder", createFolder);

export default router;