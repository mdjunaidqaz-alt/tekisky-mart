import express from "express";
import { getAllUsers, getAdminStats, getAllOrders } from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import  {isAdmin}  from "../middleware/adminMiddleware.js";
import { updateOrderStatus } from "../controllers/adminController.js";


const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);
router.get("/stats", protect, isAdmin, getAdminStats);
router.get("/orders", protect, isAdmin, getAllOrders);
router.put("/orders/:id/status",protect,isAdmin, updateOrderStatus);

export default router;
