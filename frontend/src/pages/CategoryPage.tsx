import React from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { Product } from '../types';

// Sample products data with real Unsplash images
const products: Record<string, Product[]> = {
  furniture: [
    {
      id: 'f1',
      name: 'Bamboo Coffee Table',
      description: 'Sustainable bamboo coffee table with natural finish',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1532372320978-9b4d0a87e993',
      category: 'furniture',
      carbonFootprint: 25,
      rewardPoints: 150
    },
    {
      id: 'f2',
      name: 'Reclaimed Wood Dining Table',
      description: 'Dining table made from reclaimed oak',
      price: 899.99,
      imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7',
      category: 'furniture',
      carbonFootprint: 45,
      rewardPoints: 200
    },
    {
      id: 'f3',
      name: 'Eco-Friendly Sofa',
      description: 'Three-seater sofa made with recycled materials',
      price: 1299.99,
      imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc',
      category: 'furniture',
      carbonFootprint: 60,
      rewardPoints: 300
    }
  ],
  lighting: [
    {
      id: 'l1',
      name: 'Solar LED Floor Lamp',
      description: 'Energy-efficient LED floor lamp with solar charging',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
      category: 'lighting',
      carbonFootprint: 15,
      rewardPoints: 100
    },
    {
      id: 'l2',
      name: 'Bamboo Pendant Light',
      description: 'Natural bamboo pendant light with LED bulb',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15',
      category: 'lighting',
      carbonFootprint: 10,
      rewardPoints: 75
    }
  ],
  wallArt: [
    {
      id: 'w1',
      name: 'Recycled Metal Wall Art',
      description: 'Abstract wall art made from recycled metal',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1526566662850-6247a4e10c76',
      category: 'wallArt',
      carbonFootprint: 20,
      rewardPoints: 100
    }
  ],
  rugs: [
    {
      id: 'r1',
      name: 'Organic Cotton Rug',
      description: 'Hand-woven rug made from organic cotton',
      price: 399.99,
      imageUrl: 'https://images.unsplash.com/photo-1600166898405-da9535204843',
      category: 'rugs',
      carbonFootprint: 30,
      rewardPoints: 150
    }
  ],
  curtains: [
    {
      id: 'c1',
      name: 'Hemp Curtain Set',
      description: 'Natural hemp curtains with thermal lining',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff',
      category: 'curtains',
      carbonFootprint: 25,
      rewardPoints: 100
    }
  ],
  tableware: [
    {
      id: 't1',
      name: 'Bamboo Dining Set',
      description: 'Complete dining set made from sustainable bamboo',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1617789160753-97fe86946851',
      category: 'tableware',
      carbonFootprint: 15,
      rewardPoints: 75
    }
  ],
  bedding: [
    {
      id: 'b1',
      name: 'Organic Cotton Bedding Set',
      description: 'Complete bedding set made from organic cotton',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
      category: 'bedding',
      carbonFootprint: 35,
      rewardPoints: 150
    }
  ],
  plants: [
    {
      id: 'p1',
      name: 'Air Purifying Plant Set',
      description: 'Set of 3 air-purifying indoor plants',
      price: 89.99,
      imageUrl: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411',
      category: 'plants',
      carbonFootprint: 5,
      rewardPoints: 50
    }
  ],
  storage: [
    {
      id: 's1',
      name: 'Bamboo Storage Boxes',
      description: 'Set of 3 stackable bamboo storage boxes',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1594626932480-8c00d8b6a3c6',
      category: 'storage',
      carbonFootprint: 20,
      rewardPoints: 75
    }
  ],
  clocks: [
    {
      id: 'cl1',
      name: 'Recycled Wood Wall Clock',
      description: 'Wall clock made from recycled wood',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1525182008055-f88b95ff7980',
      category: 'clocks',
      carbonFootprint: 15,
      rewardPoints: 50
    }
  ]
};

const categoryTitles: Record<string, string> = {
  furniture: 'Sustainable Furniture',
  lighting: 'Energy-Efficient Lighting',
  wallArt: 'Wall Art & Decor',
  rugs: 'Eco-Friendly Rugs & Carpets',
  curtains: 'Sustainable Curtains & Blinds',
  tableware: 'Eco-Conscious Tableware',
  bedding: 'Organic Bedding & Cushions',
  plants: 'Indoor Plants & Planters',
  storage: 'Sustainable Storage Solutions',
  clocks: 'Eco-Friendly Clocks'
};

export const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const categoryProducts = category ? products[category] : [];
  const title = category ? categoryTitles[category] : '';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="mt-2 text-gray-600">
          Shop our collection of sustainable {category} with low carbon footprint
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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