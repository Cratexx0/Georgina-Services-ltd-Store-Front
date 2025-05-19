
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
}

export const products: Product[] = [
  // Clothing - New Arrivals
  {
    id: "1",
    name: "Summer Linen Shirt",
    description: "Lightweight linen shirt perfect for summer days. Features a relaxed fit and breathable fabric.",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "new-arrivals",
    rating: 4.5,
    likes: 120,
    stock: 50,
    slug: "summer-linen-shirt",
    featured: true
  },
  {
    id: "2",
    name: "Designer Denim Jacket",
    description: "Premium denim jacket with modern cut and stylish wash. Perfect for layering in any season.",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "new-arrivals",
    rating: 4.7,
    likes: 98,
    stock: 35,
    slug: "designer-denim-jacket"
  },
  
  // Clothing - Trending
  {
    id: "3",
    name: "Vintage Graphic Tee",
    description: "Retro-inspired graphic t-shirt with soft cotton blend fabric for maximum comfort.",
    price: 29.99,
    images: ["https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "trending",
    rating: 4.3,
    likes: 210,
    stock: 100,
    slug: "vintage-graphic-tee",
    featured: true
  },
  
  // Clothing - Kids
  {
    id: "4",
    name: "Children's Dinosaur Pajama Set",
    description: "Adorable dinosaur-themed pajama set for kids. Made from soft, comfortable cotton.",
    price: 34.99,
    discountPrice: 29.99,
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "kids",
    rating: 4.9,
    likes: 87,
    stock: 40,
    slug: "kids-dinosaur-pajama"
  },
  
  // Clothing - Adults
  {
    id: "5",
    name: "Classic Wool Blazer",
    description: "Timeless wool blazer with a modern fit. Perfect for both business and casual occasions.",
    price: 129.99,
    images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "adults",
    rating: 4.6,
    likes: 65,
    stock: 25,
    slug: "classic-wool-blazer"
  },
  
  // Food - Fresh Produce
  {
    id: "6",
    name: "Organic Vegetable Box",
    description: "Weekly box of seasonal organic vegetables sourced from local farms.",
    price: 24.99,
    images: ["https://images.unsplash.com/photo-1557844352-761f2565b576?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "food",
    subcategoryId: "fresh-produce",
    rating: 4.8,
    likes: 132,
    stock: 30,
    slug: "organic-vegetable-box",
    featured: true
  },
  
  // Food - Dairy
  {
    id: "7",
    name: "Artisanal Cheese Selection",
    description: "Handpicked selection of premium artisanal cheeses from around the world.",
    price: 42.99,
    images: ["https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "food",
    subcategoryId: "dairy",
    rating: 4.7,
    likes: 91,
    stock: 15,
    slug: "artisanal-cheese-selection"
  },
  
  // Cleaning - Home Cleaning
  {
    id: "8",
    name: "Deep Home Cleaning Service",
    description: "Professional deep cleaning service for your entire home. Includes all rooms and bathrooms.",
    price: 149.99,
    images: ["https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "cleaning",
    subcategoryId: "home-cleaning",
    rating: 4.9,
    likes: 56,
    stock: 10,
    slug: "deep-home-cleaning",
    featured: true
  },
  
  // Cleaning - Supplies
  {
    id: "9",
    name: "Eco-Friendly Cleaning Kit",
    description: "Complete kit of environmentally friendly cleaning supplies for your home.",
    price: 39.99,
    images: ["https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "cleaning",
    subcategoryId: "supplies",
    rating: 4.5,
    likes: 78,
    stock: 45,
    slug: "eco-cleaning-kit"
  },
  
  // Clothing - Male
  {
    id: "10",
    name: "Men's Performance Sneakers",
    description: "High-performance athletic sneakers with superior comfort and support.",
    price: 79.99,
    discountPrice: 69.99,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "male",
    rating: 4.6,
    likes: 142,
    stock: 60,
    slug: "mens-performance-sneakers"
  },
  
  // Clothing - Female
  {
    id: "11",
    name: "Women's Leather Tote Bag",
    description: "Premium genuine leather tote bag with spacious interior and elegant design.",
    price: 119.99,
    images: ["https://images.unsplash.com/photo-1590739225300-f9f1b04dbce7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "female",
    rating: 4.8,
    likes: 107,
    stock: 20,
    slug: "womens-leather-tote",
    featured: true
  },
  
  // Add a few more products
  {
    id: "12",
    name: "Gourmet Coffee Beans",
    description: "Single-origin fair trade coffee beans, freshly roasted for exceptional flavor.",
    price: 18.99,
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "food",
    subcategoryId: "beverages",
    rating: 4.9,
    likes: 215,
    stock: 75,
    slug: "gourmet-coffee-beans"
  },
  {
    id: "13",
    name: "Professional Carpet Cleaning",
    description: "Deep carpet cleaning service using professional-grade equipment and eco-friendly solutions.",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1558317374-067fb5f30001?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "cleaning",
    subcategoryId: "home-cleaning",
    rating: 4.7,
    likes: 68,
    stock: 8,
    slug: "professional-carpet-cleaning"
  },
  {
    id: "14",
    name: "Artisan Sourdough Bread",
    description: "Freshly baked sourdough bread made with organic flour and traditional methods.",
    price: 7.99,
    images: ["https://images.unsplash.com/photo-1585478259715-1c721551b772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "food",
    subcategoryId: "bakery",
    rating: 4.8,
    likes: 126,
    stock: 40,
    slug: "artisan-sourdough"
  }
];

export const getFeaturedProducts = (): Product[] => {
  return products.filter(product => product.featured);
};

export const getProductsByCategory = (categoryId: string): Product[] => {
  return products.filter(product => product.categoryId === categoryId);
};

export const getProductsBySubcategory = (subcategoryId: string): Product[] => {
  return products.filter(product => product.subcategoryId === subcategoryId);
};

export const getProductBySlug = (slug: string): Product | undefined => {
  return products.find(product => product.slug === slug);
};

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase();
  return products.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};
