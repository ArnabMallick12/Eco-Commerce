import React, { useEffect } from "react";
import { Leaf, Cloud } from "lucide-react";
import { useStore } from "../store/useStore";

export const EnvironmentalImpact = () => {
  const { fetchPurchaseHistory, fetchUserData , totalCarbonFootprint} = useStore((state) => ({
    fetchPurchaseHistory: state.fetchPurchaseHistory,
    fetchUserData: state.fetchUserData,
    totalCarbonFootprint: state.totalCarbonFootprint,
  }));

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
    fetchPurchaseHistory();
  }, []);

  // Calculate total carbon footprint of all purchased items
  // const totalCarbonFootprint = purchaseHistory.reduce(
  //   (total, item) => total + (item.carbonFootprint || 0),
  //   0
  // );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Leaf className="h-6 w-6 text-green-600" />
        Your Environmental Impact
      </h2>

      <div className="bg-green-50 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Cloud className="h-6 w-6 text-green-600" />
          <h3 className="font-medium text-lg">Total Carbon Footprint</h3>
        </div>
        <p className="text-3xl font-bold text-green-600 mt-2">
          {totalCarbonFootprint.toFixed(1)} kg CO₂
        </p>
        <p className="text-sm text-gray-600 mt-2">
          Your total impact from all purchases so far.
        </p>
      </div>
    </div>
  );
};
