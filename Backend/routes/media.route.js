import express from "express";
import { verifyToken } from "../utils/verifyuser.js";
import { requireAnySupplier } from "../utils/roles.js";
import { listMedia, createFolder } from "../controllers/media.controller.js";

const router = express.Router();

router.get("/list", verifyToken, requireAnySupplier, listMedia);
router.post("/folder", verifyToken, requireAnySupplier, createFolder);

export default router;