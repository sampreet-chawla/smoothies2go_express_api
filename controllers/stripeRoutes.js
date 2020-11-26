const router = require("express").Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const FRONTEND_DOMAIN =
  process.env.FRONTEND_DOMAIN || "http://localhost:3000/confirmation";

router.post("/create-session/", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: req.body.userEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Pay Smoothies2Go for your order",
              // Small Thumbnail for Smoothies2Go
              images: ["https://i.imgur.com/HENK60at.png"],
            },
            unit_amount: parseInt(req.body.amt),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${FRONTEND_DOMAIN}?success=true`,
      cancel_url: `${FRONTEND_DOMAIN}?canceled=true`,
    });
    console.log("session created..", session.id);
    res.status(200).json({
      id: session.id,
      message: "success",
      details: "charge posted successfully",
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

router.get("/", (req, res) => {
  res.json({ domain: FRONTEND_DOMAIN });
});

module.exports = router;
