import express from "express";
import { placeOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { getOrderById } from "../controllers/orderController.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/my", protect, getMyOrders);
router.put("/:id", protect, isAdmin, updateOrderStatus);
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);


export default router;
