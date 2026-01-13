import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

/**
 * @desc   Get all users (customers)
 * @route  GET /api/admin/users
 * @access Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc   Get admin dashboard stats
 * @route  GET /api/admin/stats
 * @access Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // ✅ REVENUE ONLY FROM DELIVERED ORDERS
    const revenueData = await Order.aggregate([
      { $match: { orderStatus: "Delivered" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$totalPrice" }
        }
      }
    ]);

    res.json({
      users: totalUsers,
      products: totalProducts,
      orders: totalOrders,
      revenue: revenueData[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const  = async (req, res) => {
//   try {
//     const orders = await Order.find({})
//       .populate("user", "name email")
//       .populate("orderItems.product", "name images price")
//       .sort({ createdAt: -1 });

//     res.json(orders);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 5; // 🔥 orders per page
    const skip = (page - 1) * limit;

    const totalOrders = await Order.countDocuments();

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("orderItems.product", "name images price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      orders,
      page,
      pages: Math.ceil(totalOrders / limit),
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc   Update order status
 * @route  PUT /api/admin/orders/:id/status
 * @access Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc   Block / Unblock user
 * @route  PUT /api/admin/users/:id/block
 * @access Admin
 */
export const toggleBlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot block admin" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({
      message: user.isBlocked ? "User blocked" : "User unblocked",
      isBlocked: user.isBlocked
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc   Set estimated delivery date
 * @route  PUT /api/admin/orders/:id/delivery
 * @access Admin
 */
export const setEstimatedDelivery = async (req, res) => {
  try {
    const { date } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.estimatedDeliveryDate = date;
    await order.save();

    res.json({
      message: "Estimated delivery date updated",
      estimatedDeliveryDate: order.estimatedDeliveryDate
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateDeliveryDate = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.estimatedDeliveryDate = req.body.date;
  await order.save();

  res.json(order);
};

