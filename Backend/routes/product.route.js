import express from "express";
import upload from "../middleware/multer.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateAvailability,
} from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
import { requireSupplierOrFullAccess, requireAnySupplier } from "../utils/roles.js";

const router = express.Router();

// Create product (with auth and file upload)
router.post(
  "/create",
  verifyToken,
  requireAnySupplier,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "variantImages_0", maxCount: 3 },
    { name: "variantImages_1", maxCount: 3 },
    { name: "variantImages_2", maxCount: 3 },
  ]),
  createProduct
);

// Update product by ID (with auth and file upload)
router.post(
  "/update/:id",
  verifyToken,
  requireAnySupplier,
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "variantImages_0", maxCount: 3 },
    { name: "variantImages_1", maxCount: 3 },
    { name: "variantImages_2", maxCount: 3 },
  ]),
  updateProduct
);

// Update only availability
router.patch(
  "/availability/:id",
  verifyToken,
  requireAnySupplier,
  updateAvailability
);

// Delete product by ID (with auth)
router.delete("/delete/:id", verifyToken, requireSupplierOrFullAccess, deleteProduct);

// Get single product by ID (no auth)
router.get("/get/:id", getProductById);

// Get all products (no auth)
router.get("/getall", getAllProducts);

export default router;