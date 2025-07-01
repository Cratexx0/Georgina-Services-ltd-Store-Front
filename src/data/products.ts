
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
  // Women's Clothing - Dresses
  {
    id: "1",
    name: "Elegant Evening Dress",
    description: "Sophisticated evening dress with flowing silhouette. Perfect for special occasions.",
    price: 129.99,
    discountPrice: 99.99,
    images: ["https://images.unsplash.com/photo-1566479179817-c0ad84ce1f6d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "womens-clothing",
    subcategoryId: "women-dresses",
    rating: 4.8,
    likes: 156,
    stock: 25,
    slug: "elegant-evening-dress",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Emerald"]
  },
  {
    id: "2",
    name: "Summer Floral Dress",
    description: "Light and breezy floral dress perfect for summer days.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "womens-clothing",
    subcategoryId: "women-dresses",
    rating: 4.6,
    likes: 89,
    stock: 40,
    slug: "summer-floral-dress",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "Yellow", "White"]
  },

  // Women's Clothing - Tops
  {
    id: "3",
    name: "Women's Silk Blouse",
    description: "Elegant silk blouse with delicate details. Perfect for professional or formal occasions.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1564257631407-1edf1cb2e1dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "womens-clothing",
    subcategoryId: "women-tops",
    rating: 4.7,
    likes: 167,
    stock: 35,
    slug: "womens-silk-blouse",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Blush", "Navy", "Black", "Cream"]
  },
  {
    id: "4",
    name: "Casual Cotton Top",
    description: "Comfortable cotton top for everyday wear.",
    price: 39.99,
    images: ["https://images.unsplash.com/photo-1581553680321-4fffae59fccd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "womens-clothing",
    subcategoryId: "women-tops",
    rating: 4.4,
    likes: 92,
    stock: 60,
    slug: "casual-cotton-top",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Gray", "Pink"]
  },

  // Women's Clothing - Bottoms
  {
    id: "5",
    name: "Women's Midi Skirt",
    description: "Flowing midi skirt with elegant drape. Comfortable and stylish for any occasion.",
    price: 49.99,
    discountPrice: 39.99,
    images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "womens-clothing",
    subcategoryId: "women-bottoms",
    rating: 4.6,
    likes: 189,
    stock: 50,
    slug: "womens-midi-skirt",
    featured: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Burgundy", "Floral", "Gray"]
  },
  {
    id: "6",
    name: "High-Waist Trousers",
    description: "Classic high-waist trousers with a modern fit.",
    price: 69.99,
    images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "womens-clothing",
    subcategoryId: "women-bottoms",
    rating: 4.5,
    likes: 134,
    stock: 45,
    slug: "high-waist-trousers",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Navy", "Gray", "Beige"]
  },

  // Men's Clothing - Shirts
  {
    id: "7",
    name: "Men's Performance Polo",
    description: "Moisture-wicking polo shirt perfect for sports and casual wear.",
    price: 45.99,
    images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "mens-clothing",
    subcategoryId: "men-shirts",
    rating: 4.5,
    likes: 134,
    stock: 70,
    slug: "mens-performance-polo",
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Gray", "Black", "Red"]
  },
  {
    id: "8",
    name: "Classic Dress Shirt",
    description: "Timeless dress shirt perfect for business or formal occasions.",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "mens-clothing",
    subcategoryId: "men-shirts",
    rating: 4.6,
    likes: 98,
    stock: 55,
    slug: "classic-dress-shirt",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Light Blue", "Pink", "Gray"]
  },

  // Men's Clothing - Pants
  {
    id: "9",
    name: "Men's Chino Pants",
    description: "Classic chino pants with modern tailoring. Versatile for work or weekend.",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "mens-clothing",
    subcategoryId: "men-pants",
    rating: 4.4,
    likes: 98,
    stock: 45,
    slug: "mens-chino-pants",
    featured: true,
    sizes: ["30", "32", "34", "36", "38", "40"],
    colors: ["Khaki", "Navy", "Black", "Olive", "Gray"]
  },
  {
    id: "10",
    name: "Casual Stretch Jeans",
    description: "Comfortable stretch denim jeans with a modern slim fit.",
    price: 69.99,
    images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "mens-clothing",
    subcategoryId: "men-pants",
    rating: 4.4,
    likes: 201,
    stock: 85,
    slug: "casual-stretch-jeans",
    featured: true,
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: ["Dark Blue", "Light Blue", "Black", "Gray"]
  },

  // Kids Clothing - Boys
  {
    id: "11",
    name: "Boys' Graphic T-Shirt",
    description: "Fun graphic t-shirt perfect for active boys.",
    price: 19.99,
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "kids-clothing",
    subcategoryId: "kids-boys",
    rating: 4.7,
    likes: 76,
    stock: 80,
    slug: "boys-graphic-tshirt",
    featured: true,
    sizes: ["2T", "3T", "4T", "5T", "XS", "S"],
    colors: ["Blue", "Red", "Green", "Black"]
  },
  {
    id: "12",
    name: "Boys' Cargo Shorts",
    description: "Durable cargo shorts perfect for play and adventure.",
    price: 29.99,
    images: ["https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "kids-clothing",
    subcategoryId: "kids-boys",
    rating: 4.5,
    likes: 54,
    stock: 65,
    slug: "boys-cargo-shorts",
    sizes: ["2T", "3T", "4T", "5T", "XS", "S"],
    colors: ["Khaki", "Navy", "Gray", "Olive"]
  },

  // Kids Clothing - Girls
  {
    id: "13",
    name: "Girls' Princess Dress",
    description: "Beautiful princess dress perfect for special occasions.",
    price: 39.99,
    images: ["https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "kids-clothing",
    subcategoryId: "kids-girls",
    rating: 4.8,
    likes: 123,
    stock: 40,
    slug: "girls-princess-dress",
    featured: true,
    sizes: ["2T", "3T", "4T", "5T", "XS", "S"],
    colors: ["Pink", "Purple", "Blue", "White"]
  },
  {
    id: "14",
    name: "Girls' Denim Jacket",
    description: "Stylish denim jacket perfect for layering.",
    price: 34.99,
    images: ["https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "kids-clothing",
    subcategoryId: "kids-girls",
    rating: 4.6,
    likes: 87,
    stock: 50,
    slug: "girls-denim-jacket",
    sizes: ["2T", "3T", "4T", "5T", "XS", "S"],
    colors: ["Light Blue", "Dark Blue", "Pink", "White"]
  },

  // Accessories - Bags
  {
    id: "15",
    name: "Leather Handbag",
    description: "Premium leather handbag with elegant design.",
    price: 89.99,
    discountPrice: 69.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "accessories",
    subcategoryId: "bags",
    rating: 4.7,
    likes: 145,
    stock: 30,
    slug: "leather-handbag",
    featured: true,
    colors: ["Black", "Brown", "Tan", "Navy"]
  },
  {
    id: "16",
    name: "Canvas Backpack",
    description: "Durable canvas backpack perfect for everyday use.",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1546938576-6e6a64f317cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "accessories",
    subcategoryId: "bags",
    rating: 4.5,
    likes: 98,
    stock: 75,
    slug: "canvas-backpack",
    colors: ["Black", "Gray", "Navy", "Olive"]
  },

  // Accessories - Shoes
  {
    id: "17",
    name: "Classic Sneakers",
    description: "Comfortable sneakers perfect for everyday wear.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "accessories",
    subcategoryId: "shoes",
    rating: 4.6,
    likes: 234,
    stock: 90,
    slug: "classic-sneakers",
    featured: true,
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["White", "Black", "Gray", "Navy"]
  },
  {
    id: "18",
    name: "Formal Dress Shoes",
    description: "Elegant leather dress shoes for formal occasions.",
    price: 129.99,
    images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60"],
    categoryId: "accessories",
    subcategoryId: "shoes",
    rating: 4.8,
    likes: 167,
    stock: 45,
    slug: "formal-dress-shoes",
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    colors: ["Black", "Brown", "Burgundy"]
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
