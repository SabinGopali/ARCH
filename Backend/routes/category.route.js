import express from "express";
import upload from "../middleware/multer.js";
import {
  createCategory,
  getAllCategories,
  getCategoryByIdOrSlug,
  updateCategory,
  deleteCategory,
  getCategoriesForSuppliers,
  updateCategoryCounts,
} from "../controllers/category.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router();

// 🟢 CREATE Category (Admin only)
router.post(
  "/create",
  verifyToken,
  upload.single("image"),
  createCategory
);

// 🟡 GET all categories (with filtering options)
router.get("/getall", getAllCategories);

// 🟤 GET categories for suppliers (active categories only)
router.get("/suppliers", getCategoriesForSuppliers);

// 🟠 GET single category by ID or slug
router.get("/get/:identifier", getCategoryByIdOrSlug);

// 🔵 UPDATE Category (Admin only)
router.put(
  "/update/:id",
  verifyToken,
  upload.single("image"),
  updateCategory
);

// 🔴 DELETE Category (Admin only)
router.delete("/delete/:id", verifyToken, deleteCategory);

// 🟣 Update product counts for all categories (Admin only)
router.post("/update-counts", verifyToken, updateCategoryCounts);

export default router;