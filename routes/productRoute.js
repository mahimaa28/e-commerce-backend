const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct } = require("../controllers/projectController");
const router =  express.Router();

router.route("/products").get(getAllProducts);
router.route("/createProduct").post(createProduct);
router.route("/updateProduct/:id").put(updateProduct);
router.route("/deleteProduct/:id").delete(deleteProduct);




module.exports = router