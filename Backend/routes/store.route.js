import express from "express";
import upload from "../middleware/multer.js";
import {
  createStoreProfile,
  updateStoreProfile,
  getStoreProfile,
  deleteStoreProfile,
} from "../controllers/store.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router();

router.get("/", getStoreProfile);

// Create profile route
router.post(
  "/create",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bgImage", maxCount: 1 },
  ]),
  createStoreProfile
);

// Update profile route
router.put(
  "/",
  verifyToken,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "bgImage", maxCount: 1 },
  ]),
  updateStoreProfile
);

router.delete("/:userId", verifyToken, deleteStoreProfile);

export default router;
