const express = require("express");
const {
  addProductInCart,
  deleteProductFromCart,
  updateProductInCart,
  decreaseProductInCart,
  getCartProducts,
  checkoutFromCart,
  getTotalProductsInCarts,
} = require("../controllers/cartController");
const {
  isAuthenticatedUser,
  authorizedSeller,
  authorizedSuperAdmin,
} = require("../middlewares/auth");
const router = express.Router();

router.route("/addProduct").post(isAuthenticatedUser, addProductInCart);
router
  .route("/deleteProduct/:userId/:productId")
  .delete(isAuthenticatedUser, deleteProductFromCart);
router.route("/updateProduct").put(isAuthenticatedUser, updateProductInCart);
router
  .route("/decreaseProduct")
  .put(isAuthenticatedUser, decreaseProductInCart);
router
  .route("/getAllCartProducts/:userId")
  .get(isAuthenticatedUser, getCartProducts);
router.route("/checkoutFromCart").post(isAuthenticatedUser, checkoutFromCart);
router
  .route("/getTotalProductsInCarts/:sellerId")
  .get(isAuthenticatedUser, authorizedSeller, getTotalProductsInCarts);

module.exports = router;
