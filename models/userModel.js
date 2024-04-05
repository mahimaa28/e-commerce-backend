const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { reset } = require("nodemon");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please enter your first name"],
    maxLength: [15, "first name characters cannot exceed 15"],
    minLength: [3, "first name characters should be atleast 3"],
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, "Please enter your last name"],
    maxLength: [15, "last name characters cannot exceed 15"],
    minLength: [3, "last name characters should be atleast 3"],
    trim: true,
  },
  role: {
    type: String,
    default: "user",
  },
  email: {
    type: String,
    required: [true, "Please enter your email address"],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minLength: [8, "Password should be atleast 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      // required: true
    },
    url: {
      type: String,
      // required: true
    },
  },
  address: {
    street: {
      type: String,
      default: "",
    },
    city: {
      type: String,
      default: "",
    },
    state: {
      type: String,
      default: "",
    },
    country: {
      type: String,
      default: "",
    },
    postalCode: {
      type: String,
      default: "",
    },
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },

  // createdAt: {
  //   type: Date,
  //   default: Date.now(),
  // },
  // updatedAt: {
  //   type: Date,
  //   default: new Date(),
  // },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

//hashing the password

userSchema.pre("save", async function (req, res, next) {
  if (!this.isModified("password")) {
    return next;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//JWT Token
// userSchema.methods.getJWTToken = function () {
//   return jwt.sign({ id: this._id }, `${process.env.JWT_SECRET}`, {
//     expiresIn: `${process.env.JWT_EXPIRE}`,
//   });
// };

//Compare the password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

//Reset the password, Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
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

module.exports = mongoose.model("User", userSchema);
