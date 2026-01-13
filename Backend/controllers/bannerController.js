import Banner from "../models/Banner.js";
import uploadToCloudinary from "../utils/cloudinaryUpload.js";

// =======================
// CREATE BANNER (ADMIN)
// =======================
export const createBanner = async (req, res) => {
  try {
    const { title, link } = req.body;

    const imageUrl = await uploadToCloudinary(req.file.buffer);

    const banner = await Banner.create({
      title,
      link,
      image: imageUrl
    });

    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
// GET ACTIVE BANNERS (USER)
// =======================
export const getActiveBanners = async (req, res) => {
  const banners = await Banner.find({ isActive: true }).sort({ createdAt: -1 });
  res.json(banners);
};

// =======================
// GET ALL BANNERS (ADMIN)
// =======================
// export const  = async (req, res) => {
//   const banners = await Banner.find().sort({ createdAt: -1 });
//   res.json(banners);
// };

// controllers/bannerController.js
export const getAllBanners = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5; // banners per page
    const skip = (page - 1) * limit;

    const totalBanners = await Banner.countDocuments();

    const banners = await Banner.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      banners,
      page,
      pages: Math.ceil(totalBanners / limit),
      totalBanners
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// =======================
// UPDATE BANNER (ADMIN)
// =======================
export const updateBanner = async (req, res) => {
  const banner = await Banner.findById(req.params.id);
  if (!banner) return res.status(404).json({ message: "Banner not found" });

  banner.title = req.body.title || banner.title;
  banner.link = req.body.link || banner.link;

  if (req.file) {
    banner.image = await uploadToCloudinary(req.file.buffer);
  }

  banner.isActive =
    req.body.isActive !== undefined
      ? req.body.isActive
      : banner.isActive;

  await banner.save();
  res.json(banner);
};

// =======================
// DELETE BANNER (ADMIN)
// =======================
export const deleteBanner = async (req, res) => {
  await Banner.findByIdAndDelete(req.params.id);
  res.json({ message: "Banner deleted" });
};
