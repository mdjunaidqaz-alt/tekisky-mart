import express from "express";
import { getCategories, createCategory } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import {isAdmin} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protect, isAdmin, createCategory);

export default router;
