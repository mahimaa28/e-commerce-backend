const Product = require("../models/productModel");

// Create Product ----------------- SELLER

exports.createProduct = async (req, res, next) => {
  try {
    console.log("tffffffff");
    // req.body.seller = req.seller.id;
    // const product = await Product.create(req.body);
    const {
      name,
      description,
      price,
      images,
      category,
      subCategory,
      stock,
      // ratings, comments, createdAt, updatedAt, inventory - these fields are either automatically generated or not required during product creation
    } = req.body;

    // Create a new product instance
    const product = new Product({
      name,
      description,
      price,
      images,
      category,
      subCategory,
      seller: req.seller.id,
    });

    // Save the product to the database
    await product.save();
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

//Update Product ----------------- SELLER

exports.updateProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      price,
      images,
      category,
      subCategory,
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
    product.numOfComments = numOfComments;
    // product.rating = rating;
    product.numOfReviews = numOfReviews;
    // product.reviews = reviews;
    product.updatedAt = new Date();
    await product.save();

    res.status(200).json({
      success: true,
      product,
      inventoryItem,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Delete Product ---------------  SELLER

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

// Get all Products by Seller ID -----------------

exports.getAllProductsBySeller = async (req, res) => {
  try {
    const sellerId = req.seller._id;

    // Search function for products by seller ID
    const products = await Product.find({ seller: sellerId });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
