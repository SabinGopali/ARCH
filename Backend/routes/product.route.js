import express from "express";
import upload from "../middleware/multer.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getSupplierCategories,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router();

// Create product (with auth and file upload)
router.post(
  "/create",
  verifyToken,
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
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "variantImages_0", maxCount: 3 },
    { name: "variantImages_1", maxCount: 3 },
    { name: "variantImages_2", maxCount: 3 },
  ]),
  updateProduct
);

// Delete product by ID (with auth)
router.delete("/delete/:id", verifyToken, deleteProduct);

// Get single product by ID (no auth)
router.get("/get/:id", getProductById);

// Get all products (no auth)
router.get("/getall", getAllProducts);

// Get categories from supplier products (no auth)
router.get("/supplier-categories", getSupplierCategories);

export default router;
