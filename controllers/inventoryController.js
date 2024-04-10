const Inventory = require("../models/inventoryModel");

// Get all inventory items for the seller

exports.getAllInventoryItems = async (req, res) => {
  try {
    const sellerId = req.params.id;

    // Find all inventory items associated with the seller
    const inventoryItems = await Inventory.find({ seller: sellerId }).populate(
      "product"
    );

    res.status(200).json({
      success: true,
      inventoryItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get inventory items for a specific seller

exports.getInventoryForSeller = async (req, res) => {
  try {
    const sellerId = req.params.sellerId;

    // Find all inventory items associated with the seller
    const inventoryItems = await Inventory.find({ seller: sellerId }).populate(
      "product"
    );

    res.status(200).json({
      success: true,
      inventoryItems,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update inventory item ----Seller
exports.updateInventory = async (req, res) => {
  try {
    const inventoryItemId = req.params.id;
    const { quantity, location } = req.body;

    // Find the inventory item by ID
    let inventoryItem = await Inventory.findById(inventoryItemId);

    if (!inventoryItem) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    // Update inventory item properties
    inventoryItem.quantity = quantity;
    inventoryItem.lastUpdated = Date.now();

    // Save the updated inventory item
    await inventoryItem.save();

    res.status(200).json({
      success: true,
      inventoryItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Delete Inventory --------------- Seller
exports.deleteInventory = async (req, res) => {
  try {
    let inventory = await Inventory.findOne({ _id: req.params.id });
    if (!inventory) {
      return res.status(500).json({
        success: false,
        message: "Inventory not found",
      });
    }

    // Find the inventory item by ID and delete it
    const deletedInventoryItem = await inventory.deleteOne({
      _id: req.params.id,
    });

    if (!deletedInventoryItem) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory item not found" });
    }

    res.status(200).json({
      success: true,
      message: "Inventory item deleted successfully",
      deletedInventoryItem,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
