import express from "express";
import { addToCart, getCart, removeFromCart ,updateCartItem} from "../controllers/cartController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.use(protect);
router.use(protect);

// 🚫 Block admin from cart APIs
router.use((req, res, next) => {
  if (req.user.role === "admin") {
    return res.status(403).json({
      message: "Admins cannot access cart"
    });
  }
  next();
});

router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:productId", removeFromCart);
router.delete("/:productId", protect, removeFromCart);
router.put("/", protect, updateCartItem);


export default router;
