const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();

// ✅ Checkout Route (Process Order & Update Rewards)
router.post("/", async (req, res) => {
  console.log("📦 Received checkout request:", JSON.stringify(req.body, null, 2));
  
  const { userId, cart } = req.body;

  // ✅ Validate request data
  if (!userId) {
    console.error("❌ Missing userId in request");
    return res.status(400).json({ error: "Missing userId" });
  }

  if (!cart || !cart.items || !Array.isArray(cart.items) || cart.items.length === 0) {
    console.error("❌ Invalid cart data:", cart);
    return res.status(400).json({ error: "Invalid cart data" });
  }

  try {
    // ✅ Find User
    const user = await User.findById(userId);
    if (!user) {
      console.error("❌ User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log("👤 Found user:", {
      id: user._id,
      currentPoints: user.rewardPoints
    });

    // ✅ Validate cart items
    const validatedItems = cart.items.map(item => {
      if (!item.productId || !item.productId._id || !item.productId.name || !item.productId.price) {
        throw new Error(`Invalid cart item: ${JSON.stringify(item)}`);
      }
      return item;
    });

    // ✅ Calculate totals
    const totalPrice = validatedItems.reduce((sum, item) => 
      sum + (item.productId.price * (item.quantity || 1)), 0
    );
    
    const totalCarbonFootprint = validatedItems.reduce((sum, item) => 
      sum + ((item.productId.carbonFootprint || 0) * (item.quantity || 1)), 0
    );
    
    const earnedRewardPoints = validatedItems.reduce((sum, item) => 
      sum + ((item.productId.rewardPoints || 0) * (item.quantity || 1)), 0
    );

    console.log("💰 Calculated totals:", {
      totalPrice,
      totalCarbonFootprint,
      earnedRewardPoints
    });

    // ✅ Create Order
    const order = new Order({
      userId,
      products: validatedItems.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        carbonFootprint: item.productId.carbonFootprint || 0,
        quantity: item.quantity || 1
      })),
      totalPrice,
      totalCarbonFootprint,
      rewardPoints: earnedRewardPoints
    });

    console.log("📝 Created order:", {
      id: order._id,
      totalPrice: order.totalPrice,
      rewardPoints: order.rewardPoints
    });

    await order.save();

    // ✅ Update User's Reward Points
    user.rewardPoints = (user.rewardPoints || 0) + earnedRewardPoints;
    await user.save();

    console.log("✅ Order completed:", {
      orderId: order._id,
      newUserPoints: user.rewardPoints
    });

    res.json({
      message: "Order placed successfully!",
      order,
      newRewardPoints: user.rewardPoints
    });
  } catch (error) {
    console.error("❌ Checkout error:", {
      message: error.message,
      stack: error.stack,
      userId,
      cartItems: cart?.items?.length
    });
    res.status(500).json({ 
      error: "Error processing checkout",
      details: error.message
    });
  }
});

module.exports = router;
