const express = require("express");
const { addRating } = require("../controllers/ratingController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/addRating").post(isAuthenticatedUser, addRating);
module.exports = router;
