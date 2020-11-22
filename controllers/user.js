require("dotenv").config();
const { SECRET } = process.env;
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    const oldUser = await User.findOne({ username: req.body.username });
    if (oldUser) {
      res.json({
        status: 400,
        error: `${req.body.username} user name already exists.`,
      });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create(req.body);
    res.json({ status: 200, data: newUser });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        const token = await jwt.sign({ username }, SECRET);
        res.json({ status: 200, token: token });
      } else {
        res.json({ status: 400, error: "Password does not match." });
      }
    } else {
      res.json({ status: 400, error: "User does not exist." });
    }
    res.json({ status: 200, data: newUser });
  } catch (err) {
    res.json({ status: 500, error: err.message });
  }
});

module.exports = router;
