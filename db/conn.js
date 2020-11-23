require("dotenv").config();
const { MONGODBURI } = process.env;
const mongoose = require("mongoose");
//const MONGODBURI = "mongodb://localhost:27017/smoothies2go_db";

mongoose.connect(MONGODBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

const db = mongoose.connection;

db.on("error", (error) => console.log("Db connection error - ", error));
db.on("connected", () => console.log("Db connected... "));
db.on("disconnected", () => console.log("Db disconnected "));

module.exports = mongoose;
