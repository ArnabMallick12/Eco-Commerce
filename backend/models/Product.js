const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ["furniture", "lighting", "wallArt", "rugs", "curtains", "tableware", "bedding", "plants", "storage", "clocks"],
  },
  description: String,
  material: { type: String, required: true },
  weight: { type: Number, required: true },
  sizeFactor: { type: Number, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  carbonFootprint: { type: Number, required: true },
  rewardPoints: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Use `module.exports` instead of `export default`
module.exports = mongoose.model("Product", productSchema);
