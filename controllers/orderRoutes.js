const Order = require("../models/order");
const CartItem = require("../models/cartItem");
const router = require("express").Router();

// TODO - To be tested and finalized
// Create an order with the cart-items
router.post("/userId/:userId", async (req, res) => {
  try {
    const order = await Order.create(req.body);
    const result = await CartItem.updateMany(
      { user: req.params.userId },
      { order_status: true }
    );
    res.status(200).json({ data: order });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// View the recent order for the user
router.get("/userId/:userId", async (req, res) => {
  try {
    const order = await Order.find({ user: req.params.userId }, null, {
      sort: { order_date_time: -1 },
      limit: 1,
    }).populate("cart_items");
    res.status(200).json({ data: order });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// View the paid orders for the user
router.get("/userId/:userId", async (req, res) => {
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
