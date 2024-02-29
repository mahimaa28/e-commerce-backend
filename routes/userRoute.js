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
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/verifyUser/:token").get(verifyUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
// router.route("/updateUser").put(isAuthenticatedUser, updateUser);

module.exports = router;
