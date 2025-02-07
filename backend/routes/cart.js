const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// ✅ Add a product to the cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        carbonFootprint: product.carbonFootprint,
        quantity
      });
    }

    await cart.save();
    res.json({ message: "Product added to cart!", cart });
  } catch (error) {
    res.status(500).json({ error: "Error adding product to cart" });
  }
});

// ✅ Remove a product from the cart
router.delete("/remove/:userId/:productId", async (req, res) => {
  const { userId, productId } = req.params;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();

    res.json({ message: "Product removed from cart!", cart });
  } catch (error) {
    res.status(500).json({ error: "Error removing product from cart" });
  }
});

// ✅ Update quantity of a product in the cart
router.put("/update", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
    if (itemIndex === -1) return res.status(404).json({ error: "Product not found in cart" });

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.json({ message: "Cart updated!", cart });
  } catch (error) {
    res.status(500).json({ error: "Error updating cart" });
  }
});

// ✅ Fetch cart items
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart || { userId: req.params.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: "Error fetching cart" });
  }
});

module.exports = router;
