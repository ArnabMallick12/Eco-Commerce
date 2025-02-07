const mongoose = require("mongoose");

const MaterialSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  emissionFactor: { type: Number, required: true } // kg CO₂ per kg
});

module.exports = mongoose.model("Material", MaterialSchema);
