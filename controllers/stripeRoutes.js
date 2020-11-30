const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FRONTEND_DOMAIN =
  process.env.FRONTEND_DOMAIN || "http://localhost:3000/confirmation";
const Order = require("../models/order");

// Stripe Payment server route
router.post("/create-session/", async (req, res) => {
  try {
    // Make the Order
    const info = req.body;
    const order = await Order.create({
      user: info.userId,
      cart_items: info.cart_items,
      sub_total_price: info.sub_total_price,
      fees_tax: info.fees_tax,
      total_price: info.total_price,
    });

    // Create the session as Stripe Payment Server
    // Reference - https://stripe.com/docs/api/checkout/sessions/object
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: info.userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pay Smoothies2Go for your order",
              // Small Thumbnail for Smoothies2Go
              images: ["https://i.imgur.com/HENK60at.png"],
            },
            unit_amount: parseInt(info.amt),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_DOMAIN}?success=true&orderId=${order._id}`,
      cancel_url: `${FRONTEND_DOMAIN}?canceled=true`,
    });
    res.status(200).json({
      id: session.id,
      message: "success",
      details: "charge posted successfully",
      orderId: order._id,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

// Test Route
router.get("/", (req, res) => {
  res.json({ domain: FRONTEND_DOMAIN });
});

module.exports = router;
