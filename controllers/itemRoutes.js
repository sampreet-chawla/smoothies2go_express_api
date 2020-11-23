const Item = require("../models/item");
const router = require("express").Router();
const itemsData = require("../db/itemsData.json");

// Seed the items
// Be careful as use with existing cart-items and orders will it will bring inconsistencies with Item.ObjectId
router.post("/seed", async (req, res) => {
  try {
    await Item.deleteMany({});
    const items = await Item.insertMany(itemsData);
    res.status(200).json({ data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find({});
    res.status(200).json({ data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single item for the ObjectId as :index
router.get("/:index", async (req, res) => {
  try {
    //const item = await Item.find({ _id: req.params.index }); OR
    const item = await Item.findById(req.params.index);
    res.status(200).json({ data: item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get item(s) whose item_name is like:name and is not in Popular Items (Smoothie) category
router.get("/name/:name", async (req, res) => {
  try {
    const items = await Item.find({
      $and: [
        { item_name: { $regex: req.params.name, $options: "i" } },
        { category: { $ne: "Popular Items (Smoothie)" } },
      ],
    });
    res.status(200).json({ data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;