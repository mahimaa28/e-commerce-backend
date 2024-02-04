const Inventory = require("../models/inventoryModel");
const ApiFeatures = require("../utils/api-features");



//Create a new Inventory ---------------- ADMIN

exports.createInventory = async (req, res, next) => {
    try {
        const inventory = await Inventory.create(req.body);
        res.status(201).json({
            success: true,
            inventory
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

}

//Get an Inventory --------------- ADMIN

exports.getInventory = async (req, res, next) => {
    try {
        const apiFeature = new ApiFeatures(Inventory.find(), req.query.keyword).search();
        const inventory = await apiFeature.query;
        //    const inventory = await Inventory.find();
        res.status(200).json({
            success: true,
            inventory
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

//Get Inventory Details ----------------

exports.getInventoryDetails = async (req, res, next) => {
    try {
        const inventory = await Inventory.findOne({ _id: req.params.id });
        if (!inventory) {
            return res.status(500).json({
                success: false,
                message: "Inventory not found"
            })
        }
        res.status(200).json({
            success: true,
            inventory
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}
//Update an Inventory --------------- ADMIN

exports.updateInventory = async (req, res, next) => {
    try {
        const { productCategory, quantity, location, costPrice, sellingPrice, lastUpdated, minimumStock, currentStock, reorderQuantity } = req.body;
        const inventory = await Inventory.findOne({ _id: req.params.id });
        if (!inventory) {
            return res.status(500).json({
                success: false,
                message: "Inventory not found"
            })
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
            inventory
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

//Delete Inventory --------------- ADMIN

exports.deleteInventory = async (req, res, next) => {
    try {
        let inventory = await Inventory.findOne({ _id: req.params.id });
        if (!inventory) {
            return res.status(500).json({
                success: false,
                message: "Inventory not found"
            })
        }
        inventory = await inventory.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Inventory deleted successfully",
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

}