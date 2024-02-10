const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");



//Register an User -------------------
exports.registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, } = req.body;

        const c1 = await User.findOne({ email });
        if (c1) {
            return res.status(500).json({ success: false, message: "something went wrong" });
        }

        const user = await User.create({
            firstName, lastName, email, password,
            avatar: {
                public_id: "tmp sample id",
                url: "tmpProfilePicUrl",
            }
        });

        sendToken(user, 201, res);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

//Login user -------------------

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //checking if user has given password and email both
        if (!email || !password) {
            return next(res.status(400).json({ success: false, message: "Invalid req, please enter email and password" }));//Bad req
        }
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next(res.status(401).json({ success: false, message: "Invalid email or password" }));//unauth req
        }
        const isPasswordMatched = user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(res.status(401).json({ success: false, message: "Invalid email or password" }));//unauth req
        }
        sendToken(user, 200, res);
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}

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
        })
    }
    catch (err) {
        console.log(err.message);
        res.status(500).json({ success: false, message: "Something went wrong" });
    }
}