import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("👉 __dirname =", __dirname);
console.log("👉 cwd =", process.cwd());
console.log(
  "👉 env path exists =",
  fs.existsSync(path.join(__dirname, ".env"))
);

// 🔥 Force dotenv to load THIS exact file
dotenv.config({ path: path.join(__dirname, ".env") });

console.log("👉 AFTER dotenv:", {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  CLOUD: process.env.CLOUDINARY_CLOUD_NAME
});

import "./server.js";
