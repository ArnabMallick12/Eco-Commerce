import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sofa, Lamp, Frame, Car as Carpet, Mountain as Curtains, UtensilsCrossed, BedDouble, Flower2, Package, Clock, Plus, Search, Loader2, AlertCircle, WifiOff } from 'lucide-react';
import { RewardsTracker } from '../components/RewardsTracker';

import { ProductCard } from '../components/ProductCard';

const API_URL = "https://eco-commerce-2vxl.onrender.com";
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
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isServerConnected, setIsServerConnected] = useState(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Check server connection
  useEffect(() => {
    const checkServerConnection = async () => {
      try {
        const response = await fetch(`${API_URL}/api/status`);
        if (!response.ok) throw new Error('Server not responding');
        const data = await response.json();
        setIsServerConnected(data.mongoConnection === 'connected');
        setSearchError(null);
      } catch (error) {
        console.error('Server connection error:', error);
        setIsServerConnected(false);
        setSearchError('Cannot connect to server. Please try again later.');
      }
    };

    // Check initially and every 30 seconds
    checkServerConnection();
    const interval = setInterval(checkServerConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!debouncedQuery || !isServerConnected) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      setSearchError(null);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${API_URL}/api/products/search?query=${encodeURIComponent(debouncedQuery)}`,
          { signal: controller.signal }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Search failed');
        }

        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
        if (error.name === 'AbortError') {
          setSearchError('Search request timed out. Please try again.');
        } else {
          setSearchError(error.message || 'Failed to search products');
        }
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    fetchSearchResults();
  }, [debouncedQuery, isServerConnected]);

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
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                type="search"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full px-4 py-3 pl-12 rounded-lg text-gray-900 shadow-lg ${
                  !isServerConnected ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                disabled={!isServerConnected}
              />
              {isSearching ? (
                <Loader2 className="h-6 w-6 absolute left-3 top-3 text-gray-400 animate-spin" />
              ) : (
                <Search className="h-6 w-6 absolute left-3 top-3 text-gray-400" />
              )}
            </div>
            
            {!isServerConnected && (
              <div className="absolute w-full mt-2 bg-red-50 rounded-lg shadow-xl p-4">
                <div className="flex items-center justify-center gap-2 text-red-600">
                  <WifiOff className="h-5 w-5" />
                  <span>Server connection lost. Please try again later.</span>
                </div>
              </div>
            )}
            
            {isServerConnected && searchQuery && (
              <div className="absolute w-full mt-2 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {searchError ? (
                  <div className="p-4 text-center text-red-600 flex items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span>{searchError}</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {searchResults.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                ) : !isSearching && (
                  <div className="p-4 text-center text-gray-600">
                    No products found matching your search.
                  </div>
                )}
              </div>
            )}
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