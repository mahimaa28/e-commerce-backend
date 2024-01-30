const Inventory = require("../models/inventoryModel");



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
        const inventory = await Inventory.find();
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