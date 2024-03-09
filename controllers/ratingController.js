const Rating = require("../models/ratingModel");

const addRating = async (req, res, next) => {
  try {
    const rating = await Rating.create(req.body);
    res.status(201).json({
      success: true,
      rating,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const getAllRating = async (req, res, next) => {
  try {
    const productId = req.params;
    let { user, searchQuery, sortBy, sortOrder, page, limit } = req.query;
    user = user || "";
    searchQuery = searchQuery || "";
    sortBy = sortBy || "";
    sortOrder = sortOrder || "asc";
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    let query = {};

    // If userId is provided, add it to the query
    if (user) {
      query.user = user;
    }

    // If there's a search query, add it to the query
    if (searchQuery) {
      query.$or = [
        { "productId.name": { $regex: new RegExp(searchQuery, "i") } }, // Case-insensitive search on product name
        { star: { $regex: new RegExp(searchQuery, "i") } }, // Case-insensitive search on comment text
        { "user.name": { $regex: new RegExp(searchQuery, "i") } }, // Case-insensitive search on user name
      ];
    }

    let sortOptions = {};

    // Sort by specified field
    if (sortBy) {
      sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const ratings = await Rating.find({ query, productId })
      .populate("product")
      .populate("user")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Calculate total number of ratings for pagination
    const totalRatings = await Rating.countDocuments({ query, productId });
    const totalPages = Math.ceil(totalRatings / limit);
    res.status(201).json({
      success: true,
      ratings,
      totalRatings,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const viewRating = async (req, res, next) => {
  try {
    const { ratingId, productId } = req.params;
    const rating = await Rating.findOne({ _id: ratingId, productId })
      .populate("user")
      .populate("product");
    res.status(200).json({
      success: true,
      rating,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const updateRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params;
    const rating = await Rating.findOneAndUpdate({ _id: ratingId }, req.body, {
      new: true,
    });
    res.status(200).json({
      success: true,
      rating,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const deleteRating = async (req, res, next) => {
  try {
    const { ratingId } = req.params;
    await Rating.findByIdAndDelete({ _id: ratingId });
    res.status(200).json({ success: true, message: "Rating deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
module.exports = {
  addRating,
  getAllRating,
  viewRating,
  updateRating,
  deleteRating,
};
