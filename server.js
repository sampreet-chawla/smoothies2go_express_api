require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const { PORT = 4000, NODE_ENV = "development" } = process.env;
const authRouter = require("./controllers/userRoutes");
const auth = require("./auth");
//CORS
const cors = require("cors");
const corsOptions = require("./configs/cors.js");
const mongoose = require("./db/conn");

// Add the middleware code needed to accept incoming data and add it to req.body
//NODE_ENV === "production" ? app.use(cors(corsOptions)) : app.use(cors());
// Enabled to allow POSTMAN testing.
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(logger("tiny"));
app.use(express.static("."));
app.use("/auth", authRouter);

// Add Custom Routers

// Default route
app.get("/", (req, res) => {
  res.json({ status: 200, msg: "Welcome to Smoothies 2 Go Express backend." });
});

// Add Custom Routes
// const itemRouter = require('./controllers/itemRoutes');
//app.use('/api/items/', auth, itemRouter);

const itemRouter = require("./controllers/itemRoutes");
app.use("/api/items/", itemRouter);

const cartitemRouter = require("./controllers/cartitemRoutes");
app.use("/api/cartitems/", cartitemRouter);

const orderRouter = require("./controllers/orderRoutes");
app.use("/api/orders/", orderRouter);

const stripeRouter = require("./controllers/stripeRoutes");
app.use("/api/stripe-payment/", stripeRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT} !`));
