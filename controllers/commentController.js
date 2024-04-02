const Comments = require("../models/commentModel");

exports.addComment = async (req, res, next) => {
  try {
    let { user, product, content, star } = req.body;
    console.log(req.body);
    const comment = new Comments({ user, product, content, star });
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

exports.getAllComments = async (req, res) => {
  try {
    const productId = req.params.productId; // Extract productId from request parameters
    let query = { "product": productId }; // Filter comments by productId
    
    // If there's a search query, add it to the query
    if (req.query.searchQuery) {
      query.$or = [
        { "product.name": { $regex: req.query.searchQuery, $options: "i" } }, // Case-insensitive search on product name
        { comment: { $regex: req.query.searchQuery, $options: "i" } }, // Case-insensitive search on comment text
      ];
    }
    
     //pagination...
     const resultPerPage = 9;
     const currentPage = parseInt(req.query.page) || 1;
     const skip = resultPerPage * (currentPage - 1);


    const comments = await Comments.find(query)
      .populate("product")
      .populate("user")
      .skip(skip)
      .limit(resultPerPage);

    const totalComments = await Comments.countDocuments(query);

    const totalPages = Math.ceil(totalComments / resultPerPage);

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
    const comment = await Comments.findOne({ _id:  req.params.commentId })
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
    let { content, star } = req.body;
    console.log(commentId)
    const comment = await Comments.findOne(
      { _id: commentId }
    );
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }
    comment.content = content;
    comment.star = star;

    await comment.save();
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
