export const calculateRewardPoints = (order) => {
    const basePoints = 10; // Points per product
    const carbonPenalty = 0.5; // Deduction per kg CO₂
  
    let totalPoints = 0;
  
    order.products.forEach((product) => {
      const productPoints = Math.max(1, basePoints - (carbonPenalty * product.carbonFootprint)); // Ensure at least 1 point
      totalPoints += productPoints * product.quantity;
    });
  
    return Math.round(totalPoints); // Return whole number points
  };
  