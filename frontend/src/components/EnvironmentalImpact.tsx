import React from 'react';
import { Leaf, Cloud } from 'lucide-react';
import { useStore } from '../store/useStore';

export const EnvironmentalImpact = () => {
  const { purchaseHistory } = useStore();
  
  // Calculate total carbon savings compared to conventional products
  // Assuming conventional products have 50% higher carbon footprint
  const totalCarbonSaved = purchaseHistory.reduce((total, item) => {
    const conventionalFootprint = item.carbonFootprint * 1.5;
    return total + (conventionalFootprint - item.carbonFootprint);
  }, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-600" />
        Your Environmental Impact
      </h2>
      
      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Cloud className="h-6 w-6 text-green-600" />
          <h3 className="font-medium text-lg">Total Carbon Saved</h3>
        </div>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {totalCarbonSaved.toFixed(1)} kg CO₂
        </p>
        <p className="text-sm text-gray-600 mt-2">
          By choosing our eco-friendly products over conventional alternatives
        </p>
      </div>
    </div>
  );
};