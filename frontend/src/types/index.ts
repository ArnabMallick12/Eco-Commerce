export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: Category;
  carbonFootprint: number;
  rewardPoints: number;
}

export type Category =
  | 'furniture'
  | 'lighting'
  | 'wallArt'
  | 'rugs'
  | 'curtains'
  | 'tableware'
  | 'bedding'
  | 'plants'
  | 'storage'
  | 'clocks';

export interface User {
  id: string;
  email: string;
  name: string;
  rewardPoints: number;
}