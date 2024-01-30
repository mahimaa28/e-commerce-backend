const express = require("express");
const { createInventory, getInventory } = require("../controllers/inventoryController");
const router = express.Router();

router.route("/createInventory").post(createInventory);
router.route("/getInventory").get(getInventory);

module.exports = router;
