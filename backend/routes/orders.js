const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const router = express.Router();

// ✅ Calculate reward points (Simple Formula)
const calculateRewardPoints = (carbonFootprint) => {
  return Math.max(1, 10 - carbonFootprint * 0.5); // Ensure at least 1 point
};

// ✅ Place an Order
router.post("/create", async (req, res) => {
  const { userId, products } = req.body;

  try {
    let totalPrice = 0;
    let totalCarbonFootprint = 0;
    let orderProducts = [];

    // Fetch product details and calculate totals
    for (let item of products) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ error: "Product not found" });

      totalPrice += product.price * item.quantity;
      totalCarbonFootprint += product.carbonFootprint * item.quantity;
      orderProducts.push({ 
        productId: product._id,
        name: product.name,
        price: product.price,
        carbonFootprint: product.carbonFootprint,
        quantity: item.quantity
      });
    }

    // Calculate reward points based on carbon footprint
    const rewardPoints = calculateRewardPoints(totalCarbonFootprint);

    // Save order to database
    const newOrder = new Order({
      userId,
      products: orderProducts,
      totalPrice,
      totalCarbonFootprint,
      rewardPoints
    });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully!", order: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Error creating order", details: error });
  }
});

// ✅ Fetch User Order History
router.get("/history/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order history" });
  }
});

module.exports = router;
