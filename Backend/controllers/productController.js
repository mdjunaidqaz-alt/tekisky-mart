import Product from "../models/Product.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";

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

    let limit = 10; // home page
    if (req.query.keyword || req.query.category) {
      limit = 0; // unlimited for search & category
    }

    const skip = limit ? (page - 1) * limit : 0;

    let products = [];
    let totalProducts = 0;

    // =========================
    // 🔍 SEARCH MODE
    // =========================
    if (req.query.keyword) {
      // 1️⃣ Find best matched product
      const bestMatch = await Product.findOne(
        { $text: { $search: req.query.keyword } },
        { score: { $meta: "textScore" } }
      )
        .sort({ score: { $meta: "textScore" } })
        .populate("category", "name");

      if (!bestMatch) {
        return res.json({
          products: [],
          page: 1,
          pages: 0,
          totalProducts: 0
        });
      }

      // 2️⃣ Fetch rest of same category (excluding best match)
      const relatedProducts = await Product.find({
        category: bestMatch.category._id,
        _id: { $ne: bestMatch._id }
      })
        .populate("category", "name")
        .sort({ createdAt: -1 });

      // 3️⃣ Put searched product FIRST
      products = [bestMatch, ...relatedProducts];
      totalProducts = products.length;
    }

    // =========================
    // 🏷️ CATEGORY ONLY MODE
    // =========================
    else if (req.query.category) {
      totalProducts = await Product.countDocuments({
        category: req.query.category
      });

      products = await Product.find({ category: req.query.category })
        .populate("category", "name")
        .sort({ createdAt: -1 });
    }

    // =========================
    // 🏠 HOME PAGE MODE
    // =========================
    else {
      totalProducts = await Product.countDocuments();

      products = await Product.find()
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
    }

    res.json({
      products,
      page,
      pages: limit ? Math.ceil(totalProducts / limit) : 1,
      totalProducts
    });
  } catch (error) {
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


// @desc   Product search suggestions
// @route  GET /api/products/suggestions
// @access Public
export const getSearchSuggestions = async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) return res.json([]);

    const products = await Product.find(
      {
        name: { $regex: q, $options: "i" } // 🔥 KEY FIX
      },
      { name: 1 }
    ).limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// ==============================
// RATE PRODUCT (USER)
// ==============================
// import Product from "../models/Product.js";
// import Order from "../models/Order.js";




export const rateProduct = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    // 1️⃣ Check delivered order with this product
    const order = await Order.findOne({
      user: userId,
      orderStatus: "Delivered",
      "orderItems.product": productId
    });

    if (!order) {
      return res
        .status(403)
        .json({ message: "You can rate only after delivery" });
    }

    // 2️⃣ Find product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 3️⃣ Prevent duplicate rating
    const alreadyRated = product.ratings.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyRated) {
      return res.status(400).json({ message: "Already rated" });
    }

    // 4️⃣ Push rating
    product.ratings.push({
      user: userId,
      rating,
      comment
    });

    // 5️⃣ Calculate average
    product.averageRating =
      product.ratings.reduce((sum, r) => sum + r.rating, 0) /
      product.ratings.length;

    await product.save();

    res.json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Rating failed" });
  }
};



// ==============================
// ADMIN: GET ALL PRODUCT RATINGS
// ==============================
// export const  = async (req, res) => {
//   try {
//     const products = await Product.find({})
//       .select("name ratings averageRating")
//       .populate("ratings.user", "name email");

//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// controllers/productController.js
export const getAllRatings = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments({
      "ratings.0": { $exists: true }
    });

    const products = await Product.find({
      "ratings.0": { $exists: true }
    })
      .populate("ratings.user", "name email")
      .skip(skip)
      .limit(limit);

    res.json({
      products,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



