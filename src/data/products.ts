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
  sizes?: string[];
  colors?: string[];
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
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Light Blue", "Beige", "Navy"]
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
    slug: "designer-denim-jacket",
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Dark Blue", "Light Blue", "Black", "Gray"]
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
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Gray", "Navy", "Red"]
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
    slug: "kids-dinosaur-pajama",
    featured: true,
    sizes: ["2T", "3T", "4T", "5T", "XS", "S"],
    colors: ["Green", "Blue", "Purple", "Orange"]
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
    slug: "classic-wool-blazer",
    featured: true,
    sizes: ["36", "38", "40", "42", "44", "46"],
    colors: ["Navy", "Charcoal", "Brown", "Black"]
  },
  
  // Food - Fresh Produce (no sizes/colors needed)
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
  
  // Add more featured products
  {
    id: "7",
    name: "Premium Leather Wallet",
    description: "Handcrafted genuine leather wallet with RFID protection and multiple card slots.",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "adults",
    rating: 4.7,
    likes: 94,
    stock: 40,
    slug: "premium-leather-wallet",
    featured: true,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan"]
  },
  
  {
    id: "8",
    name: "Organic Honey Collection",
    description: "Set of three artisanal honey varieties from local beekeepers.",
    price: 34.99,
    images: ["https://images.unsplash.com/photo-1587049352846-4a222e784d38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "food",
    subcategoryId: "fresh-produce",
    rating: 4.9,
    likes: 156,
    stock: 25,
    slug: "organic-honey-collection",
    featured: true
  },
  
  // Clothing - Male
  {
    id: "9",
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
    slug: "mens-performance-sneakers",
    featured: true,
    sizes: ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"],
    colors: ["Black", "White", "Gray", "Navy", "Red"]
  },
  
  // Clothing - Female
  {
    id: "10",
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
    featured: true,
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Tan", "Navy"]
  },
  
  {
    id: "11",
    name: "Casual Stretch Jeans",
    description: "Comfortable stretch denim jeans with a modern slim fit.",
    price: 69.99,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "trending",
    rating: 4.4,
    likes: 201,
    stock: 85,
    slug: "casual-stretch-jeans",
    featured: true,
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Dark Blue", "Light Blue", "Black", "Gray"]
  },
  
  {
    id: "12",
    name: "Artisan Coffee Beans",
    description: "Premium single-origin coffee beans roasted to perfection.",
    price: 18.99,
    images: ["https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "food",
    subcategoryId: "fresh-produce",
    rating: 4.6,
    likes: 178,
    stock: 60,
    slug: "artisan-coffee-beans",
    featured: true
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
