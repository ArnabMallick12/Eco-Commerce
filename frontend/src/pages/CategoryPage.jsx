import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';

// Extended products list with unique dummy data and real Unsplash images
const products = {
  furniture: [
    { id: 'f1', name: 'Recycled Wood Table', description: 'Made from 100% reclaimed wood.', price: 299, imageUrl: 'https://images.unsplash.com/photo-1532372320978-9b4d0a87e993', category: 'furniture', carbonFootprint: 30, rewardPoints: 150 },
    { id: 'f2', name: 'Bamboo Sofa', description: 'Comfortable and eco-friendly.', price: 499, imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc', category: 'furniture', carbonFootprint: 40, rewardPoints: 200 },
    { id: 'f3', name: 'Minimalist Wooden Chair', description: 'Sleek design with sustainable materials.', price: 199, imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7', category: 'furniture', carbonFootprint: 20, rewardPoints: 100 },
    { id: 'f4', name: 'Eco-Friendly Bookshelf', description: 'Perfect for organizing books with style.', price: 350, imageUrl: 'https://images.unsplash.com/photo-1588200618450-3a18f1f7932e', category: 'furniture', carbonFootprint: 35, rewardPoints: 180 },
    { id: 'f5', name: 'Organic Cotton Bean Bag', description: 'Super soft and made with organic cotton.', price: 150, imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c', category: 'furniture', carbonFootprint: 15, rewardPoints: 80 }
  ],
  lighting: [
    { id: 'l1', name: 'Solar-Powered Lamp', description: 'Charges in sunlight and lasts all night.', price: 99, imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c', category: 'lighting', carbonFootprint: 10, rewardPoints: 50 },
    { id: 'l2', name: 'LED Bamboo Pendant', description: 'Aesthetic and energy-saving.', price: 129, imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15', category: 'lighting', carbonFootprint: 12, rewardPoints: 60 }
  ],
  wallArt: [
    { id: 'w1', name: 'Hand-Painted Canvas', description: 'Sustainable materials with vibrant colors.', price: 249, imageUrl: 'https://images.unsplash.com/photo-1526566662850-6247a4e10c76', category: 'wallArt', carbonFootprint: 20, rewardPoints: 100 }
  ],
  rugs: [
    { id: 'r1', name: 'Organic Wool Rug', description: 'Soft and eco-friendly.', price: 399, imageUrl: 'https://images.unsplash.com/photo-1600166898405-da9535204843', category: 'rugs', carbonFootprint: 30, rewardPoints: 120 }
  ],
  curtains: [
    { id: 'c1', name: 'Linen Blackout Curtains', description: 'Blocks light while staying eco-friendly.', price: 199, imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff', category: 'curtains', carbonFootprint: 25, rewardPoints: 90 }
  ],
  tableware: [
    { id: 't1', name: 'Bamboo Dinner Set', description: 'Durable and biodegradable.', price: 89, imageUrl: 'https://images.unsplash.com/photo-1617789160753-97fe86946851', category: 'tableware', carbonFootprint: 10, rewardPoints: 50 }
  ],
  bedding: [
    { id: 'b1', name: 'Organic Cotton Duvet', description: 'Super soft and breathable.', price: 299, imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af', category: 'bedding', carbonFootprint: 35, rewardPoints: 130 }
  ],
  plants: [
    { id: 'p1', name: 'Aloe Vera Plant', description: 'Great for air purification.', price: 29, imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411', category: 'plants', carbonFootprint: 5, rewardPoints: 40 }
  ],
  storage: [
    { id: 's1', name: 'Sustainable Storage Box', description: 'Made from recycled materials.', price: 79, imageUrl: 'https://images.unsplash.com/photo-1594626932480-8c00d8b6a3c6', category: 'storage', carbonFootprint: 15, rewardPoints: 60 }
  ],
  clocks: [
    { id: 'cl1', name: 'Handcrafted Wooden Clock', description: 'Eco-friendly and stylish.', price: 149, imageUrl: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980', category: 'clocks', carbonFootprint: 20, rewardPoints: 70 }
  ]
};

export default function CategoryPage (){
  const { category } = useParams();
  const categoryProducts = category ? products[category] || [] : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        {category ? category.charAt(0).toUpperCase() + category.slice(1) : ''} Collection
      </h1>
      <p className="text-gray-600 mb-8">
        Discover our eco-friendly {category} collection, designed with sustainability in mind.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {categoryProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found in this category.</p>
        </div>
      )}
    </div>
  );
};

// export default CategoryPage;