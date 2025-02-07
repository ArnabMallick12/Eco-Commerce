import React from 'react';
import { useStore } from '../store/useStore';
import { Leaf, ShoppingCart } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart } = useStore();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xl font-bold">${product.price}</span>
          <div className="flex items-center space-x-2">
            <Leaf className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">
              {product.carbonFootprint}kg CO₂
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm text-purple-600">
            Earn {product.rewardPoints} points
          </span>
          <button
            onClick={() => addToCart(product)}
            className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-green-700 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};