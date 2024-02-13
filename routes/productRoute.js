const express = require("express");
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController");
const { isAuthenticatedUser, authorizedRoles } = require("../middlewares/auth");
const apiCallCounts = require("../middlewares/apiCallCounts");
const router =  express.Router();

router.route("/products").get(getAllProducts);
router.route("/createProduct").post(isAuthenticatedUser,authorizedRoles,createProduct);
router.route("/updateProduct/:id").put(isAuthenticatedUser,authorizedRoles,updateProduct);
router.route("/deleteProduct/:id").delete(isAuthenticatedUser,authorizedRoles,deleteProduct);
router.route("/getProductDetails/:id").get(getProductDetails);



module.exports = router