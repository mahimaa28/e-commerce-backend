const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  verifyUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/verifyUser/:token").get(verifyUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);

module.exports = router;
