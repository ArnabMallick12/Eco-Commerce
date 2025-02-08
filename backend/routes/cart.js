const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");
const router = express.Router();

// ✅ Fetch User Cart
// ✅ Fetch User Cart
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate("items.productId");

    if (!cart || !Array.isArray(cart.items)) {
      return res.json({ items: [] }); // ✅ Always return an array
    }

    // ✅ Ensure `rewardPoints` exists in each product
    const cartItems = cart.items.map((item) => ({
      _id: item.productId._id, // Use MongoDB `_id`
      name: item.productId.name,
      price: item.productId.price,
      imageUrl: item.productId.imageUrl,
      description: item.productId.description,
      rewardPoints: item.productId.rewardPoints, // ✅ Use correct key
      productId: item.productId._id, // Add productId for fallback
    }));

    res.json({ items: cartItems });
  } catch (error) {
    console.error("❌ Error fetching cart:", error);
    res.status(500).json({ error: "Error fetching cart" });
  }
});


// ✅ Add Item to Cart
// ✅ Add Item to Cart
router.post("/add", async (req, res) => {
  const { userId, productId } = req.body;
  console.log(req.body);

  try {
    const product = await Product.findById(productId);
    
    if (!product) {
      console.error("❌ Product Not Found:", productId);
      return res.status(404).json({ error: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    // ✅ Ensure `rewardPoints` is stored correctly
    cart.items.push({
      productId,
      quantity: 1,
      rewardPoints: product.rewardPoints, // ✅ Use correct key
    });

    await cart.save();
    res.json({ message: "Product added to cart!", cart });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




// ✅ Remove Item from Cart
router.delete("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  try {
    console.log(`🗑️ Removing product ${productId} from cart for user ${userId}`);

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();

    res.json({ message: "Item removed", cart });
  } catch (error) {
    console.error("❌ Error removing item:", error);
    res.status(500).json({ error: "Error removing item" });
  }
});

// ✅ Checkout (Convert Cart to Order)
// ✅ Checkout (Convert Cart to Order)
router.post("/checkout", async (req, res) => {
  const { userId } = req.body;

  try {
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart || cart.items.length === 0) return res.status(400).json({ error: "Cart is empty" });

    // ✅ Create an order with reward points included
    const order = new Order({
      userId,
      products: cart.items.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        price: item.productId.price,
        carbonFootprint: item.productId.carbonFootprint,
        quantity: item.quantity,
        rewardPoints: item.productId.rewardPoints, // ✅ Ensure this is saved
      })),
      totalPrice: cart.items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0),
      totalCarbonFootprint: cart.items.reduce((sum, item) => sum + item.productId.carbonFootprint * item.quantity, 0),
      rewardPoints: cart.items.reduce((sum, item) => sum + item.productId.rewardPoints * item.quantity, 0),
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.json({ message: "Order placed successfully!", order });
  } catch (error) {
    res.status(500).json({ error: "Error processing checkout" });
  }
});


module.exports = router;
