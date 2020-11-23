const CartItem = require("../models/cartItem");
const router = require("express").Router();

// index - returns all cart items for the user, that are not ordered yet.
router.get("/userId/:userId", async (req, res) => {
  try {
    const cartItems = await CartItem.find({
      //$and: [{ user: new ObjectId(req.params.user) }, { order_status: false }],
      $and: [{ user: req.params.userId }, { order_status: false }],
    })
      // .populate("user")
      .populate("item");
    res.status(200).json({ data: cartItems });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// Add an item to the cart
router.post("/", async (req, res) => {
  try {
    const cartItem = await CartItem.create(req.body);
    res.status(200).json({ data: cartItem });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// Update the item quantity in the cart-item
router.put("/id/:id/qty/:qty", async (req, res) => {
  console.log(req.params.qty);
  try {
    const cartItem = await CartItem.findByIdAndUpdate(
      req.params.id,
      {
        qty: req.params.qty,
      },
      { new: true }
    );
    res.status(200).json({ data: cartItem });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// Delete a cart-item
router.delete("/id/:id", async (req, res) => {
  try {
    const result = await CartItem.findOneAndRemove(req.params.id);
    res.status(204).json({ data: result });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

// Update order status of cart-items for a user
router.put("/userId/:userId/orderStatus/:orderStatus", async (req, res) => {
  try {
    const result = await CartItem.updateMany(
      { user: req.params.userId },
      //   { $set: { order_status: req.params.orderStatus } }
      { order_status: req.params.orderStatus }
    );
    res.status(200).json({ data: result });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

module.exports = router;
