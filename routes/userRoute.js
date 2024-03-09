const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updateUser,
  updatePassword,
  userDetails,
  getUsers,
  preVerifyUser,
} = require("../controllers/userController");
const {
  isAuthenticatedUser,
  authorizedSuperAdmin,
  authorizedSeller,
} = require("../middlewares/auth");
const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/verifyUser").post(preVerifyUser);
router.route("/verifyUser/:token").get(verifyUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(isAuthenticatedUser, logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
router.route("/updateUser").put(isAuthenticatedUser, updateUser);
router
  .route("/getUserDetails/:id")
  .get(
    isAuthenticatedUser,
    authorizedSuperAdmin,
    authorizedSeller,
    userDetails
  );
router
  .route("/getAllUsers")
  .get(isAuthenticatedUser, authorizedSuperAdmin, authorizedSeller, getUsers);

module.exports = router;
