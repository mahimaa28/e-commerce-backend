const express = require("express");
const {
  addRating,
  getAllRating,
  viewRating,
  updateRating,
  deleteRating,
} = require("../controllers/ratingController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/addRating").post(isAuthenticatedUser, addRating);
router.route("/getAllRating/:productId").get(getAllRating);
router.route("/viewRating/:ratingId/:productId").get(viewRating);
router.route("/updateRating/:ratingId").put(isAuthenticatedUser, updateRating);
router
  .route("/deleteRating/:ratingId")
  .delete(isAuthenticatedUser, deleteRating);
module.exports = router;
