const express = require("express");
const { registerUser, loginUser, logoutUser, verifyUser } = require("../controllers/userController");
const router = express.Router();

router.route("/registerUser").post(registerUser);
router.route("/verifyUser/:token").get(verifyUser);
router.route("/loginUser").post(loginUser);
router.route("/logoutUser").get(logoutUser);

module.exports = router;