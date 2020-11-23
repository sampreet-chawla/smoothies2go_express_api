const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    user: { ref: "User", type: Schema.Types.ObjectId },
    cart_items: [{ ref: "CartItem", type: Schema.Types.ObjectId }],
    order_date_time: { type: Date, default: Date.now },
    sub_total_price: { type: Number, required: true, min: 0 },
    fees_tax: { type: Number, required: true, min: 0 },
    total_price: { type: Number, required: true, min: 0 },
    pymt_date_time: { type: Date },
    paid_status: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Order = model("Order", OrderSchema);

module.exports = Order;
