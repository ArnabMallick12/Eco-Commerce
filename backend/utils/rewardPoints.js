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
  cork: 1.00
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

  const materialKey = material.toLowerCase().replace(/\s+/g, "_"); // Normalize key
  const emissionFactor = materialEmissionFactors[materialKey] || 5.0; // Default if missing

  // Base points: Inversely proportional to emissions (low emission = high reward)
  let basePoints = Math.round((10 / emissionFactor) * 100);

  // Bonus points for highly sustainable materials
  if (emissionFactor < 1) basePoints += 50;
  else if (emissionFactor < 2) basePoints += 30;
  else if (emissionFactor < 3) basePoints += 15;

  // Weight Factor (Lighter products get a small bonus)
  const weightFactor = Math.max(10 - weight, 5); // Ensure a minimum boost

  // Size Factor (Smaller products get more points)
  const sizeFactorBonus = Math.max(20 - sizeFactor * 5, 5);

  // Total Reward Points Calculation
  const totalPoints = Math.round(basePoints + weightFactor + sizeFactorBonus);

  console.log(`🎯 Material: ${material}, Emission Factor: ${emissionFactor}, Reward Points: ${totalPoints}`);
  return totalPoints;
};

module.exports = { calculateRewardPoints };
