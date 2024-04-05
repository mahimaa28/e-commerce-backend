const Cart = require("../models/cartModel");

exports.addProductInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      // If cart doesn't exist, create a new one
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product already exists in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingProductIndex !== -1) {
      // If product exists, update the quantity
      cart.products[existingProductIndex].quantity += quantity || 1;
    } else {
      // If product doesn't exist, add it to the cart
      cart.products.push({ product: productId, quantity: quantity || 1 });
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product has been added to the cart",
      cart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item._id.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart",
      });
    }

    // Remove the product from the cart
    cart.products.splice(productIndex, 1);

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product has been removed from the cart",
      cart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProductInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart",
      });
    }

    // Update the quantity of the product in the cart
    cart.products[productIndex].quantity += quantity || 1;

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product quantity has been updated in the cart",
      cart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.decreaseProductInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Find the index of the product in the cart
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in the cart",
      });
    }

    // Decrease the quantity of the product in the cart
    if (cart.products[productIndex].quantity - quantity < 1) {
      // If the resulting quantity is less than 1, remove the product from the cart
      cart.products.splice(productIndex, 1);
    } else {
      // Otherwise, decrease the quantity
      cart.products[productIndex].quantity -= quantity || 1;
    }

    // Save the updated cart
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Product quantity has been decreased in the cart",
      cart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCartProducts = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId }).populate("products.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Extract product information from the cart
    const products = cart.products.map((item) => ({
      _id: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      category: item.product.category,
      img: item.product.images[0].url
    }));

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
