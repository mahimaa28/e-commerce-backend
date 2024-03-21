const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendMail = require("../services/emailServices");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

//Register an User -------------------
exports.registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    const c1 = await User.findOne({ email });
    if (c1) {
      return res
        .status(500)
        .json({ success: false, message: "something went wrong" });
    }

    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      avatar: {
        public_id: "tmp sample id",
        url: "tmpProfilePicUrl",
      },
    });

    const loginURL = `http://localhost:3000/loginsignup`;
    sendMail({
      from: "EcommXpress@gmail.com",
      to: user.email,
      subject: "Created Your Account",
      text: `Hi ${firstName},\n\nWelcome to Ecomm Express! We're thrilled to have you join our community.
      \n\nGet started with your new account: ${loginURL}
      \nIf you have any questions or need assistance, feel free to reach out to our support team.
      \n\nThanks,
      \nThe Ecomm Express Team`,
      html: require("../services/emailTemplate")({
        message: `Hi ${firstName},<br><br>Welcome to Ecomm Express! We're thrilled to have you join our community.
        <br><br>Get started with your new account: ${loginURL} <br><br>If you have any questions or need assistance, feel free to reach out to our support team.
        <br><br>Thanks,<br>The Ecomm Express Team`,
      }),
    })
      .then(() => {
        return res.status(201).json({
          success: true,
          message: "email has been sent, user has been created",
          data: user,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Error in sending email." });
      });
    console.log(user.email);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//PreVerification of an user -----------------
exports.preVerifyUser = async (req, res, next) => {
  try {
    const { firstName, email } = req.body;

    const c1 = await User.findOne({ email });
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
      \n\nhttp://localhost:3000/registration/${token}
      \n\nIf you have any questions or need assistance, feel free to reach out to our support team.
      \n\nThanks,\nThe Ecomm Express Team`,
      html: require("../services/emailTemplate")({
        message: `Hi ${firstName},<br><br>Welcome to Ecomm Express! We're thrilled to have you.
        <br><br>Please follow the link below to verify your email and get started with your new account:
        <br><br><a href="http://localhost:3000/registration/${token}">Verify Email</a>
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
//Verify an user ----------------
exports.verifyUser = async (req, res, next) => {
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

//Login user -------------------

exports.loginUser = async (req, res, next) => {
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
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return next(
        res
          .status(401)
          .json({ success: false, message: "Invalid email or password" })
      ); //unauth req
    }
    const isPasswordMatched = await user.comparePassword(password);
    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
      //unauth req
    }
    console.log(isPasswordMatched);
    // sendToken(user, 200, res);
    sendToken(req, 200, res, user, "user");
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Logout User  -------------
exports.logoutUser = async (req, res, next) => {
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    // Generate and store password reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Construct reset password URL
    const resetPasswordUrl = `http://localhost:3000/reset-password/${resetToken}`;

    // Send email with reset password link
    sendMail({
      from: "EcommXpress@gmail.com",
      to: req.body.email,
      subject: "Reset Password Token",
      text: `Hi! You have requested to reset your password. Click the link below to reset your password:\n\n${resetPasswordUrl}\n\n`,
      html: require("../services/emailTemplate")({
        message: `Hi! You have requested to reset your password. Click the link below to reset your password:<br><br><a href="${resetPasswordUrl}">Reset Password</a><br><br>`,
      }),
    })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: `An email has been sent to ${user.email} with instructions to reset your password`,
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

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "reset password token is invalid" });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res
        .status(400)
        .json({ error: "password doesn't match, please confirm" });
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    // sendToken(user, 200, res);
    sendToken(req, 200, res, user, "user");
  } catch (err) {
    User.resetPasswordToken = undefined;
    User.resetPasswordExpire = undefined;
    await User.save({ validateBeforeSave: false });
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

//Get user details
exports.getUserDetails = async (req, res, next) => {
  try {
    console.log(req.user._id);
    const user = await User.findOne({ _id: req.user._id });
    console.log(user);
    if (!user) {
      return res.status(400).json({ error: "something went wrong" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// update user password
exports.updatePassword = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await User.findOne({ _id: req.user.id }).select("+password");
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
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

    user.password = req.body.newPassword;
    await user.save();
    // sendToken(user, 200, res);
    sendToken(req, 200, res, user, "user");
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// update user
exports.updateUser = async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      avatar,
      address,
      phoneNumber,
      dateOfBirth,
      gender,
      cart,
      wishlist,
      orders,
    } = req.body;
    console.log(req.user._id);
    // Find the user by ID
    let user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    // Update user fields
    user.firstName = firstName;
    user.lastName = lastName;
    user.avatar = avatar;
    user.address = address;
    user.phoneNumber = phoneNumber;
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;
    user.cart = cart;
    user.wishlist = wishlist;
    user.orders = orders;

    // Save the updated user
    // console.log(user);
    await user.save();
    // console.log("afterrrrrrrr", user);
    sendToken(req, 200, res, user, "user");
    // console.log(user);
    // sendToken(user, 200, res);
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get users -----------Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      totalUsers,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//get single user details -----------Admin
exports.userDetails = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(400).json({ error: "something went wrong" });
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
