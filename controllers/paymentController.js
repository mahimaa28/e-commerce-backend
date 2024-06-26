const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const Order = require("../models/orderModel");

exports.processPayment = async (req, res, next) => {
  try {
    // const { userId } = req.body;

    //     // Find all orders for the specified user
    //     const orders = await Order.find({ userId });

    //     // Calculate the total amount to charge
    //     let totalAmount = 0;
    //     let lineItems = [];
    //     for (const order of orders) {
    //       totalAmount += order.totalPrice; // Assuming totalPrice is stored in the Order schema

    //       // Iterate over products in the order and construct line items
    //       for (const product of order.products) {
    //         lineItems.push({
    //           price_data: {
    //             currency: "usd", // Currency of the price
    //             product_data: {
    //               name: product.name, // Name of the product
    //               description: product.description, // Description of the product
    //             },
    //             unit_amount: product.price * 100, // Price in the smallest currency unit (e.g., cents)
    //           },
    //           quantity: product.quantity, // Quantity of the product
    //         });
    //       }
    //     }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment", //for one time payment, use subscription for subscription
      line_items: req.body.items.map((item) => {
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: item.name,
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        };
      }),
      success_url: "http://localhost:3000/orderPlaced", // URL to redirect to after successful payment
      cancel_url: "http://localhost:3000/cancel-order", // URL to redirect to if the user cancels the payment
    });

    res.status(200).json({
      success: true,
      message: "Payment processing",
      url: session.url,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
