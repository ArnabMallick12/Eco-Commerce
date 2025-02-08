const materials = [
  { name: "softwood", emissionFactor: 0.46, description: "Sustainable softwood timber" },
  { name: "hardwood", emissionFactor: 0.55, description: "Durable hardwood for furniture" },
  { name: "plywood", emissionFactor: 1.10, description: "Engineered plywood for construction" },
  { name: "aluminum", emissionFactor: 9.00, description: "Recycled aluminum for durability" },
  { name: "steel", emissionFactor: 1.80, description: "Structural steel with moderate footprint" },
  { name: "stainless_steel", emissionFactor: 2.30, description: "Corrosion-resistant stainless steel" },
  { name: "copper", emissionFactor: 3.90, description: "High-conductivity copper for decor" },
  { name: "glass", emissionFactor: 1.50, description: "Standard glass for home decor" },
  { name: "tempered_glass", emissionFactor: 1.80, description: "Heat-treated tempered glass" },
  { name: "acrylic", emissionFactor: 6.00, description: "Lightweight acrylic for decor" },
  { name: "polyethylene", emissionFactor: 3.50, description: "Common plastic (PE) for home items" },
  { name: "polypropylene", emissionFactor: 2.90, description: "Durable plastic (PP) for furniture" },
  { name: "pvc", emissionFactor: 2.40, description: "PVC material for flooring and decor" },
  { name: "cotton", emissionFactor: 2.10, description: "Organic cotton for upholstery" },
  { name: "wool", emissionFactor: 5.40, description: "Natural wool for rugs and fabrics" },
  { name: "silk", emissionFactor: 6.80, description: "Luxurious silk fabric" },
  { name: "polyester", emissionFactor: 4.50, description: "Synthetic polyester fabric" },
  { name: "bamboo", emissionFactor: 1.20, description: "Fast-growing eco-friendly bamboo" },
  { name: "ceramic", emissionFactor: 3.20, description: "Eco-friendly ceramic for tiles" },
  { name: "jute", emissionFactor: 1.50, description: "Natural jute fiber for decor" },
  { name: "cork", emissionFactor: 1.00, description: "Sustainable cork for flooring and walls" }
];

// Function to find material by name
const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  emissionFactor: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

const Material = mongoose.model("Material", materialSchema);

module.exports = Material;
