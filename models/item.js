const { Schema, model } = require("mongoose");

const ItemSchema = new Schema(
  {
    category: { type: String, required: true },
    item_name: { type: String, required: true },
    description: { type: String, required: true },
    image_url: { type: String, required: true },
    thumbnail_image_url: { type: String, required: true },
    price: { type: Number, required: true },
  },
  { timestamps: true }
);

const Item = model("Item", ItemSchema);

module.exports = Item;
