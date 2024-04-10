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

const getAllRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    let query = { product: productId }; // Filter comments by productId

    //pagination...
    const resultPerPage = 9;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    const ratings = await Rating.find(query)
      .populate("product")
      .populate("user")
      .skip(skip)
      .limit(resultPerPage);

    // Calculate total number of ratings for pagination
    const totalRatings = await Rating.countDocuments(query);
    const totalPages = Math.ceil(totalRatings / resultPerPage);

    // Calculate average rating
    const totalRatingSum = ratings.reduce(
      (acc, rating) => acc + rating.rating,
      0
    );
    const averageRating = totalRatingSum / totalRatings;

    res.status(201).json({
      success: true,
      ratings,
      totalRatings,
      totalPages,
      averageRating,
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
