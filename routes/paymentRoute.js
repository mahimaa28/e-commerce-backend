const express = require("express");
const { processPayment } = require("../controllers/paymentController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const { route } = require("./orderRoute");
const router = express.Router();

// router.route("/process-payment").post(isAuthenticatedUser, processPayment);

module.exports = router;
