const jwt = require("jsonwebtoken");

const getJWTToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const sendToken = (req, StatusCode, res, user, role) => {
  const token = getJWTToken(user._id, role);

  // options for cookie
  const options = {
    expiresIn: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: "strict",
  };

  // let cookieName;

  // switch (role) {
  //   case "user":
  //     cookieName = "buyerToken";
  //     break;
  //   case "seller":
  //     cookieName = "sellerToken";
  //     break;
  //   case "admin":
  //     cookieName = "adminToken";
  //     break;
  //   default:
  //     cookieName = "defaultToken";
  // }

  const responseKey = role === "seller" ? "seller" : role;

  res
    .status(StatusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      [responseKey]: user,
      token,
    });
};
module.exports = sendToken;

// const sendToken = (req, StatusCode, res) => {
//   const token = getJWTToken();

//   // options for cookie
//   const options = {
//     expiresIn: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   res.status(StatusCode).cookie("token", token, options).json({
//     success: true,
//     user,
//     token,
//   });
// };

// const sendTokenSeller = (seller, StatusCode, res) => {
//   const token = seller.getJWTToken();
//   console.log(token);
//   // options for cookie
//   const options = {
//     expiresIn: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true,
//   };

//   res.status(StatusCode).cookie("token", token, options).json({
//     success: true,
//     seller,
//     token,
//   });
// };
