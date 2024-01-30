const express = require("express");
const { createInventory } = require("../controllers/inventoryController");
const router = express.Router();

router.route("/createInventory").post(createInventory);

module.exports = router;
