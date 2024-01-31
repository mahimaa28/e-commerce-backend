const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/projectController");
const router =  express.Router();

router.route("/products").get(getAllProducts);
router.route("/createProduct").post(createProduct);
router.route("/updateProduct/:id").put(updateProduct);
router.route("/deleteProduct/:id").delete(deleteProduct);
router.route("/getProductDetails/:id").get(getProductDetails);



module.exports = router