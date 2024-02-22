const Comments = require("../models/commentModel");

exports.addComment = async (req, res, next) => {
  try {
    let { user, product, content } = req.body;
    const comment = new Comment({ user, product, content });
    await comment.save();
    res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.getAllComments = async (req, res, next) => {
  try {
    let { userId, searchQuery, sortBy, sortOrder, page, limit, productId } =
      req.query;
    userId = userId || "";
    searchQuery = searchQuery || "";
    sortBy = sortBy || "";
    sortOrder = sortOrder || "asc";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let query = {};

    // If userId is provided, add it to the query
    if (userId) {
      query.userId = userId;
    }

    // If productId is provided, add it to the query
    if (productId) {
      query.productId = productId;
    }

    // If there's a search query, add it to the query
    if (searchQuery) {
      query.$or = [
        { "productId.name": { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on product name
        { comment: { $regex: searchQuery, $options: "i" } }, // Case-insensitive search on comment text
      ];
    }

    const totalComments = await Comments.countDocuments(query);

    const totalPages = Math.ceil(totalComments / limit);

    const skip = (page - 1) * limit;

    let sortOptions = {};

    // Sort by specified field
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const comments = await Comments.find(query)
      .populate("productId")
      .populate("userId")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      comments,
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
      .populate("productId")
      .populate("userId");
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
    await Comment.findByIdAndDelete({ _id: commentId });
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
