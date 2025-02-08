import React from 'react';
import { Link } from 'react-router-dom';
import { Sofa, Lamp, Frame, Car as Carpet, Mountain as Curtains, UtensilsCrossed, BedDouble, Flower2, Package, Clock, Plus } from 'lucide-react';
import { RewardsTracker } from '../components/RewardsTracker';
import { EnvironmentalImpact } from '../components/EnvironmentalImpact';

const categories = [
  { name: 'Furniture', icon: Sofa, path: '/category/furniture' },
  { name: 'Lighting', icon: Lamp, path: '/category/lighting' },
  { name: 'Wall Art & Decor', icon: Frame, path: '/category/wallArt' },
  { name: 'Rugs & Carpets', icon: Carpet, path: '/category/rugs' },
  { name: 'Curtains & Blinds', icon: Curtains, path: '/category/curtains' },
  { name: 'Tableware', icon: UtensilsCrossed, path: '/category/tableware' },
  { name: 'Bedding & Cushions', icon: BedDouble, path: '/category/bedding' },
  { name: 'Indoor Plants', icon: Flower2, path: '/category/plants' },
  { name: 'Storage', icon: Package, path: '/category/storage' },
  { name: 'Clocks', icon: Clock, path: '/category/clocks' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-green-700 text-white py-20">
        <div className="container mx-auto text-center px-4">
          <h1 className="text-4xl font-bold mb-4">
            Sustainable Home Decor for a Better Tomorrow
          </h1>
          <p className="text-xl mb-8">
            Shop eco-friendly products and earn rewards for sustainable choices
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="search"
              placeholder="Search for products..."
              className="w-full px-4 py-2 rounded-lg text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto py-16 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link
            to="/add-product"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Product
          </Link>
        </div>

        <RewardsTracker />
        <EnvironmentalImpact />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={category.path}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
            >
              <category.icon className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <span className="font-medium text-gray-800">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}