import Category from "../models/Category.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// ===============================
// ADMIN: CREATE CATEGORY
// ===============================
export const createCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    // 🔒 validation
    if (type === "trending" && !req.file) {
      return res
        .status(400)
        .json({ message: "Trending category requires an image" });
    }

    let imageUrl = "";
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const category = await Category.create({
      name,
      type: type || "regular",
      image: imageUrl
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// USER: GET CATEGORIES
// ===============================
// controllers/categoryController.js
export const getCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5; // 👈 categories per page
    const skip = (page - 1) * limit;

    const totalCategories = await Category.countDocuments();

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      categories,
      page,
      pages: Math.ceil(totalCategories / limit),
      totalCategories,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ===============================
// ADMIN: UPDATE CATEGORY
// ===============================
export const updateCategory = async (req, res) => {
  try {
    const { name, type } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.type = type || category.type;

    if (type === "trending" && req.file) {
      category.image = await uploadToCloudinary(req.file.buffer);
    }

    if (type === "regular") {
      category.image = ""; // remove image if switched to regular
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===============================
// ADMIN: DELETE CATEGORY
// ===============================
export const deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
};


// GET TRENDING CATEGORIES
export const getTrendingCategories = async (req, res) => {
  try {
    const categories = await Category.find({ type: "trending" })
      .limit(7)
      .sort({ createdAt: -1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET REGULAR CATEGORIES
export const getRegularCategories = async (req, res) => {
  try {
    const categories = await Category.find({ type: "regular" })
      .sort({ name: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
