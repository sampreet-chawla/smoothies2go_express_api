require("dotenv").config();
const { SECRET } = process.env;
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    // Parse the token from the Header - Authentication: "bearer <token>"
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];
      const payload = await jwt.verify(token, SECRET);
      if (payload) {
        req.payload = payload;
        next();
      } else {
        res.json({ status: 401, error: "VERIFICATION FAILED OR NO PAYLOAD" });
      }
    } else {
      res.json({ status: 401, error: "NO AUTHORIZATION ERROR" });
    }
  } catch (error) {
    res.json({ status: 500, error: error });
  }
};

module.exports = auth;
