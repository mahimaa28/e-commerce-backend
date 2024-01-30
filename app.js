const express = require("express");

const app = express();

app.use(express.json());


// Route Imports ---------------------
const product = require("./routes/productRoute");
const inventory = require("./routes/inventoryRoute");


app.use("/api/v1/product", product);
app.use("/api/v1/inventory", inventory);


module.exports = app;