const express = require("express");
const {
  addProductInCart,
  deleteProductFromCart,
  updateProductInCart,
  decreaseProductInCart,
} = require("../controllers/cartController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/addProduct").post(isAuthenticatedUser, addProductInCart);
router
  .route("/deleteProduct")
  .delete(isAuthenticatedUser, deleteProductFromCart);
router.route("/updateProduct").put(isAuthenticatedUser, updateProductInCart);
router
  .route("/decreaseProduct")
  .put(isAuthenticatedUser, decreaseProductInCart);
module.exports = router;
