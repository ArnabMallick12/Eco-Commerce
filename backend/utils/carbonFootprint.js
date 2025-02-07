const Material = require("../models/Material");

const transportEmissionFactor = 0.5; // kg CO₂ per kg per km

const calculateCarbonFootprint = async (materialName, weight, sizeFactor) => {
  try {
    const material = await Material.findOne({ name: materialName });

    if (!material) {
      throw new Error("Material not found in database");
    }

    const carbonFootprint = (material.emissionFactor * weight) + (sizeFactor * transportEmissionFactor);
    return parseFloat(carbonFootprint.toFixed(2));
  } catch (error) {
    console.error("Error calculating carbon footprint:", error.message);
    return null;
  }
};

module.exports = { calculateCarbonFootprint };
