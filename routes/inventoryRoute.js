const express = require("express");
const {
  deleteInventory,
  updateInventory,
  getAllInventoryItems,
  getInventoryForSeller,
} = require("../controllers/inventoryController");
const router = express.Router();

router.route("/getInventory").get(getInventoryForSeller);
router.route("/updateInventory/:id").put(updateInventory);
router.route("/deleteInventory/:id").delete(deleteInventory);
router.route("/getInventoryItems/:id").get(getAllInventoryItems);

module.exports = router;
