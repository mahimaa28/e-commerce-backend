const Product = require("../models/productModel");

// Create Product ----------------- ADMIN

exports.createProduct = async (req, res, next) => {
  try {
    req.body.seller = req.seller.id;
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// Get all Products -----------------

exports.getAllProducts = async (req, res) => {
  try {
    //search function for products...
    const keyword = (await req.query.keyword)
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i", // case insensitive
          },
        }
      : {};

    //filter by category and price...
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.subCategory) {
      filter.subCategory = req.query.subCategory;
    }

    if (req.query.minPrice) {
      filter.price = { ...filter.price, $gte: parseInt(req.query.minPrice) };
    }

    if (req.query.maxPrice) {
      filter.price = { ...filter.price, $lte: parseInt(req.query.maxPrice) };
    }

    //pagination...
    const resultPerPage = 9;
    const currentPage = parseInt(req.query.page) || 1;
    const skip = resultPerPage * (currentPage - 1);

    const productCount = await Product.countDocuments();

    //total number of pages...
    const totalPages = Math.ceil(productCount / resultPerPage);

    const products = await Product.find({ ...keyword, ...filter })
      .limit(resultPerPage)
      .skip(skip);
    console.log(products);
    res.status(200).json({
      success: true,
      products,
      productCount,
      totalPages,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Get Product Details ----------------

exports.getProductDetails = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }
    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

//Update Product ----------------- ADMIN

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      subCategory,
      stock,
      createdAt,
      updatedAt,
    } = req.body;
    const { rating, numOfReviews, numOfComments, reviews } = req.body;
    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    product.name = name;
    product.description = description;
    product.price = price;
    product.images = images;
    product.category = category;
    product.subCategory = subCategory;
    product.stock = stock;
    product.numOfComments = numOfComments;
    // product.rating = rating;
    product.numOfReviews = numOfReviews;
    // product.reviews = reviews;
    product.updatedAt = new Date();
    await product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Delete Product --------------- ADMIN

exports.deleteProduct = async (req, res, next) => {
  try {
    let product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res.status(500).json({
        success: false,
        message: "Product not found",
      });
    }
    product = await Product.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
