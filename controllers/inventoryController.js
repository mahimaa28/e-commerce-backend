const Inventory = require("../models/inventoryModel");

//Create a new Inventory ---------------- ADMIN

exports.createInventory = async (req, res, next) => {
  try {
    const inventory = await Inventory.create(req.body);
    res.status(201).json({
      success: true,
      inventory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Get an Inventory --------------- ADMIN

exports.getInventory = async (req, res, next) => {
  try {
    //search function for inventory...
    const keyword = (await req.query.keyword)
      ? {
          productCategory: {
            $regex: req.query.keyword,
            $options: "i", // case insensitive
          },
        }
      : {};
    //filter by selling price and costing price...
    const filter = {};
    // if (req.query.category) {
    //     filter.productCategory = req.query.category;
    // }
    if (req.query.costPrice) {
      filter.costPrice = req.query.costPrice;
    }
    if (req.query.minCostPrice) {
      filter.costPrice = {
        ...filter.costPrice,
        $gte: parseInt(req.query.minCostPrice),
      };
    }

    if (req.query.maxCostPrice) {
      filter.costPrice = {
        ...filter.costPrice,
        $lte: parseInt(req.query.maxCostPrice),
      };
    }

    if (req.query.minSellingPrice) {
      filter.sellingPrice = {
        ...filter.sellingPrice,
        $gte: parseInt(req.query.minSellingPrice),
      };
    }

    if (req.query.maxSellingPrice) {
      filter.sellingPrice = {
        ...filter.sellingPrice,
        $lte: parseInt(req.query.maxSellingPrice),
      };
    }

    console.log({ ...keyword });
    console.log({ ...filter });
    //pagination...
    const resultPerPage = 5;
    const inventoryCount = await Inventory.countDocuments();
    const currentPage = parseInt(req.query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    const inventory = await Inventory.find({ ...keyword, ...filter })
      .limit(resultPerPage)
      .skip(skip);
    res.status(200).json({
      success: true,
      inventory,
      inventoryCount,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Get Inventory Details ----------------

exports.getInventoryDetails = async (req, res, next) => {
  try {
    const inventory = await Inventory.findOne({ _id: req.params.id });
    if (!inventory) {
      return res.status(500).json({
        success: false,
        message: "Inventory not found",
      });
    }
    res.status(200).json({
      success: true,
      inventory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Update an Inventory --------------- ADMIN

exports.updateInventory = async (req, res, next) => {
  try {
    const {
      productCategory,
      quantity,
      location,
      costPrice,
      sellingPrice,
      minimumStock,
      currentStock,
      reorderQuantity,
    } = req.body;
    const inventory = await Inventory.findOne({ _id: req.params.id });
    if (!inventory) {
      return res.status(500).json({
        success: false,
        message: "Inventory not found",
      });
    }
    inventory.productCategory = productCategory;
    inventory.quantity = quantity;
    inventory.location = location;
    inventory.costPrice = costPrice;
    inventory.sellingPrice = sellingPrice;
    inventory.lastUpdated = new Date();
    inventory.minimumStock = minimumStock;
    inventory.currentStock = currentStock;
    inventory.reorderQuantity = reorderQuantity;

    await inventory.save();
    res.status(200).json({
      success: true,
      inventory,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Delete Inventory --------------- ADMIN

exports.deleteInventory = async (req, res, next) => {
  try {
    let inventory = await Inventory.findOne({ _id: req.params.id });
    if (!inventory) {
      return res.status(500).json({
        success: false,
        message: "Inventory not found",
      });
    }
    inventory = await inventory.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Inventory deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
