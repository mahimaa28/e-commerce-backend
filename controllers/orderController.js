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

exports.getPlacedOrders = async (req, res, next) => {
  try {
    const sellerId = req.seller.id;
    console.log(sellerId);
    // Find all products associated with the seller
    const sellerProducts = await Product.find({ seller: sellerId });
    console.log(sellerProducts);
    // Extract product IDs
    const productIds = sellerProducts.map((product) => product._id);

    // Find all orders that contain the seller's products
    const orders = await Order.find({
      "products.product": { $in: productIds },
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
