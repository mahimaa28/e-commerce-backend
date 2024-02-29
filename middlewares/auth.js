const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

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
exports.authorizedRoles = (req, res, next) => {
  try {
    console.log(`${req.user.role} yaaaaarrrrr`);
    // Check if the user's role is in the authorized roles array
    if (req.user.role !== "admin") {
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
