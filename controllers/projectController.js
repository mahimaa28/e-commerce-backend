const Product = require("../models/productModel");
const ApiFeatures = require("../utils/api-features");




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
        // const apiFeature = new ApiFeatures(Product.find(), req.query.keyword).search();
        // const products = await apiFeature.query;

        //search function for products... //better to use the class cuz the same would needed in inventory too.but for now just adding up the loc for understanding.
        const keyword =await req.query.keyword ? {
            name: {
                $regex:  req.query.keyword,
                $options: "i", // case insensitive
            }
        }:{};
        console.log(keyword);
        const products = await Product.find({...keyword});

        res.status(200).json({
            success: true,
            products
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
        // const {rating, numOfReviews, reviews} = req.body;
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