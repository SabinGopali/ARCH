import express from "express";
import {
  createSubUser,
  deleteSubUser,
  getSubUsers,
  updateSubUser,
} from "../controllers/subuser.controller.js";
import { verifyToken } from "../utils/verifyuser.js";
import { requireSupplierOrFullAccess, requireAnySupplier } from "../utils/roles.js";

const router = express.Router();

router.post("/create", verifyToken, requireSupplierOrFullAccess, createSubUser);
router.get("/list", verifyToken, requireAnySupplier, getSubUsers);
router.delete("/delete/:id", verifyToken, requireSupplierOrFullAccess, deleteSubUser);
router.put("/update/:id", verifyToken, requireSupplierOrFullAccess, updateSubUser);

export default router;
