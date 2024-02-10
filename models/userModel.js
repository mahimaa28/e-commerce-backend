const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter your first name"],
        maxLength: [15, "first name characters cannot exceed 15"],
        minLength: [3, "first name characters should be atleast 3"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter your last name"],
        maxLength: [15, "last name characters cannot exceed 15"],
        minLength: [3, "last name characters should be atleast 3"],
    },
    role: {
        type: String,
        enum: ["user","admin"],
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
        }
    },

    reserPasswordToken: String,
    resetPasswordExpire: Date,

});

//hashing the password

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

//JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, `${process.env.JWT_SECRET}`, {
        expiresIn: `${process.env.JWT_EXPIRE}`,
    });
}

//Compare the password 
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
}



module.exports = mongoose.model("User", userSchema);