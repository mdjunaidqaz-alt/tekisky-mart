import express from "express";
import { getAllUsers, getAdminStats } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import  {isAdmin}  from "../middleware/adminMiddleware.js";


const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.get("/stats", protect, isAdmin, getAdminStats);
export default router;
