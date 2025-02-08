const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();

// ✅ Checkout Route (Process Order & Update Rewards)
router.post("/", async (req, res) => {
  const { userId, cart } = req.body;

  if (!userId || !cart || cart.length === 0) {
    return res.status(400).json({ error: "Invalid checkout data" });
  }

  console.log("🛒 Checkout cart:", JSON.stringify(cart, null, 2));

  try {
    // ✅ Find User
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    console.log(`🔍 User before update: ${user.rewardPoints} points`);

    // ✅ Calculate Total Price & Reward Points
    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    const earnedRewardPoints = cart.reduce((sum, item) => sum + (item.rewardPoints || 0), 0);

    console.log(`✅ Earned Reward Points: ${earnedRewardPoints}`);

    // ✅ Create Order
    const newOrder = new Order({
      userId,
      items: cart.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        rewardPoints: item.rewardPoints || 0, // ✅ Ensure reward points are stored
      })),
      totalPrice,
    });

    await newOrder.save();

    // ✅ Update User's Reward Points in MongoDB
    user.rewardPoints = (user.rewardPoints || 0) + earnedRewardPoints;
    await user.save(); // ✅ Save updated user points

    console.log(`✅ User after update: ${user.rewardPoints} points`);

    res.json({
      message: "Order placed successfully!",
      order: newOrder,
      newRewardPoints: user.rewardPoints, // ✅ Send updated rewards
    });
  } catch (error) {
    console.error("❌ Checkout error:", error);
    res.status(500).json({ error: "Error processing checkout" });
  }
});

module.exports = router;
