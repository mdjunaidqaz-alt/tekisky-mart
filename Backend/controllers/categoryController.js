import Category from "../models/Category.js";

// @desc   Get all categories
export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

// @desc   Create category (admin)
export const createCategory = async (req, res) => {
  const category = new Category({ name: req.body.name });
  const created = await category.save();
  res.status(201).json(created);
};
