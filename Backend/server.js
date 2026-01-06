import express from "express";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorMiddleware.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"

connectDB();

// ✅ ENV CHECK (TEMP — remove later)
console.log("Cloudinary Check:", {
  cloud: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING"
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use(errorHandler);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoryRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
