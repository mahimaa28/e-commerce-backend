const express = require("express");
const {
  registerAdmin,
  preVerifyAdmin,
  verifyAdmin,
  loginAdmin,
  logoutAdmin,
  forgotPassword,
  resetPassword,
  getAdminDetails,
  updatePassword,
} = require("../controllers/superAdminController");
const {
  isAuthenticatedUser,
  authorizedSuperAdmin,
} = require("../middlewares/auth");
const router = express.Router();

router.route("/registerAdmin").post(registerAdmin);
router.route("/verifyAdmin").post(preVerifyAdmin);
router.route("/verifyAdmin/:token").get(verifyAdmin);
router.route("/loginAdmin").post(loginAdmin);
router.route("/logoutAdmin").get(logoutAdmin);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router
  .route("/me")
  .get(isAuthenticatedUser, authorizedSuperAdmin, getAdminDetails);
router.route("/updatePassword").put(isAuthenticatedUser, updatePassword);
module.exports = router;
