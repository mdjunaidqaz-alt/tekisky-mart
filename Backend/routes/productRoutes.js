import express from "express";
import multer from "multer";
import { createProduct, getProducts, deleteProduct } from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";
import  { isAdmin } from "../middleware/adminMiddleware.js";
import { updateProduct } from "../controllers/productController.js";
import { getSearchSuggestions } from "../controllers/productController.js";




const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", getProducts);
router.get("/suggestions", getSearchSuggestions);
router.post("/", protect, isAdmin, upload.array("images", 3), createProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.put("/:id",protect,isAdmin,upload.array("images", 3),updateProduct);


export default router;
