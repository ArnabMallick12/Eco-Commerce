const mongoose = require('mongoose');
const Material = require('../models/Material');

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
  { name: "cork", emissionFactor: 1.00, description: "Sustainable cork for flooring and walls" },
  // Additional common materials
  { name: "wood", emissionFactor: 0.50, description: "General wood material" },
  { name: "plastic", emissionFactor: 3.00, description: "General plastic material" },
  { name: "metal", emissionFactor: 2.00, description: "General metal material" },
  { name: "fabric", emissionFactor: 2.50, description: "General fabric material" },
  { name: "paper", emissionFactor: 0.80, description: "Recycled paper material" },
  { name: "leather", emissionFactor: 4.00, description: "Natural leather material" },
  { name: "stone", emissionFactor: 1.50, description: "Natural stone material" },
  { name: "concrete", emissionFactor: 1.20, description: "Concrete material" },
  { name: "clay", emissionFactor: 0.90, description: "Natural clay material" },
  { name: "rattan", emissionFactor: 0.70, description: "Natural rattan material" },
  { name: "wicker", emissionFactor: 0.60, description: "Natural wicker material" },
  { name: "recycled_plastic", emissionFactor: 2.50, description: "Recycled plastic material" },
  { name: "recycled_wood", emissionFactor: 0.40, description: "Recycled wood material" },
  { name: "organic_cotton", emissionFactor: 1.80, description: "Organic cotton material" }
];

const initMaterials = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eco-commerce');
    console.log('📦 Connected to MongoDB');

    // Clear existing materials
    await Material.deleteMany({});
    console.log('🧹 Cleared existing materials');

    // Insert new materials
    await Material.insertMany(materials);
    console.log('✅ Materials initialized successfully');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error initializing materials:', error);
    process.exit(1);
  }
};

// Run the initialization
initMaterials(); 