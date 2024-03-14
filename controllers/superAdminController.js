const Admin = require("../models/superAdminModel");
const Seller = require("../models/sellerModel");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../services/emailServices");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//reset password token
const getResetPasswordToken = function () {
  //Generating token
  const resetToken = crypto.randomBytes(10).toString("hex");

  //Hashing and adding to user schema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};

//Register an admin -------------------
exports.registerAdmin = async (req, res, next) => {
  try {
    console.log("here in register admin", req.body);
    const { firstName, lastName, email, role, password } = req.body;
    // console.log("in register Admin");
    const c1 = await Admin.findOne({ email });
    if (c1) {
      return res
        .status(500)
        .json({ success: false, message: "admin already exists" });
    }

    const c2 = await Seller.findOne({ email });
    if (c2) {
      return res.status(500).json({
        success: false,
        message: "email id already exists(seller's).",
      });
    }

    const admin = await Admin.create({
      firstName,
      lastName,
      role,
      email,
      password,
    });
    sendMail({
      from: "EcommXpress@gmail.com",
      to: admin.email,
      subject: "Created Your Seller Account",
      text: `Hi ${firstName},\n\nWelcome to Ecomm Express! We're thrilled to have you as an admin.\n\n
          \n\nThanks,
          \nThe Ecomm Express Team`,
      html: require("../services/emailTemplate")({
        message: `Hi ${firstName},<br><br>Welcome to Ecomm Express! We're thrilled to have you as an admin.
            <br><br>Thanks,<br>The Ecomm Express Team`,
      }),
    })
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "email has been sent, user has been created",
          data: admin,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Error in sending email." });
      });
    console.log(admin.email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//PreVerification of an Admin-----------------
exports.preVerifyAdmin = async (req, res, next) => {
  try {
    const { firstName, email } = req.body;

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
        // \n\nhttp://localhost:4000/api/v1/user/verifyUser/${token}
        \n\nIf you have any questions or need assistance, feel free to reach out to our support team.
        \n\nThanks,\nThe Ecomm Express Team`,
      html: require("../services/emailTemplate")({
        message: `Hi ${firstName},<br><br>Welcome to Ecomm Express! We're thrilled to have you.
          <br><br>Please follow the link below to verify your email and get started with your new account:
          // <br><br>${token}
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

//Verify an admin ----------------
exports.verifyAdmin = async (req, res, next) => {
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

//Login Admin -------------------

exports.loginAdmin = async (req, res, next) => {
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
    const admin = await Admin.findOne({ email }).select("+password");
    console.log(admin);
    if (!admin) {
      return next(
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" })
      ); //unauth req
    }
    const isPasswordMatched = await admin.comparePassword(password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      //unauth req
    }
    console.log(isPasswordMatched);
    // sendTokenSeller(seller, 200, res);
    sendToken(req, 200, res, admin, "admin");
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Logout Admin -------------
exports.logoutAdmin = async (req, res, next) => {
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
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(400).json({ error: "Admin does not exist" });
    }

    // Generate and store password reset token
    const resetToken = getResetPasswordToken();
    await admin.save({ validateBeforeSave: false });

    // Construct reset password URL
    const resetPasswordUrl = `http://localhost:300/reset-password-admin${resetToken}`;

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
          message: `An email has been sent to ${admin.email} with instructions to reset your password`,
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

exports.resetPassword = async (req, res, next) => {
  try {
    console.log("hi");
    // Creating token hash
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    console.log(resetPasswordToken);
    // Find admin instance from the database
    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    console.log(admin);
    if (!admin) {
      return res.status(400).json({ error: "Reset password token is invalid" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ error: "Password doesn't match, please confirm" });
    }

    // Update admin password and reset token fields
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;

    // Save the changes to the database
    await admin.save();

    // Send token response
    sendToken(req, 200, res, admin, "admin");
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

//Get Admin details
exports.getAdminDetails = async (req, res, next) => {
  try {
    console.log(req.admin._id);
    const admin = await Admin.findById(req.admin._id);
    console.log(admin);
    if (!admin) {
      return res.status(400).json({ error: "something went wrong" });
    }
    res.status(200).json({
      success: true,
      admin,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// update admin password
exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.admin);
    const admin = await Admin.findById(req.admin.id).select("+password");
    const isPasswordMatched = await admin.comparePassword(req.body.oldPassword);
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

    admin.password = req.body.newPassword;
    await admin.save();
    // sendTokenSeller(seller, 200, res);
    sendToken(req, 200, res, admin, "admin");
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
