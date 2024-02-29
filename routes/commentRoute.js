const express = require("express");
const {
  addComment,
  updateComment,
  deleteComment,
  getAllComments,
  viewComment,
} = require("../controllers/commentController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const router = express.Router();

router.route("/addComment").post(isAuthenticatedUser, addComment);
router.route("/editComment/:commentId").put(isAuthenticatedUser, updateComment);
router
  .route("/deleteComment/:commentId")
  .delete(isAuthenticatedUser, deleteComment);
router.route("/getAllProductComments").get(isAuthenticatedUser, getAllComments);
router.route("/viewComment/:commentId").get(isAuthenticatedUser, viewComment);

module.exports = router;