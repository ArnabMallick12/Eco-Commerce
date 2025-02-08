const express = require("express");
const Order = require("../models/Order");
const User = require("../models/User");
const router = express.Router();


router.get("/",(req,res)=>{
    console.log("req recivied on /user");
});

// ✅ Fetch User Rewards & Purchase History
router.get("/:userId/rewards", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    // ✅ Fetch user's order history
    const orders = await Order.find({ userId: req.params.userId });

    res.json({
      rewardPoints: user.rewardPoints,
      purchaseHistory: orders.map((order) => ({
        orderId: order._id,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
      })),
    });
  } catch (error) {
    console.error("❌ Error fetching user rewards:", error);
    res.status(500).json({ error: "Error fetching rewards" });
  }
});


module.exports = router;
