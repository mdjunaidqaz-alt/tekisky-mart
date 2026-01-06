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

    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const products = await Product.find({
      ...keyword,
      ...categoryFilter
    })
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


// @desc   Update product
// @route  PUT /api/products/:id
// @access Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, discount, stock, category } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // update text fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.discount = discount || product.discount;
    product.stock = stock || product.stock;
    product.category = category || product.category;

    // 🔥 update images ONLY if new images uploaded
    if (req.files && req.files.length > 0) {
      const imageUrls = [];

      for (let file of req.files.slice(0, 3)) {
        const url = await uploadToCloudinary(file.buffer);
        imageUrls.push(url);
      }

      product.images = imageUrls; // replace old images
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
