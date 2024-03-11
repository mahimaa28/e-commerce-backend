const express = require("express");
const {
  registerSeller,
  preVerifySeller,
  verifySeller,
  loginSeller,
  logoutSeller,
  forgotPassword,
  resetPassword,
  updatePassword,
  getSellerDetails,
  getDetails,
  getSellers,
  updateSeller,
} = require("../controllers/sellerController");
const {
  isAuthenticatedUser,
  authorizedSuperAdmin,
  authorizedSeller,
} = require("../middlewares/auth");
const router = express.Router();

router.route("/registerSeller").post(registerSeller);
router.route("/verifySeller").post(preVerifySeller);
router.route("/verifySeller/:token").get(verifySeller);
router.route("/loginSeller").post(loginSeller);
router.route("/logoutSeller").get(isAuthenticatedUser, logoutSeller);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
router
  .route("/getSellerDetails/:id")
  .get(isAuthenticatedUser, authorizedSeller, getSellerDetails);
router.route("/me").get(isAuthenticatedUser, authorizedSeller, getDetails);
router
  .route("/getSellers")
  .get(isAuthenticatedUser, authorizedSuperAdmin, getSellers);
router
  .route("/updateSeller")
  .put(isAuthenticatedUser, authorizedSeller, updateSeller);
// router
//   .route("/me")
//   .get(
//     isAuthenticatedUser,
//     authorizedSuperAdmin,
//     authorizedSeller,
//     getSellerDetails
//   );
// router
//   .route("/updatePassword")
//   .put(
//     isAuthenticatedUser,
//     authorizedSuperAdmin,
//     authorizedSeller,
//     updatePassword
//   );
// router
//   .route("/updateSelller")
//   .put(
//     isAuthenticatedUser,
//     authorizedSuperAdmin,
//     authorizedSeller,
//     updateSeller
//   );
// router
//   .route("/getSellerDetails/:id")
//   .get(
//     isAuthenticatedUser,
//     authorizedSuperAdmin,
//     authorizedSeller,
//     sellerDetails
//   );
// router
//   .route("/getAllSellers")
//   .get(isAuthenticatedUser, authorizedSuperAdmin, getSellers);

module.exports = router;
