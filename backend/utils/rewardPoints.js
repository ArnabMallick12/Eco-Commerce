// utils/rewardPoints.js

// Material emission factors from the database (lower is better)
const materialEmissionFactors = {
  softwood: 0.46,
  hardwood: 0.55,
  plywood: 1.10,
  aluminum: 9.00,
  steel: 1.80,
  stainless_steel: 2.30,
  copper: 3.90,
  glass: 1.50,
  tempered_glass: 1.80,
  acrylic: 6.00,
  polyethylene: 3.50,
  polypropylene: 2.90,
  pvc: 2.40,
  cotton: 2.10,
  wool: 5.40,
  silk: 6.80,
  polyester: 4.50,
  bamboo: 1.20,
  ceramic: 3.20,
  jute: 1.50,
  cork: 1.00,
  // Add more common materials
  wood: 0.50,
  plastic: 3.00,
  metal: 2.00,
  fabric: 2.50,
  paper: 0.80,
  leather: 4.00,
  stone: 1.50,
  concrete: 1.20,
  clay: 0.90,
  rattan: 0.70,
  wicker: 0.60,
  recycled_plastic: 2.50,
  recycled_wood: 0.40,
  organic_cotton: 1.80
};

/**
 * Calculates reward points based on:
 * - Material's sustainability (lower emission = more points)
 * - Weight & Size Factor (heavier/smaller items get balanced points)
 */
const calculateRewardPoints = (material, weight, sizeFactor) => {
  if (!material || typeof material !== "string") {
    console.error("❌ Invalid material input:", material);
    return 0; // Default points
  }

  // Normalize material key
  const materialKey = material.toLowerCase().trim().replace(/\s+/g, "_");
  console.log("🔍 Normalized material key:", materialKey);
  
  const emissionFactor = materialEmissionFactors[materialKey];
  console.log("📊 Emission factor for material:", emissionFactor);
  
  if (emissionFactor === undefined) {
    console.error("❌ Material not found in database:", materialKey);
    return 0;
  }

  // Base points: Inversely proportional to emissions (low emission = high reward)
  let basePoints = Math.round((10 / emissionFactor) * 100);
  console.log("💫 Base points:", basePoints);

  // Bonus points for highly sustainable materials
  let materialBonus = 0;
  if (emissionFactor < 1) materialBonus = 50;
  else if (emissionFactor < 2) materialBonus = 30;
  else if (emissionFactor < 3) materialBonus = 15;
  console.log("🌟 Material bonus points:", materialBonus);

  // Weight Factor (Lighter products get a small bonus)
  const weightFactor = Math.max(10 - weight, 5);
  console.log("⚖️ Weight factor points:", weightFactor);

  // Size Factor (Smaller products get more points)
  const sizeFactorBonus = Math.max(20 - sizeFactor * 5, 5);
  console.log("📏 Size factor bonus points:", sizeFactorBonus);

  // Total Reward Points Calculation
  const totalPoints = Math.round(basePoints + materialBonus + weightFactor + sizeFactorBonus);

  console.log(`🎯 Final calculation:
    Material: ${materialKey}
    Emission Factor: ${emissionFactor}
    Base Points: ${basePoints}
    Material Bonus: ${materialBonus}
    Weight Factor: ${weightFactor}
    Size Factor Bonus: ${sizeFactorBonus}
    Total Points: ${totalPoints}
  `);

  return totalPoints;
};

module.exports = { calculateRewardPoints };
