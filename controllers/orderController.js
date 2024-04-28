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

exports.countWeeklySales = async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Calculate the start and end dates of the current week
    const startOfWeek = new Date(currentDate);
    startOfWeek.setHours(0, 0, 0, 0 - startOfWeek.getDay()); // Start of the current week (Sunday)
    const endOfWeek = new Date(currentDate);
    endOfWeek.setHours(23, 59, 59, 999 + (6 - endOfWeek.getDay())); // End of the current week (Saturday)

    // Aggregate orders within the current week
    const weeklySales = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfWeek, // Start of the current week
            $lte: endOfWeek, // End of the current week
          },
          status: "delivered", // Filter orders by status if needed
        },
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" }, // Calculate total sales for the week
          count: { $sum: 1 }, // Count the number of orders for the week
        },
      },
    ]);

    // Extract the total sales and order count from the result
    const totalSales = weeklySales.length > 0 ? weeklySales[0].totalSales : 0;
    const orderCount = weeklySales.length > 0 ? weeklySales[0].count : 0;

    return res.status(200).json({
      success: true,
      totalSales,
      orderCount,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
