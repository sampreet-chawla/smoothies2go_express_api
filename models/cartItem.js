const { Schema, model } = require("mongoose");

const CartItemSchema = new Schema(
  {
    user: { ref: "User", type: Schema.Types.ObjectId },
    item: { ref: "Item", type: Schema.Types.ObjectId },
    qty: { type: Number, required: true, min: 1 },
    order_status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Cartitem = model("CartItem", CartItemSchema);

module.exports = Cartitem;
