
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
  // Women's Clothes - African Print
  {
    id: "w1",
    name: "African Print Maxi Dress",
    description: "Beautiful African print maxi dress with vibrant colors and traditional patterns.",
    price: 89.99,
    discountPrice: 69.99,
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.8,
    likes: 145,
    stock: 25,
    slug: "african-print-maxi-dress",
    featured: true,
    trending: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi"]
  },
  {
    id: "w2",
    name: "African Print Blouse",
    description: "Stylish African print blouse perfect for casual and formal occasions.",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.7,
    likes: 98,
    stock: 35,
    slug: "african-print-blouse",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi", "Red", "Blue"]
  },
  // Women's Clothes - African Wear
  {
    id: "w3",
    name: "Traditional African Wear Set",
    description: "Authentic African wear set with matching top and wrapper for special occasions.",
    price: 129.99,
    images: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.9,
    likes: 187,
    stock: 18,
    slug: "traditional-african-wear-set",
    featured: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Gold", "Royal Blue", "Purple"]
  },
  {
    id: "w4",
    name: "African Wear Kaftan",
    description: "Elegant African kaftan with intricate embroidery.",
    price: 95.99,
    images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.6,
    likes: 112,
    stock: 22,
    slug: "african-wear-kaftan",
    newArrival: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["White", "Cream", "Black"]
  },
  // Women's Clothes - Ankara
  {
    id: "w5",
    name: "Ankara Maxi Dress",
    description: "Stunning Ankara maxi dress with bold patterns.",
    price: 85.99,
    images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.8,
    likes: 156,
    stock: 28,
    slug: "ankara-maxi-dress",
    trending: true,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi"]
  },
  {
    id: "w6",
    name: "Ankara Pencil Skirt",
    description: "Elegant Ankara pencil skirt for office or evening wear.",
    price: 45.99,
    images: ["https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.5,
    likes: 89,
    stock: 40,
    slug: "ankara-pencil-skirt",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Multi", "Red", "Green"]
  },
  // Women's Clothes - Bonnet
  {
    id: "w7",
    name: "African Print Satin Bonnet",
    description: "Stylish satin bonnet with African print design for hair protection.",
    price: 15.99,
    images: ["https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.7,
    likes: 234,
    stock: 100,
    slug: "african-print-satin-bonnet",
    featured: true,
    colors: ["Multi", "Blue", "Pink", "Green", "Purple"]
  },
  {
    id: "w8",
    name: "Ankara Bonnet Set",
    description: "Set of 3 Ankara bonnets in different designs.",
    price: 35.99,
    discountPrice: 29.99,
    images: ["https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "women",
    rating: 4.6,
    likes: 178,
    stock: 75,
    slug: "ankara-bonnet-set",
    newArrival: true,
    colors: ["Mixed Designs"]
  },

  // Men's Clothes - African Wear
  {
    id: "m1",
    name: "Men's African Wear Dashiki",
    description: "Traditional African dashiki shirt with intricate embroidery.",
    price: 79.99,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "men",
    rating: 4.7,
    likes: 112,
    stock: 30,
    slug: "mens-african-wear-dashiki",
    featured: true,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Black", "Blue", "Gold"]
  },
  {
    id: "m2",
    name: "African Senator Suit",
    description: "Elegant African senator suit for formal occasions.",
    price: 149.99,
    discountPrice: 129.99,
    images: ["https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "men",
    rating: 4.9,
    likes: 201,
    stock: 15,
    slug: "african-senator-suit",
    trending: true,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Navy", "Burgundy"]
  },
  // Men's Clothes - Trousers
  {
    id: "m3",
    name: "Men's African Print Trousers",
    description: "Comfortable trousers with African print design.",
    price: 69.99,
    discountPrice: 54.99,
    images: ["https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "men",
    rating: 4.5,
    likes: 89,
    stock: 35,
    slug: "mens-african-print-trousers",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Multi", "Brown", "Navy"]
  },
  {
    id: "m4",
    name: "Classic Men's Dress Trousers",
    description: "Elegant formal trousers for professional occasions.",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "men",
    rating: 4.6,
    likes: 124,
    stock: 50,
    slug: "classic-mens-dress-trousers",
    featured: true,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "Navy", "Gray", "Khaki"]
  },

  // Kids Clothes - African Wear
  {
    id: "k1",
    name: "Kids African Wear Complete Outfit",
    description: "Adorable African wear outfit for children with matching accessories.",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "kids",
    rating: 4.8,
    likes: 156,
    stock: 40,
    slug: "kids-african-wear-complete-outfit",
    featured: true,
    newArrival: true,
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: ["Multi", "Blue", "Pink", "Yellow"]
  },
  {
    id: "k2",
    name: "Children's Traditional Dashiki Set",
    description: "Beautiful traditional dashiki set for boys and girls.",
    price: 45.99,
    images: ["https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "kids",
    rating: 4.7,
    likes: 98,
    stock: 35,
    slug: "childrens-traditional-dashiki-set",
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: ["Red", "Gold", "Green", "Purple"]
  },
  {
    id: "k3",
    name: "Kids Ankara Dress",
    description: "Cute Ankara dress for girls with vibrant patterns.",
    price: 39.99,
    images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80"],
    categoryId: "clothes",
    subcategoryId: "kids",
    rating: 4.6,
    likes: 123,
    stock: 45,
    slug: "kids-ankara-dress",
    trending: true,
    sizes: ["2Y", "4Y", "6Y", "8Y", "10Y"],
    colors: ["Multi", "Pink", "Blue"]
  },

  // Pantry Items - Vegetable Oils
  {
    id: "p1",
    name: "Premium Vegetable Oil 5L",
    description: "High-quality vegetable oil for cooking and frying.",
    price: 24.99,
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.5,
    likes: 167,
    stock: 100,
    slug: "premium-vegetable-oil-5l",
    featured: true
  },
  {
    id: "p2",
    name: "Pure Vegetable Oil 2L",
    description: "Pure vegetable oil ideal for all cooking needs.",
    price: 12.99,
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.6,
    likes: 134,
    stock: 150,
    slug: "pure-vegetable-oil-2l"
  },
  // Pantry Items - Zomi
  {
    id: "p3",
    name: "Organic Zomi (Millet) 1kg",
    description: "Nutritious organic millet grain perfect for traditional dishes.",
    price: 8.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.7,
    likes: 89,
    stock: 75,
    slug: "organic-zomi-millet-1kg",
    newArrival: true
  },
  {
    id: "p4",
    name: "Premium Zomi 2kg",
    description: "Premium quality millet for healthy meals.",
    price: 15.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.6,
    likes: 67,
    stock: 60,
    slug: "premium-zomi-2kg"
  },
  // Pantry Items - Gari
  {
    id: "p5",
    name: "White Gari 2kg",
    description: "Premium quality white gari for making eba and other dishes.",
    price: 12.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.8,
    likes: 234,
    stock: 120,
    slug: "white-gari-2kg",
    featured: true,
    trending: true
  },
  {
    id: "p6",
    name: "Yellow Gari 1kg",
    description: "Traditional yellow gari with authentic taste.",
    price: 7.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.7,
    likes: 178,
    stock: 140,
    slug: "yellow-gari-1kg"
  },
  // Pantry Items - Spaghetti
  {
    id: "p7",
    name: "Italian Spaghetti 500g",
    description: "Premium pasta for authentic Italian dishes.",
    price: 4.99,
    images: ["https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.5,
    likes: 145,
    stock: 200,
    slug: "italian-spaghetti-500g"
  },
  {
    id: "p8",
    name: "Whole Wheat Spaghetti 500g",
    description: "Healthy whole wheat spaghetti for nutritious meals.",
    price: 6.99,
    images: ["https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.4,
    likes: 98,
    stock: 180,
    slug: "whole-wheat-spaghetti-500g",
    newArrival: true
  },
  // Pantry Items - Tomato Paste
  {
    id: "p9",
    name: "Tomato Paste 400g",
    description: "Rich tomato paste for soups and stews.",
    price: 3.99,
    images: ["https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.6,
    likes: 167,
    stock: 150,
    slug: "tomato-paste-400g"
  },
  {
    id: "p10",
    name: "Organic Tomato Paste 800g",
    description: "Premium organic tomato paste with no additives.",
    price: 7.99,
    images: ["https://images.unsplash.com/photo-1546548970-71785318a17b?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "pantry",
    rating: 4.7,
    likes: 189,
    stock: 100,
    slug: "organic-tomato-paste-800g",
    featured: true
  },

  // Prepared Mixes - Fufu
  {
    id: "pm1",
    name: "Instant Fufu Mix 1kg",
    description: "Easy-to-prepare fufu mix for authentic African meals.",
    price: 9.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.8,
    likes: 201,
    stock: 90,
    slug: "instant-fufu-mix-1kg",
    featured: true,
    trending: true
  },
  {
    id: "pm2",
    name: "Premium Fufu Flour 2kg",
    description: "High-quality fufu flour for traditional preparation.",
    price: 17.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.7,
    likes: 156,
    stock: 75,
    slug: "premium-fufu-flour-2kg"
  },
  // Prepared Mixes - Banku
  {
    id: "pm3",
    name: "Banku Powder 1kg",
    description: "Traditional banku powder for quick meal preparation.",
    price: 8.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.6,
    likes: 123,
    stock: 85,
    slug: "banku-powder-1kg",
    newArrival: true
  },
  {
    id: "pm4",
    name: "Instant Banku Mix 500g",
    description: "Quick and easy banku mix for authentic taste.",
    price: 5.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.5,
    likes: 98,
    stock: 100,
    slug: "instant-banku-mix-500g"
  },
  // Prepared Mixes - Tom Brown
  {
    id: "pm5",
    name: "Tom Brown Mix 1kg",
    description: "Nutritious tom brown mix for a healthy breakfast.",
    price: 11.99,
    images: ["https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.8,
    likes: 178,
    stock: 110,
    slug: "tom-brown-mix-1kg",
    featured: true
  },
  {
    id: "pm6",
    name: "Organic Tom Brown 500g",
    description: "Organic tom brown powder for nutritious meals.",
    price: 7.99,
    images: ["https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.7,
    likes: 145,
    stock: 95,
    slug: "organic-tom-brown-500g"
  },
  // Prepared Mixes - Konkonte
  {
    id: "pm7",
    name: "Konkonte Powder 1kg",
    description: "Traditional konkonte powder from cassava.",
    price: 8.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.6,
    likes: 112,
    stock: 95,
    slug: "konkonte-powder-1kg"
  },
  {
    id: "pm8",
    name: "Premium Konkonte 2kg",
    description: "Premium quality konkonte for authentic meals.",
    price: 15.99,
    images: ["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "prepared-mixes",
    rating: 4.7,
    likes: 89,
    stock: 70,
    slug: "premium-konkonte-2kg",
    newArrival: true
  },

  // Soup Base - Palm Nut Soup
  {
    id: "sb1",
    name: "Palm Nut Soup Base 500g",
    description: "Rich palm nut soup base for authentic African soups.",
    price: 13.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "soup-base",
    rating: 4.9,
    likes: 234,
    stock: 70,
    slug: "palm-nut-soup-base-500g",
    featured: true,
    trending: true
  },
  {
    id: "sb2",
    name: "Organic Palm Nut Concentrate 1L",
    description: "Premium organic palm nut concentrate for rich soups.",
    price: 19.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "soup-base",
    rating: 4.8,
    likes: 201,
    stock: 50,
    slug: "organic-palm-nut-concentrate-1l",
    newArrival: true
  },
  // Soup Base - Okro Stew
  {
    id: "sb3",
    name: "Okro Stew Base 400g",
    description: "Traditional okro stew base ready to cook.",
    price: 10.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "soup-base",
    rating: 4.7,
    likes: 178,
    stock: 80,
    slug: "okro-stew-base-400g"
  },
  {
    id: "sb4",
    name: "Fresh Okro Stew Mix 800g",
    description: "Fresh okro stew mix with vegetables.",
    price: 15.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "soup-base",
    rating: 4.6,
    likes: 156,
    stock: 65,
    slug: "fresh-okro-stew-mix-800g",
    featured: true
  },
  // Soup Base - Groundnut Soup
  {
    id: "sb5",
    name: "Groundnut Soup Base 500g",
    description: "Creamy groundnut soup base with authentic flavor.",
    price: 12.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "soup-base",
    rating: 4.8,
    likes: 198,
    stock: 75,
    slug: "groundnut-soup-base-500g",
    trending: true
  },
  {
    id: "sb6",
    name: "Premium Groundnut Paste 1kg",
    description: "Rich groundnut paste for traditional soups and stews.",
    price: 18.99,
    images: ["https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&q=80"],
    categoryId: "foodstuffs",
    subcategoryId: "soup-base",
    rating: 4.9,
    likes: 212,
    stock: 60,
    slug: "premium-groundnut-paste-1kg",
    featured: true
  },
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
