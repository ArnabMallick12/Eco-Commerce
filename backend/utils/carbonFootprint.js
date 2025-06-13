const Material = require("../models/Material");

const transportEmissionFactor = 0.5; // kg CO₂ per kg per km

const calculateCarbonFootprint = async (materialName, weight, sizeFactor) => {
  try {
    console.log("🔍 Looking up material:", materialName);
    
    // Normalize material name
    const normalizedName = materialName.toLowerCase().trim().replace(/\s+/g, "_");
    console.log("📝 Normalized material name:", normalizedName);
    
    const material = await Material.findOne({ name: normalizedName });
    console.log("📊 Found material:", material);

    if (!material) {
      console.error("❌ Material not found:", normalizedName);
      return null;
    }

    const carbonFootprint = (material.emissionFactor * weight) + (sizeFactor * transportEmissionFactor);
    console.log("🌍 Calculated carbon footprint:", {
      materialFactor: material.emissionFactor,
      weight,
      sizeFactor,
      transportFactor: transportEmissionFactor,
      total: carbonFootprint
    });
    
    return parseFloat(carbonFootprint.toFixed(2));
  } catch (error) {
    console.error("❌ Error calculating carbon footprint:", error.message);
    return null;
  }
};

module.exports = { calculateCarbonFootprint };
