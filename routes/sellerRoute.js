const express = require("express");
const {
  registerSeller,
  preVerifySeller,
  verifySeller,
  loginSeller,
  logoutSeller,
} = require("../controllers/sellerController");
const {
  isAuthenticatedUser,
  authorizedSuperAdmin,
  authorizedSeller,
  isAuthenticatedSeller,
} = require("../middlewares/auth");
const router = express.Router();

router.route("/registerSeller").post(registerSeller);
router.route("/verifySeller").post(preVerifySeller);
router.route("/verifySeller/:token").get(verifySeller);
router.route("/loginSeller").post(loginSeller);
router.route("/logoutSeller").get(isAuthenticatedSeller, logoutSeller);
// router
//   .route("/password/forgot")
//   .post(authorizedSuperAdmin, authorizedSeller, forgotPassword);
// router
//   .route("/password/reset/:token")
//   .put(authorizedSuperAdmin, authorizedSeller, resetPassword);
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
