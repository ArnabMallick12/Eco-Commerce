import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export const CheckoutSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Completed!</h2>
      <p className="text-gray-600 mb-8">
        Thank you for your purchase. Your rewards points have been credited to your account.
      </p>
      <button
        onClick={() => navigate('/')}
        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
      >
        Continue Shopping
      </button>
    </div>
  );
};