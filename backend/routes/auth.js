const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const product = require("../models/Product")
const router = express.Router();

// Signup Route
router.get("/signup", (req, res) => {
  res.render("signup", { error: null });
});

router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.render("signup", { error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.redirect("/login");
  } catch (err) {
    res.render("signup", { error: "Server error" });
  }
});

// Login Route
router.get("/login", (req, res) => {
  res.render("login",{ error: null });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.render("login", { error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.render("login", { error: "Invalid credentials" });

    req.session.user = user;
    res.redirect("/dashboard");
  } catch (err) {
    res.render("login", { error: "Server error" });
  }
});

// Dashboard Route (Protected)
router.get("/dashboard", async (req, res) => {
    if (!req.session.user) return res.redirect("/login"); // Redirect if not logged in
    try {
        const products = await product.find(); // Fetch all products from MongoDB
        res.render("dashboard", { user: req.session.user, products });
      } catch (error) {
        res.status(500).send("Error fetching products");
      }
  });
  

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = router;
