const express = require("express");
const {
  registerAdmin,
  preVerifyAdmin,
  verifyAdmin,
  loginAdmin,
  logoutAdmin,
  forgotPassword,
  resetPassword,
} = require("../controllers/superAdminController");
const router = express.Router();

router.route("/registerAdmin").post(registerAdmin);
router.route("/verifyAdmin").post(preVerifyAdmin);
router.route("/verifyAdmin/:token").get(verifyAdmin);
router.route("/loginAdmin").post(loginAdmin);
router.route("/logoutAdmin").get(logoutAdmin);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
module.exports = router;
