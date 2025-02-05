const express = require("express");
const Product = require("../models/Product"); // Import Product model
const router = express.Router();

// ✅ Get All Products (READ)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("dashboard", { user: req.session.user, products }); // Pass products to EJS
  } catch (err) {
    res.status(500).send("Error fetching products");
  }
});
// ✅ Show Create Product Form
router.get("/add", (req, res) => {
    if (!req.session.user) return res.redirect("/auth/login");
    res.render("add-product", { user: req.session.user });
  });
// Product Details Route
router.get("/:id", async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).send("Product not found");
      
      res.render("product-details", { product });
    } catch (err) {
      res.status(500).send("Error fetching product details");
    }
  });
  



// ✅ Create New Product (CREATE)
router.post("/add", async (req, res) => {
  const { name, category, material, weight, sizeFactor, price } = req.body;
  try {
    const carbonFootprint = (weight * 2) + (sizeFactor * 0.5); // Sample formula

    const newProduct = new Product({ name, category, material, weight, sizeFactor, price, carbonFootprint });
    await newProduct.save();
    res.redirect("/products");
  } catch (err) {
    res.status(500).send("Error creating product");
  }
});

// ✅ Show Edit Product Form
router.get("/edit/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    const product = await Product.findById(req.params.id);
    res.render("edit-product", { user: req.session.user, product });
  } catch (err) {
    res.status(500).send("Error fetching product details");
  }
});

// ✅ Update Product (UPDATE)
router.post("/edit/:id", async (req, res) => {
  const { name, category, material, weight, sizeFactor, price } = req.body;
  try {
    const carbonFootprint = (weight * 2) + (sizeFactor * 0.5); // Sample formula

    await Product.findByIdAndUpdate(req.params.id, { name, category, material, weight, sizeFactor, price, carbonFootprint });
    res.redirect("/products");
  } catch (err) {
    res.status(500).send("Error updating product");
  }
});

// ✅ Delete Product (DELETE)
router.get("/delete/:id", async (req, res) => {
  if (!req.session.user) return res.redirect("/auth/login");
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect("/products");
  } catch (err) {
    res.status(500).send("Error deleting product");
  }
});

module.exports = router;
