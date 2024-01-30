const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    productCategory: {
        // type: mongoose.Schema.Types.ObjectId,
        type: String,
        // ref: 'Product',
        required: [true, "Please enter product category"],
    },
    quantity: {
        type: Number,
        required: [true, "Please enter product quantity"],
    },
    location: String,  // Location where the product is stored
    costPrice: {
        type: Number,
        required: [true, "Please enter product cost price"],
    },
    sellingPrice: {
        type: Number,
        required: [true, "Please enter product selling price"],
    },
    lastUpdated: {
        type: Date,
        default: Date.now(),
    },
    minimumStock: {
        type: Number, // Minimum stock to be ordered
        default: 0,
    },
    currentStock: {
        type: Number, // Available stock
        default: 0,
    },
    reorderQuantity: {
        type: Number,
        default: 0,
    },

});

module.exports = mongoose.model("Inventory", inventorySchema);