require("dotenv").config();
const { SECRET } = process.env;
const User = require("../models/user");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", async (req, res) => {
  try {
    //TODO - case insensitive exact natch with { $toUpper: <expression> }
    const oldUserWithName = await User.findOne({ username: req.body.username });
    if (oldUserWithName) {
      res
        .status(400)
        .json({ error: `${req.body.username} user name already exists.` });
    }
    //TODO - case insensitive exact natch with { $toUpper: <expression> }
    const oldUserWithEmail = await User.findOne({ email: req.body.email });
    if (oldUserWithEmail) {
      res
        .status(400)
        .json({ error: `${req.body.email} email already in use.` });
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create(req.body);
    res.status(200).json({ data: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
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
        res.status(200).json({ token: token, data: user });
      } else {
        res.status(400).json({ error: "Password does not match." });
      }
    } else {
      res.status(400).json({ error: "User does not exist." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
