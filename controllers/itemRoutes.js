const Item = require("../models/item");
const router = require("express").Router();
const itemsData = require("../db/itemsData.json");

// Seed the items
// Be careful as use with existing cart-items and orders will it will bring inconsistencies with Item.ObjectId
// Made it as a GET Method to be able to execute from the browser
router.get("/seed", async (req, res) => {
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

// Get all items grouped by Category
router.get("/category-groups", async (req, res) => {
  try {
    const items = await Item.find({});

    // Group the results by Categories if items are available.
    const categoriesArr = [];
    if (items && items.length > 0) {
      // Add the popular items in Popular category
      const popularItems = items.filter((item) => item.is_popular);
      console.log("Adding Popular items: ", popularItems);
      categoriesArr.push({
        category: "Popular Items (Smoothie)",
        items: popularItems,
      });

      // Add all items grouped by their categories.
      items.forEach((itemCurr) => {
        let added = false;
        categoriesArr.forEach((catCurr) => {
          if (catCurr.category === itemCurr.category) {
            catCurr.items.push(itemCurr);
            added = true;
          }
        });
        if (!added) {
          categoriesArr.push({
            category: itemCurr.category,
            items: [itemCurr],
          });
        }
      });
    }
    res.status(200).json({ data: categoriesArr });
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
