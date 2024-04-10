const Order = require("../models/orderModel");
const Product = require("../models/productModel");

// Seller-----------------
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { orderId, status } = req.body;

    // Find the order by ID
    const order = await Order.findOne({ _id: orderId });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // Update the order status
    order.status = status;
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all orders for products of a particular seller
exports.getAllOrdersForSeller = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Find all orders where products are associated with the seller
    const orders = await Order.find({ "products.seller": sellerId });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// get all placed orders for buyer
exports.getAllOrdersForUser = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
