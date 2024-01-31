const express = require("express");
const { createInventory, getInventory, deleteInventory, updateInventory, getInventoryDetails } = require("../controllers/inventoryController");
const router = express.Router();

router.route("/createInventory").post(createInventory);
router.route("/getInventory").get(getInventory);
router.route("/updateInventory/:id").put(updateInventory);
router.route("/deleteInventory/:id").delete(deleteInventory);
router.route("/getInventoryDetails/:id").get(getInventoryDetails);

module.exports = router;
