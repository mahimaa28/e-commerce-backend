const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
} = require("../controllers/productController");
const {
  isAuthenticatedUser,
  authorizedSuperAdmin,
  authorizedSeller,
} = require("../middlewares/auth");
const apiCallCounts = require("../middlewares/apiCallCounts");
const router = express.Router();

router.route("/products").get(getAllProducts);
router
  .route("/createProduct")
  .post(isAuthenticatedUser, authorizedSeller, createProduct);
router
  .route("/updateProduct/:id")
  .put(isAuthenticatedUser, authorizedSeller, updateProduct);
router
  .route("/deleteProduct/:id")
  .delete(isAuthenticatedUser, authorizedSeller, deleteProduct);
router.route("/getProductDetails/:id").get(getProductDetails);

module.exports = router;
