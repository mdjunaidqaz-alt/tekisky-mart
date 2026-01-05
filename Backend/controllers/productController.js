import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import Category from "../models/Category.js";


export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, stock } = req.body;

    const imageUrls = [];

    for (let file of req.files.slice(0, 3)) {
      const url = await uploadToCloudinary(file.buffer);
      imageUrls.push(url);
    }

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      category,
      stock,
      images: imageUrls
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
};


export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword
      ? { $text: { $search: req.query.keyword } }
      : {};

    const products = await Product.find(keyword)
      .populate("category", "name")
      .skip(skip)
      .limit(limit);

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};
