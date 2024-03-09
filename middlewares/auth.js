const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Seller = require("../models/sellerModel");

exports.isAuthenticatedUser = async (req, res, next) => {
  try {
    console.log("isAuthenticatedUserrrrrrrrrrrrrrrrrrrrrrrrrr");
    const { token } = req.cookies;
    // console.log(token);
    if (!token) {
      return next(
        res.status(401).json({
          success: false,
          message: "Please login inorder to access this resource",
        })
      ); //unauth req
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decodedData.id);
    console.log(req.user);
    // Check if the user is a regular user (buyer)
    // const user = await User.findById(decodedData.id);
    // if (user) {
    //   req.user = user;
    //   console.log("Authenticated as a regular user:", req.user);
    //   return next();
    // }
    // console.log(req);

    // // Check if the user is a seller
    // const seller = await Seller.findById(decodedData.id);
    // if (seller) {
    //   req.seller = seller;
    //   console.log("Authenticated as a seller:", req.seller);
    //   return next();
    // }
    // console.log(seller);
    // // If the user is neither a regular user nor a seller, return an error
    // return res.status(401).json({
    //   success: false,
    //   message: "Invalid user",
    // });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

exports.isAuthenticatedSeller = async (req, res, next) => {
  try {
    console.log("isAuthenticatedSeller");
    const { token } = req.cookies;
    console.log(token);
    if (!token) {
      return next(
        res.status(401).json({
          success: false,
          message: "Please login inorder to access this resource",
        })
      ); //unauth req
    }
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);
    req.seller = await Seller.findById(decodedData.id);
    console.log("sucker");
    // Check if the user is a regular user (buyer)
    // const user = await User.findById(decodedData.id);
    // if (user) {
    //   req.user = user;
    //   console.log("Authenticated as a regular user:", req.user);
    //   return next();
    // }
    // console.log(req);

    // // Check if the user is a seller
    // const seller = await Seller.findById(decodedData.id);
    // if (seller) {
    //   req.seller = seller;
    //   console.log("Authenticated as a seller:", req.seller);
    //   return next();
    // }
    // console.log(seller);
    // // If the user is neither a regular user nor a seller, return an error
    // return res.status(401).json({
    //   success: false,
    //   message: "Invalid user",
    // });
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// exports.authorizedRoles = async (req, res, next) => {
//     // console.log(req);
//     console.log(req.user.role);
//     if (req.user.role == "admin") {
//         res.status(401).json({ success: false, message: "You are not authorized to access this resource" });
//     }
//     next();

// };
exports.authorizedSeller = async (req, res, next) => {
  try {
    console.log(`${req.body} yaaaaarrrrr`);
    // Check if the user's role is in the authorized roles
    if (req.user.role !== "seller") {
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

exports.authorizedSuperAdmin = (req, res, next) => {
  try {
    console.log(`${req.user.role} yaaaaarrrrr`);
    // Check if the user's role is in the authorized roles
    if (req.user.role !== "superadmin") {
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
