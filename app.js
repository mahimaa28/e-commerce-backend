const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Imports ---------------------
const {
  isAuthenticatedUser,
  authorizedSuperAdmin,
  authorizedSeller,
} = require("./middlewares/auth");
const product = require("./routes/productRoute");
const inventory = require("./routes/inventoryRoute");
const user = require("./routes/userRoute");
const comment = require("./routes/commentRoute");
const rating = require("./routes/ratingRoute");
const seller = require("./routes/sellerRoute");
const admin = require("./routes/superAdminRoute");
const cart = require("./routes/cartRoute");
const order = require("./routes/orderRoute");
const payment = require("./routes/paymentRoute");
//Super Admin is referred in this app as ADMIN, don't get confused.

// routes ---------------------
app.use("/api/v1/product", product);
app.use("/api/v1/inventory", isAuthenticatedUser, authorizedSeller, inventory);
app.use("/api/v1/user", user);
app.use("/api/v1/comment", comment);
app.use("/api/v1/rating", rating);
app.use("/api/v1/seller", seller);
app.use("/api/v1/admin", admin);
app.use("/api/v1/cart", cart);
app.use("/api/v1/order", order);
app.use("/api/v1/payment", payment);

module.exports = app;
