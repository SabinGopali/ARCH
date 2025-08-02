import express from "express";
import { createSubUser, deleteSubUser, getSubUsers, updateSubUser } from "../controllers/subuser.controller.js";
import { verifyToken } from "../utils/verifyuser.js";

const router = express.Router();

router.post("/create", verifyToken, createSubUser);

router.get("/list", verifyToken, getSubUsers);

router.delete("/delete/:id", verifyToken, deleteSubUser);

router.put("/update/:id", verifyToken, updateSubUser);

export default router;
