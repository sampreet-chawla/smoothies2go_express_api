const Order = require("../models/order");
const CartItem = require("../models/cartItem");
const router = require("express").Router();

// KINDLY NOTE - ORDER IS CREATED in stripeRouter.js while creating a Stripe Payment Server session.

// Fetch the order for the given orderId
router.get("/id/:orderId", async (req, res) => {
  try {
    const order = await Order.findById({ _id: req.params.orderId }).populate(
      "cart_items"
    );
    res.status(200).json({ data: order });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// Update the Order Paid Status
router.put("/paid/id/:orderId/user/:userId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.orderId },
      { order_status: "Paid", pymt_date_time: new Date(), paid_status: true },
      { new: true }
    );
    const result = await CartItem.updateMany(
      { user: req.params.userId, order_status: false },
      { order_status: true }
    );
    res.status(200).json({ data: order });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// Update the Order Paid Status
router.put("/cancel/id/:orderId", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      { _id: req.params.orderId },
      { order_status: "Cancelled" },
      { new: true }
    );
    res.status(200).json({ data: order });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// View the recent order for the user
router.get("/recent/userId/:userId", async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.params.userId }, null, {
      sort: { order_date_time: -1 },
      limit: 1,
    }).populate("cart_items");
    res.status(200).json({ data: order });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// View the paid orders for the user
router.get("/paid/userId/:userId", async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.params.userId,
      paid_status: true,
    }).populate("cart_items");
    res.status(200).json({ data: orders });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

module.exports = router;
