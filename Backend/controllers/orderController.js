import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const placeOrder = async (req, res) => {
  const { shippingAddress } = req.body;

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product"
  );

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity
  }));

  const totalPrice = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    totalPrice
  });

  cart.items = [];
  await cart.save();

  res.status(201).json(order);
};

export const getMyOrders = async (req, res) => {
   try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.orderStatus = req.body.status;
  await order.save();
  res.json(order);
};

/**
 * @desc   Get order details by ID
 * @route  GET /api/orders/:id
 * @access User/Admin
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("orderItems.product", "name price");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔐 Security: user can see only their own order
    if (
      req.user.role !== "admin" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
