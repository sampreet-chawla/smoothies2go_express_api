const { Schema, model } = require("mongoose");
const connection = require("../db/conn");

// Reference - https://www.npmjs.com/package/mongoose-auto-increment - not used
// const autoIncrement = require('mongoose-auto-increment');
// autoIncrement.initialize(connection);

// Reference - https://www.npmjs.com/package/mongoose-sequence - Used this as it is easier, requires mongoose version 4.0.0 or above.
const AutoIncrement = require("mongoose-sequence")(connection);

const OrderSchema = new Schema(
  {
    _id: Number,
    user: { ref: "User", type: Schema.Types.ObjectId },
    cart_items: [{ ref: "CartItem", type: Schema.Types.ObjectId }],
    order_date_time: { type: Date, default: Date.now },
    sub_total_price: { type: Number, required: true, min: 0 },
    fees_tax: { type: Number, required: true, min: 0 },
    total_price: { type: Number, required: true, min: 0 },
    order_status: { type: String, default: "Created" },
    pymt_date_time: { type: Date },
    paid_status: { type: Boolean, default: false },
  },
  { _id: false, timestamps: true }
);
OrderSchema.plugin(AutoIncrement);

// OrderSchema.plugin(autoIncrement.plugin, {
//   model: 'Order',
//   field: 'orderId',
//   startAt: 100,
//   incrementBy: 1
// });

const Order = model("Order", OrderSchema);

module.exports = Order;
