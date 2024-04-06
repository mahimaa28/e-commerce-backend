const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");

exports.addProductInCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    // Convert quantity to a number
    const parsedQuantity = parseInt(quantity);

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
      cart.products[existingProductIndex].quantity += parsedQuantity || 1;
    } else {
      // If product doesn't exist, check if the product exists in the database
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Add the product to the cart with the specified quantity
      cart.products.push({ product: productId, quantity: parsedQuantity || 1 });
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

    // Convert quantity to a number
    const parsedQuantity = parseInt(quantity);

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
    cart.products[productIndex].quantity += parsedQuantity || 1;

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
    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "products.product"
    );
    console.log(cart);
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Extract product information from the cart
    const products = cart.products
      .map((item) => {
        if (item.product) {
          // Check if item.product is not null
          console.log(item, "THISSSS TIME");
          return {
            _id: item._id,
            productId: item.product._id,
            name: item.product.name,
            price: item.product.price,
            description: item.product.description,
            category: item.product.category,
            subCategory: item.product.subCategory,
            quantity: item.quantity,
            img: item.product.images[0].url,
          };
        } else {
          return null; // or handle the case where item.product is null
        }
      })
      .filter((product) => product !== null); // Filter out null products

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.checkoutFromCart = async (req, res) => {
  try {
    const { userId, shippingInfo, paymentInfo, orderNotes } = req.body;

    // Find the cart for the specified user
    const cart = await Cart.findOne({ userId });
    console.log(cart);
    if (!cart || cart.products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty or not found",
      });
    }
    console.log(cart);
    // Initialize total price
    let totalPrice = 0;

    // Iterate over products in the cart
    for (const item of cart.products) {
      // Find the corresponding product
      console.log(item, "in here");

      const product = await Product.findOne({ _id: item.product });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      // Log product price for debugging
      console.log(`Product ${product._id} price: ${product.price}`);

      // Ensure that product price is available
      if (!product.price) {
        return res.status(400).json({
          success: false,
          message: "Product price is not available",
        });
      }

      // Assign price from the product to the item in the cart
      item.price = product.price;

      // Log item price for debugging
      console.log(`Item ${item.product} price: ${item.price}`);

      // Calculate total price
      totalPrice += item.quantity * product.price;
    }

    // Log total price for debugging
    console.log(`Total price: ${totalPrice}`);

    // Create an order
    const order = new Order({
      userId,
      cartId: cart._id,
      products: cart.products,
      totalPrice,
      shippingInfo,
      paymentInfo,
      orderNotes,
    });

    // Save the order
    await order.save();

    // Clear the cart after successful checkout
    cart.products = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Order placed successfully",
      order,
      cart,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
