import React from 'react';
import { Trophy, CreditCard } from 'lucide-react';
import { useStore } from '../store/useStore';

export const RewardsTracker = () => {
  const { user, purchaseHistory } = useStore();
  const totalSpent = purchaseHistory.reduce((total, item) => total + item.price, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Trophy className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Reward Points</h3>
            <p className="text-2xl font-bold text-green-600">
              {user?.rewardPoints || 0} points
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-purple-100 p-3 rounded-full">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Total Spent</h3>
            <p className="text-2xl font-bold text-purple-600">
              ${totalSpent.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};