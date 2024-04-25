const Order = require("../models/orderModel");
const Inventory = require("../models/inventoryModel");

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

    // If order status is "shipped", deduct quantity from product's inventory
    if (status === "shipped") {
      const inventory = await Inventory.findOne({
        product: order.product.product,
      });

      if (!inventory) {
        return res.status(404).json({
          success: false,
          message: "Inventory not found for the product",
        });
      }

      // Deduct quantity from product's inventory
      inventory.quantity -= order.product.quantity;
      await inventory.save();
    }

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
    const orders = await Order.find({ "product.seller": sellerId });

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

// get all placed orders and total order count for admin
exports.getAllOrders = async (req, res) => {
  try {
    // Fetch all orders from the database
    const orders = await Order.find();

    // Count the total number of orders in the database
    const totalOrdersCount = await Order.countDocuments();

    // Return the orders in the response
    return res.status(200).json({
      success: true,
      orders,
      totalOrdersCount,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
