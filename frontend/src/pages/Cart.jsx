import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Cart = () => {
  const { cart, removeFromCart, completePurchase } = useStore();
  const navigate = useNavigate();

  const totalAmount = cart.reduce((total, item) => total + item.price, 0);
  const totalRewardPoints = cart.reduce((total, item) => total + item.rewardPoints, 0);
  const totalCarbonFootprint = cart.reduce((total, item) => total + item.carbonFootprint, 0);

  const handleCheckout = () => {
    completePurchase();
    navigate('/checkout-success');
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Start shopping to add items to your cart</p>
        <button
          onClick={() => navigate('/')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {cart.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="ml-6 flex-grow">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="text-green-600 font-medium">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500 text-sm">
                    Carbon Footprint: {item.carbonFootprint}kg CO₂
                  </span>
                  <span className="text-purple-600 text-sm">
                    +{item.rewardPoints} points
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Reward Points</span>
                <span>+{totalRewardPoints} points</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Total Carbon Footprint</span>
                <span>{totalCarbonFootprint}kg CO₂</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between mb-4">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">${totalAmount.toFixed(2)}</span>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
              </button>
            </div>

            <div className="mt-4 flex items-start space-x-2 text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <p>
                Your purchase will earn you rewards points based on the carbon footprint of the products.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};