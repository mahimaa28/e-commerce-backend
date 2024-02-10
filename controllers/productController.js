const Product = require("../models/productModel");


// Create Product ----------------- ADMIN

exports.createProduct = async (req, res, next) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

}


// Get all Products -----------------

exports.getAllProducts = async (req, res) => {
    try {
        //search function for products...
        const keyword =await req.query.keyword ? {
            name: {
                $regex:  req.query.keyword,
                $options: "i", // case insensitive
            }
        }:{};


        //filter by category and price...
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.minPrice) {
            filter.price = { ...filter.price, $gte: parseInt(req.query.minPrice) };
        }

        if (req.query.maxPrice) {
            filter.price = { ...filter.price, $lte: parseInt(req.query.maxPrice) };
        }

        if (req.query.minRating) {
            filter.rating = { ...filter.rating, $gte: parseInt(req.query.minRating) };
        }

        if (req.query.maxRating) {
            filter.rating = {...filter.rating, $lte: parseInt(req.query.maxRating) };
        }

        //pagination...
        const resultPerPage = 10;
        const currentPage = parseInt(req.query.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        const productCount = await Product.countDocuments();
        const products = await Product.find({...keyword, ...filter}).limit(resultPerPage).skip(skip);
        console.log(products);
        res.status(200).json({
            success: true,
            products,
            productCount,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

//Get Product Details ----------------

exports.getProductDetails = async (req, res, next) => {
    try {
        const product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        res.status(200).json({
            success: true,
            product
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            message: "Something went wrong",
        })
    }
}

//Update Product ----------------- ADMIN 

exports.updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, images, category, stock, createdAt, updatedAt } = req.body;
        const {rating, numOfReviews, reviews} = req.body;
        let product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        product.name = name;
        product.description = description;
        product.price = price;
        product.images = images;
        product.category = category;
        product.stock = stock;
        product.rating = rating;
        product.numOfReviews = numOfReviews;
        product.reviews = reviews;
        product.updatedAt = new Date();
        await product.save();

        res.status(200).json({
            success: true,
            product
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

}

//Delete Product --------------- ADMIN

exports.deleteProduct = async (req, res, next) => {
    try {
        let product = await Product.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product not found"
            })
        }
        product = await Product.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }

}