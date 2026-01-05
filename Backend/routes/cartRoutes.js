import express from "express";
import { addToCart, getCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:productId", removeFromCart);

export default router;
