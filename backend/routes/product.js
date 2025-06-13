const express = require("express");
const multer = require("multer");
const Product = require("../models/Product");
const { calculateCarbonFootprint } = require("../utils/carbonFootprint");
const { calculateRewardPoints } = require("../utils/rewardPoints");
const router = express.Router();

// ✅ Get All Products (READ)
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({}, "name price imageUrl rewardPoints"); // Include rewardPoints
    res.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
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

// ✅ Get Products by Category
router.get("/category/:category", async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category });

    if (!products.length) return res.status(404).json({ message: "No products found in this category." });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
});


// ✅ Multer Storage for Image Upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Add Product Route
router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const { name, category, description, material, weight, sizeFactor, price } = req.body;
    console.log("📦 Received product data:", { name, category, material, weight, sizeFactor, price });

    if (!req.file) {
      return res.status(400).json({ error: "Image is required" });
    }

    // ✅ Compute Carbon Footprint
    const material_str = material.toLowerCase();
    console.log("🔍 Processing material:", material_str);
    
    const carbonFootprint = await calculateCarbonFootprint(material_str, weight, sizeFactor);
    console.log("🌍 Calculated carbon footprint:", carbonFootprint);
    
    if (carbonFootprint === null) {
      return res.status(400).json({ error: "Invalid material for emission factor" });
    }

    // ✅ Compute Reward Points
    console.log("🎯 Calculating reward points with:", {
      material: material_str,
      weight: parseFloat(weight),
      sizeFactor: parseFloat(sizeFactor)
    });
    
    const rewardPoints = calculateRewardPoints(material_str, parseFloat(weight), parseFloat(sizeFactor));
    console.log("✨ Calculated reward points:", rewardPoints);

    // ✅ Image URL
    const imageUrl = `https://www.google.com/imgres?q=chair&imgurl=https%3A%2F%2Fwww.nilkamalfurniture.com%2Fcdn%2Fshop%2Ffiles%2FPARDSRDB_SRB_IVR_600x.jpg%3Fv%3D1699420541&imgrefurl=https%3A%2F%2Fwww.nilkamalfurniture.com%2Fproducts%2Fnilkamal-paradise-plastic-arm-chair-ratian-dark-beige-season-rust-brown-ivory&docid=32hw-WjSDPPKsM&tbnid=PO7JQpYPa8EJYM&vet=12ahUKEwjH3u3h2rSLAxW7bfUHHcIpMpoQM3oECBoQAA..i&w=600&h=600&hcb=2&ved=2ahUKEwjH3u3h2rSLAxW7bfUHHcIpMpoQM3oECBoQAA`;

    // ✅ Create & Save Product
    const newProduct = new Product({
      name,
      category,
      description,
      material,
      weight: parseFloat(weight),
      sizeFactor: parseFloat(sizeFactor),
      price: parseFloat(price),
      imageUrl,
      carbonFootprint,
      rewardPoints,
    });

    console.log("💾 Saving product with data:", {
      name: newProduct.name,
      material: newProduct.material,
      weight: newProduct.weight,
      sizeFactor: newProduct.sizeFactor,
      carbonFootprint: newProduct.carbonFootprint,
      rewardPoints: newProduct.rewardPoints
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });

  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
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
