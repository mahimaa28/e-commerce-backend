const express = require("express");
const {
  updateOrderStatus,
  getAllOrdersForUser,
  getAllOrdersForSeller,
  getAllOrders,
  countWeeklySales,
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
  .route("/getPlacedOrders/:id")
  .get(isAuthenticatedUser, authorizedSeller, getAllOrdersForSeller);
router.route("/getAllOrders/:id").get(isAuthenticatedUser, getAllOrdersForUser);
router
  .route("/getAllOrders")
  .get(isAuthenticatedUser, authorizedSuperAdmin, getAllOrders);
router
  .route("/countWeeklySales")
  .get(isAuthenticatedUser, authorizedSeller, countWeeklySales);
module.exports = router;
