
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
}

export const categories: Category[] = [
  {
    id: "womens-clothing",
    name: "Women's Fashion",
    description: "Discover elegant and trendy clothing for women",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "womens-clothing",
    subcategories: [
      { id: "women-dresses", name: "Dresses", slug: "dresses", parentId: "womens-clothing" },
      { id: "women-tops", name: "Tops & Blouses", slug: "tops", parentId: "womens-clothing" },
      { id: "women-bottoms", name: "Pants & Skirts", slug: "bottoms", parentId: "womens-clothing" },
      { id: "women-outerwear", name: "Jackets & Coats", slug: "outerwear", parentId: "womens-clothing" },
    ]
  },
  {
    id: "mens-clothing",
    name: "Men's Fashion",
    description: "Sharp and stylish clothing for the modern man",
    image: "https://images.unsplash.com/photo-1516826957135-700dedea698c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "mens-clothing",
    subcategories: [
      { id: "men-shirts", name: "Shirts", slug: "shirts", parentId: "mens-clothing" },
      { id: "men-pants", name: "Pants", slug: "pants", parentId: "mens-clothing" },
      { id: "men-suits", name: "Suits & Blazers", slug: "suits", parentId: "mens-clothing" },
      { id: "men-casual", name: "Casual Wear", slug: "casual", parentId: "mens-clothing" },
    ]
  },
  {
    id: "kids-clothing",
    name: "Kids Fashion",
    description: "Fun and comfortable clothing for children",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "kids-clothing",
    subcategories: [
      { id: "kids-boys", name: "Boys", slug: "boys", parentId: "kids-clothing" },
      { id: "kids-girls", name: "Girls", slug: "girls", parentId: "kids-clothing" },
      { id: "kids-baby", name: "Baby", slug: "baby", parentId: "kids-clothing" },
      { id: "kids-teens", name: "Teens", slug: "teens", parentId: "kids-clothing" },
    ]
  },
  {
    id: "accessories",
    name: "Accessories",
    description: "Complete your look with stylish accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "accessories",
    subcategories: [
      { id: "bags", name: "Bags & Purses", slug: "bags", parentId: "accessories" },
      { id: "jewelry", name: "Jewelry", slug: "jewelry", parentId: "accessories" },
      { id: "shoes", name: "Shoes", slug: "shoes", parentId: "accessories" },
      { id: "watches", name: "Watches", slug: "watches", parentId: "accessories" },
    ]
  },
  {
    id: "food-stuffs",
    name: "Food & Spices",
    description: "Premium spices and food ingredients for your kitchen",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "food-stuffs",
    subcategories: [
      { id: "spices", name: "Spices", slug: "spices", parentId: "food-stuffs" },
      { id: "herbs", name: "Herbs", slug: "herbs", parentId: "food-stuffs" },
      { id: "grains", name: "Grains & Cereals", slug: "grains", parentId: "food-stuffs" },
      { id: "oils", name: "Oils & Vinegars", slug: "oils", parentId: "food-stuffs" },
    ]
  },
  {
    id: "cleaning-services",
    name: "Cleaning Services",
    description: "Professional cleaning services for your home and office",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "cleaning-services",
    subcategories: [
      { id: "home-cleaning", name: "Home Cleaning", slug: "home-cleaning", parentId: "cleaning-services" },
      { id: "office-cleaning", name: "Office Cleaning", slug: "office-cleaning", parentId: "cleaning-services" },
      { id: "deep-cleaning", name: "Deep Cleaning", slug: "deep-cleaning", parentId: "cleaning-services" },
      { id: "carpet-cleaning", name: "Carpet Cleaning", slug: "carpet-cleaning", parentId: "cleaning-services" },
    ]
  }
];

export const getCategory = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getSubcategory = (categorySlug: string, subcategorySlug: string): SubCategory | undefined => {
  const category = getCategory(categorySlug);
  return category?.subcategories?.find(subcategory => subcategory.slug === subcategorySlug);
};
