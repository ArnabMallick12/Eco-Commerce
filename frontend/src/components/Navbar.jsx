import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Leaf } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Navbar = () => {
  const { cart, user } = useStore();

  return (
    <nav className="bg-green-700 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Leaf className="h-6 w-6" />
          <span className="text-xl font-bold">EcoDecor</span>
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/cart" className="flex items-center">
            <ShoppingCart className="h-6 w-6" />
            {cart.length > 0 && (
              <span className="ml-1 bg-green-500 rounded-full px-2 text-sm">
                {cart.length}
              </span>
            )}
          </Link>
          
          {user ? (
            <Link to="/profile" className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>{user.rewardPoints} points</span>
            </Link>
          ) : (
            <Link to="/login" className="flex items-center space-x-2">
              <User className="h-6 w-6" />
              <span>Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};