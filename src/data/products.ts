
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
  // New Arrivals
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
  {
    id: "3",
    name: "Elegant Evening Dress",
    description: "Sophisticated evening dress with flowing silhouette. Perfect for special occasions.",
    price: 129.99,
    discountPrice: 99.99,
    images: ["https://images.unsplash.com/photo-1566479179817-c0ad84ce1f6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "new-arrivals",
    rating: 4.8,
    likes: 156,
    stock: 25,
    slug: "elegant-evening-dress",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Emerald"]
  },
  
  // Trending
  {
    id: "4",
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
  {
    id: "5",
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
    id: "6",
    name: "Cozy Knit Sweater",
    description: "Ultra-soft knit sweater with ribbed details. Perfect for cool weather.",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "trending",
    rating: 4.6,
    likes: 143,
    stock: 60,
    slug: "cozy-knit-sweater",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Blush", "Sage", "Black"]
  },
  
  // Kids
  {
    id: "7",
    name: "Children's Dinosaur T-Shirt",
    description: "Fun dinosaur-themed t-shirt for kids. Made from soft, comfortable cotton.",
    price: 19.99,
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "kids",
    rating: 4.9,
    likes: 87,
    stock: 40,
    slug: "kids-dinosaur-tshirt",
    featured: true,
    sizes: ["2T", "3T", "4T", "5T", "XS", "S"],
    colors: ["Green", "Blue", "Purple", "Orange"]
  },
  {
    id: "8",
    name: "Kids Denim Overalls",
    description: "Classic denim overalls for children. Durable and stylish for everyday play.",
    price: 39.99,
    discountPrice: 29.99,
    images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "kids",
    rating: 4.7,
    likes: 92,
    stock: 55,
    slug: "kids-denim-overalls",
    featured: true,
    sizes: ["2T", "3T", "4T", "5T", "XS"],
    colors: ["Light Blue", "Dark Blue", "Black"]
  },
  
  // Adults
  {
    id: "9",
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
  {
    id: "10",
    name: "Premium Leather Jacket",
    description: "Genuine leather jacket with classic biker styling. Premium quality with attention to detail.",
    price: 199.99,
    discountPrice: 159.99,
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "adults",
    rating: 4.8,
    likes: 178,
    stock: 30,
    slug: "premium-leather-jacket",
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "Brown", "Tan"]
  },
  
  // Male
  {
    id: "11",
    name: "Men's Performance Polo",
    description: "Moisture-wicking polo shirt perfect for sports and casual wear.",
    price: 45.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "male",
    rating: 4.5,
    likes: 134,
    stock: 70,
    slug: "mens-performance-polo",
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Gray", "Black", "Red"]
  },
  {
    id: "12",
    name: "Men's Chino Pants",
    description: "Classic chino pants with modern tailoring. Versatile for work or weekend.",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "male",
    rating: 4.4,
    likes: 98,
    stock: 45,
    slug: "mens-chino-pants",
    featured: true,
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: ["Khaki", "Navy", "Black", "Olive", "Gray"]
  },
  
  // Female
  {
    id: "13",
    name: "Women's Silk Blouse",
    description: "Elegant silk blouse with delicate details. Perfect for professional or formal occasions.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1564257631407-1edf1cb2e1dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "female",
    rating: 4.7,
    likes: 167,
    stock: 35,
    slug: "womens-silk-blouse",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blush", "Navy", "Black", "Cream"]
  },
  {
    id: "14",
    name: "Women's Midi Skirt",
    description: "Flowing midi skirt with elegant drape. Comfortable and stylish for any occasion.",
    price: 49.99,
    discountPrice: 39.99,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "female",
    rating: 4.6,
    likes: 189,
    stock: 50,
    slug: "womens-midi-skirt",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Floral", "Gray"]
  },
  {
    id: "15",
    name: "Women's Cardigan",
    description: "Soft knit cardigan with button closure. Perfect for layering in any season.",
    price: 64.99,
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "clothes",
    subcategoryId: "female",
    rating: 4.5,
    likes: 123,
    stock: 40,
    slug: "womens-cardigan",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Black", "Camel", "Pink"]
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
