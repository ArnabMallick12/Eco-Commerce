const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: String,
      price: Number,
      carbonFootprint: Number,
      points : Number,
      quantity: { type: Number, default: 1 }
    }
  ]
});

module.exports = mongoose.model("Cart", CartSchema);
