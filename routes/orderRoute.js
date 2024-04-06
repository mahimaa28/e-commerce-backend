const express = require("express");
const {
  updateOrderStatus,
  getPlacedOrders,
} = require("../controllers/orderController");
const {
  isAuthenticatedUser,
  authorizedSeller,
  authorizedSuperAdmin,
} = require("../middlewares/auth");
const router = express.Router();

router
  .route("/updateOrderStatus")
  .put(isAuthenticatedUser, authorizedSeller, updateOrderStatus);
router
  .route("/getPlacedOrders")
  .get(isAuthenticatedUser, authorizedSeller, getPlacedOrders);

module.exports = router;
