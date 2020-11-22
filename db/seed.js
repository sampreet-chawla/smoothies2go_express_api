const mongoose = require("./conn");
const Item = require("../models/Item");
const items = require("./itemsData.json");
const db = mongoose.connection;

// Insert Seed Data for Items
Item.deleteMany({}).then(() => {
  Item.insertMany(items).then((items) => {
    console.log("items inserted", items);
    db.close();
  });
});
