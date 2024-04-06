const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Seller = require("../models/sellerModel");
const Admin = require("../models/superAdminModel");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    console.log("isAuthenticatedUser");
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
      return next(
        res.status(401).json({
          success: false,
          message: "Please login in order to access this resource",
        })
      ); //unauth req
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);

    // Check the role from the decoded token
    if (decodedData.role === "user") {
      req.user = await User.findById(decodedData.id);
      console.log("Authenticated as a regular user:", req.user);
    } else if (decodedData.role === "seller") {
      req.seller = await Seller.findById(decodedData.id);
      console.log("Authenticated as a seller:", req.seller);
    } else if (decodedData.role === "admin") {
      req.admin = await Admin.findById(decodedData.id);
      console.log("Authenticated as an admin:", req.admin);
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid user role",
      });
    }
    next();
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.authorizedSeller = async (req, res, next) => {
  try {
    // console.log(`${req.seller} yaaaaarrrrr`);
    console.log(`${req.seller.role} yaaaaarrrrr`);
    // Check if the user's role is in the authorized roles
    if (req.seller.role !== "seller") {
      console.log("ruivbefuivbfeoub");
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.authorizedSuperAdmin = (req, res, next) => {
  try {
    console.log(`${req.admin.role} yaaaaarrrrr`);
    // Check if the user's role is in the authorized roles
    if (req.admin.role !== "admin") {
      console.log("ruivbefuivbfeoub");
      return res.status(401).json({
        success: false,
        message: "You are not authorized to access this resource",
      });
    }
    // If the user's role is authorized, proceed to the next middleware
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
