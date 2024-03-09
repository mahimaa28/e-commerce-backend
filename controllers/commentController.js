const Comments = require("../models/commentModel");

exports.addComment = async (req, res, next) => {
  try {
    let { user, product, content } = req.body;
    console.log(req.body);
    const comment = new Comments({ user, product, content });
    await comment.save();
    res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    let { user, searchQuery, sortBy, sortOrder, page, limit, product } =
      req.query;
    user = user || "";
    searchQuery = searchQuery || "";
    sortBy = sortBy || "";
    sortOrder = sortOrder || "asc";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const productId = req.params;
    let query = {};

    // If userId is provided, add it to the query
    if (user) {
      query.user = user;
    }

    // If there's a search query, add it to the query
    if (searchQuery) {
      query.$or = [
        { "productId.name": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on product name
        { comment: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on comment text
      ];
    }

    const skip = (page - 1) * limit;

    let sortOptions = {};

    // Sort by specified field
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const comments = await Comments.find({ query, productId })
      .populate("product")
      .populate("user")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const totalComments = await Comments.countDocuments({ query, productId });

    const totalPages = Math.ceil(totalComments / limit);

    res.status(200).json({
      success: true,
      comments,
      totalComments,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.viewComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    const comment = await Comments.findOne({ _id: commentId })
      .populate("product")
      .populate("user");
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await Comments.findOneAndUpdate(
      { _id: commentId },
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;
    await Comments.findByIdAndDelete({ _id: commentId });
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
