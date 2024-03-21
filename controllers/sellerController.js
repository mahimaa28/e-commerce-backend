const Seller = require("../models/sellerModel");
const Admin = require("../models/superAdminModel");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../services/emailServices");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//Register an seller -------------------
exports.registerSeller = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      email,
      role,
      password,
      companyName,
      companyRegistrationNumber,
      companyAddress,
      sellerAddress,
      phoneNumber,
    } = req.body;
    // console.log("in register selller");
    const c1 = await Seller.findOne({ email });
    if (c1) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    }
    const c2 = await Admin.findOne({ email });
    if (c2) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    }

    const seller = await Seller.create({
      firstName,
      lastName,
      role,
      email,
      password,
      companyName,
      companyRegistrationNumber,
      companyAddress,
      sellerAddress,
      phoneNumber,
    });
    sendMail({
      from: "EcommXpress@gmail.com",
      to: seller.email,
      subject: "Created Your Seller Account",
      text: `Hi ${firstName},\n\nWelcome to Ecomm Express! We're thrilled to have you join our community.\n\n
        \nIf you have any questions or need assistance, feel free to reach out to our support team.
        \n\nThanks,
        \nThe Ecomm Express Team`,
      html: require("../services/emailTemplate")({
        message: `Hi ${firstName},<br><br>Welcome to Ecomm Express! We're thrilled to have you join our community.
          <br><br>Get started with your new account:<br><br>If you have any questions or need assistance, feel free to reach out to our support team.
          <br><br>Thanks,<br>The Ecomm Express Team`,
      }),
    })
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "email has been sent, user has been created",
          data: seller,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Error in sending email." });
      });
    console.log(seller.email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//PreVerification of an seller-----------------
exports.preVerifySeller = async (req, res, next) => {
  try {
    const { firstName, email } = req.body;

    const c1 = await Seller.findOne({ email });
    if (c1) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    }

    // const user = await User.create({
    //   firstName,
    //   lastName,
    //   email,
    //   password,
    //   avatar: {
    //     public_id: "tmp sample id",
    //     url: "tmpProfilePicUrl",
    //   },
    // });
    const token = jwt.sign(
      {
        data: "Token Data",
      },
      "ourSecretKey",
      { expiresIn: "10m" }
    );
    sendMail({
      from: "EcommXpress@gmail.com",
      to: email,
      subject: "Verify Your Email",
      text: `Hi ${firstName},\n\nWelcome to Ecomm Express! We're thrilled to have you.
      \n\nPlease follow the link below to verify your email and get started with your new account:
      // \n\nhttp://localhost:3000/registration-seller/${token}
      \n\nIf you have any questions or need assistance, feel free to reach out to our support team.
      \n\nThanks,\nThe Ecomm Express Team`,
      html: require("../services/emailTemplate")({
        message: `Hi ${firstName},<br><br>Welcome to Ecomm Express! We're thrilled to have you.
        <br><br>Please follow the link below to verify your email and get started with your new account:
        // <br><br>http://localhost:3000/registration-seller/${token}
        <br><br>If you have any questions or need assistance, feel free to reach out to our support team.
        <br><br>Thanks,<br>The Ecomm Express Team`,
      }),
    })
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "email has been sent, user has to be verified",
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Error in sending email." });
      });
    console.log(email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Verify an seller ----------------
exports.verifySeller = async (req, res, next) => {
  try {
    const { token } = req.params;
    console.log(token);
    // Verifying the JWT token
    jwt.verify(token, "ourSecretKey", function (err, decoded) {
      if (err) {
        console.log(err);
        res.send(
          "Email verification failed, possibly the link is invalid or expired"
        );
      } else {
        res.send("Email verifified successfully");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Login seller -------------------

exports.loginSeller = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //checking if user has given password and email both
    if (!email || !password) {
      return next(
        res.status(400).json({
          success: false,
          message: "Invalid req, please enter email and password",
        })
      ); //Bad req
    }
    const seller = await Seller.findOne({ email }).select("+password");
    console.log(seller);
    if (!seller) {
      return next(
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" })
      ); //unauth req
    }
    const isPasswordMatched = await seller.comparePassword(password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      //unauth req
    }
    console.log(isPasswordMatched);
    // sendTokenSeller(seller, 200, res);
    sendToken(req, 200, res, seller, "seller");
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Logout Seller -------------
exports.logoutSeller = async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expiresIn: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Reset password
exports.forgotPassword = async (req, res, next) => {
  try {
    const seller = await Seller.findOne({ email: req.body.email });
    if (!seller) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Generate and store password reset token
    const resetToken = seller.getResetPasswordToken();
    await seller.save({ validateBeforeSave: false });

    // Construct reset password URL
    const resetPasswordUrl = `http://localhost:3000/reset-password-seller/${resetToken}`;

    // Send email with reset password link
    sendMail({
      from: "EcommXpress@gmail.com",
      to: req.body.email,
      subject: "Reset Password Token",
      text: `Hi! You have requested to reset your password. Click the link below to reset your password:\n\n${resetPasswordUrl}\n\n`,
      html: require("../services/emailTemplate")({
        message: `Hi! You have requested to reset your password. Click the link below to reset your password:<br><br>${resetPasswordUrl}`,
      }),
    })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: `An email has been sent to ${seller.email} with instructions to reset your password`,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Error sending email" });
      });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

//reset Password, changing password
exports.resetPassword = async (req, res, next) => {
  try {
    //creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const seller = await Seller.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!seller) {
      return res.status(400).json({ error: "reset password token is invalid" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ error: "password doesn't match, please confirm" });
    }
    seller.password = req.body.password;
    seller.resetPasswordToken = undefined;
    seller.resetPasswordExpire = undefined;

    await seller.save();
    // sendTokenSeller(seller, 200, res);
    sendToken(req, 200, res, seller, "seller");
  } catch (err) {
    Seller.resetPasswordToken = undefined;
    Seller.resetPasswordExpire = undefined;
    await Seller.save({ validateBeforeSave: false });
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

//Get seller details
exports.getDetails = async (req, res, next) => {
  try {
    console.log(req.seller._id);
    const seller = await Seller.findOne({ _id: req.seller._id });
    console.log(seller);
    if (!seller) {
      return res.status(400).json({ error: "something went wrong" });
    }
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// update seller password
exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.seller);
    const seller = await Seller.findOne({ _id: req.seller.id }).select(
      "+password"
    );
    const isPasswordMatched = await seller.comparePassword(
      req.body.oldPassword
    );
    if (!isPasswordMatched) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid old password" });
      //unauth req
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please confirm password" });
    }

    seller.password = req.body.newPassword;
    await seller.save();
    // sendTokenSeller(seller, 200, res);
    sendToken(req, 200, res, seller, "seller");
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get seller details --SuperAdmin
exports.getSellerDetails = async (req, res, next) => {
  try {
    console.log(req.seller);
    const seller = await Seller.findOne({ _id: req.params.id });
    console.log(seller);
    if (!seller) {
      return res.status(400).json({ error: "something went wrong" });
    }
    res.status(200).json({
      success: true,
      seller,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get sellers -----------SuperAdmin
exports.getSellers = async (req, res, next) => {
  try {
    const sellers = await Seller.find();
    const totalSellers = await Seller.countDocuments();

    res.status(200).json({
      success: true,
      sellers,
      totalSellers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// update seller
exports.updateSeller = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      companyName,
      companyRegistrationNumber,
      companyAddress,
      sellerAddress,
      phoneNumber,
    } = req.body;

    // Find the user by ID
    let seller = await Seller.findOne({ _id: req.seller.id });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Update seller fields
    seller.firstName = firstName;
    seller.lastName = lastName;
    seller.companyName = companyName;
    seller.companyRegistrationNumber = companyRegistrationNumber;
    seller.companyAddress = companyAddress;
    seller.sellerAddress = sellerAddress;
    seller.phoneNumber = phoneNumber;
    // Save the updated seller
    console.log(seller);
    await seller.save();
    sendToken(req, 200, res, seller, "seller");
    // sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
