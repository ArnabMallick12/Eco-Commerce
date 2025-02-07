const express = require("express");
const Product = require("../models/Product");
const { calculateCarbonFootprint } = require("../utils/carbonFootprint");
const router = express.Router();

// ✅ Get All Products (READ)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Error fetching products" });
  }
});

// ✅ Get Product Details (READ)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Error fetching product details" });
  }
});

// ✅ Create Product (CREATE)
router.post("/add", async (req, res) => {
  const { name, category, material, weight, sizeFactor, price } = req.body;

  try {
    const carbonFootprint = await calculateCarbonFootprint(material, weight, sizeFactor);

    if (carbonFootprint === null) {
      return res.status(400).json({ error: "Invalid material name" });
    }

    const newProduct = new Product({
      name,
      category,
      material,
      weight,
      sizeFactor,
      price,
      carbonFootprint
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

// ✅ Update Product (UPDATE)
router.put("/edit/:id", async (req, res) => {
  const { name, category, material, weight, sizeFactor, price } = req.body;
  try {
    const carbonFootprint = (weight * 2) + (sizeFactor * 0.5); // Sample formula

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, material, weight, sizeFactor, price, carbonFootprint },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ error: "Error updating product" });
  }
});

// ✅ Delete Product (DELETE)
router.delete("/delete/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ error: "Product not found" });

    res.json({ message: "Product deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting product" });
  }
});

module.exports = router;
