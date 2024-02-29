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
    const token = jwt.sign(
      {
        data: "Token Data",
      },
      "ourSecretKey",
      { expiresIn: "10m" }
    );
    sendMail({
      from: "EcommXpress@gmail.com",
      to: user.email,
      subject: "Created Your Account",
      text: `Hi! There, You have recently visited  
                our website and entered your email.`,
      html: require("../services/emailTemplate")({
        message: `WELCOME TO ECOMM EXPRESS ${firstName},
                    Please follow the given link to verify your email 
                    http://localhost:4000/api/v1/user/verifyUser/${token}  
                    Thanks`,
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
        return res.status(500).json({ error: "Error in email sending." });
      });
    console.log(user.email);
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
    sendToken(user, 200, res);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

//Logout User  ------------- hi bye
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
    // const { email } = req.user.email;
    // console.log(req.body);
    // const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // // Generate and store password reset token
    // const token = crypto.randomBytes(20).toString("hex");
    // user.resetPasswordToken = token;
    // user.resetPasswordExpire = Date.now() + 3600000; // Token expires in 1 hour
    // await user.save({ validateBeforeSave: false });

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ error: "user does not exist" });
    }
    //Get reset password token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    //req.protocol , req.get("host")
    const resetPasswordUrl = `http://localhost:4000/api/v1/user/password/reset/${resetToken}`;
    sendMail({
      from: "EcommXpress@gmail.com",
      to: req.body.email,
      subject: "Reset Password Token",
      text: `Hi! There, You have recently visited  
                our website and entered your email.`,
      html: require("../services/emailTemplate")({
        message: `Your reset password token is \n\n ${resetPasswordUrl} \n\n`,
      }),
    })
      .then(() => {
        return res.status(200).json({
          success: true,
          message: `email has been sent to ${user.email}, reset your password`,
        });
      })
      .catch((error) => {
        console.log(error);
        return res.status(500).json({ error: "Error in email sending." });
      });
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
    sendToken(user, 200, res);
  } catch (err) {
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
    const user = await User.findById(req.user._id);
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
    const user = await User.findById(req.user.id).select("+password");
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
    sendToken(user, 200, res);
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
    } = req.user;
    let user = await User.findOne(req.user._id);
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.avatar.url = avatar.url;
    user.address.street = address.street;
    user.address.city = address.city;
    user.address.state = address.state;
    user.address.postalCode = address.postalCode;
    user.address.country = address.country;
    user.phoneNumber = phoneNumber;
    user.dateOfBirth = dateOfBirth;
    user.gender = gender;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
