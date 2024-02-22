const express = require("express");

const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route Imports ---------------------
const { isAuthenticatedUser, authorizedRoles } = require("./middlewares/auth");
const product = require("./routes/productRoute");
const inventory = require("./routes/inventoryRoute");
const user = require("./routes/userRoute");
const comment = require("./routes/commentRoute");

// routes ---------------------
app.use("/api/v1/product", product);
app.use("/api/v1/inventory", isAuthenticatedUser, authorizedRoles, inventory);
app.use("/api/v1/user", user);
app.use("/api/v1/comment", comment);

module.exports = app;
