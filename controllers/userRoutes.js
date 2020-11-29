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
      res.status(200).json({
        status: 400,
        error: `${req.body.username} user name already exists.`,
      });
      return;
    }
    //TODO - case insensitive exact match with { $toUpper: <expression> }
    const oldUserWithEmail = await User.findOne({ email: req.body.email });
    if (oldUserWithEmail) {
      res.status(200).json({
        status: 400,
        error: `${req.body.email} email already in use.`,
      });
      return;
    }
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create(req.body);
    const token = await jwt.sign({ username: newUser.username }, SECRET);
    const userDetails = {
      _id: newUser._id,
      username: newUser.username,
      first_name: newUser.first_name,
      last_name: newUser.last_name,
      email: newUser.email,
      token: token,
    };
    res.status(200).json({ data: userDetails });
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
        const userDetails = {
          _id: user._id,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          token: token,
        };
        res.status(200).json({ data: userDetails });
      } else {
        res
          .status(200)
          .json({ status: 400, error: "Password does not match." });
      }
    } else {
      res.status(200).json({ status: 400, error: "Username does not exist." });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
