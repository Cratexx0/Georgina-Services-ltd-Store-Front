import { clothingProducts } from "../lib/Clothingproducts";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  images: string[];
  categoryId: string;
  subcategoryId: string;
  rating: number;
  likes: number;
  stock: number;
  slug: string;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  sizes?: string[];
  colors?: string[];
}

export const products: Product[] = [
  ...clothingProducts,

 
];

// Helper functions
export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getProductsBySubcategory = (subcategoryId: string): Product[] => {
  return products.filter(product => product.subcategoryId === subcategoryId);
};

export const getProductById = (id: string): Product | undefined => {
  return products.find(product => product.id === id);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const getTrendingProducts = (): Product[] => {
  return products.filter(product => product.trending === true);
};

export const getNewArrivalProducts = (): Product[] => {
  return products.filter(product => product.newArrival === true);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured === true);
};

export const searchProducts = (query: string): Product[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery) ||
    product.slug.toLowerCase().includes(lowerQuery)
  );
};