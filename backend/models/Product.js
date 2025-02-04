const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  material: { type: String, required: true },
  weight: { type: Number, required: true },
  sizeFactor: { type: Number, required: true },
  price: { type: Number, required: true },
  carbonFootprint: { type: Number, default: 0 },
});

module.exports = mongoose.model("Product", ProductSchema);
