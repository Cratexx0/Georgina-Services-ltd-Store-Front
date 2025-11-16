
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
  description?: string;
}

// Fallback categories for when API is not available
export const fallbackCategories: Category[] = [
  {
    id: "clothes",
    name: "Clothes",
    description: "Discover our curated collection of premium clothing for every style and occasion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "clothes",
    subcategories: [
      { id: "women", name: "Women", slug: "women", parentId: "clothes", description: "Women's fashion and accessories" },
      { id: "men", name: "Men", slug: "men", parentId: "clothes", description: "Men's fashion and accessories" },
      { id: "kids", name: "Kids", slug: "kids", parentId: "clothes", description: "Children's clothing" },
    ]
  },
  {
    id: "foodstuffs",
    name: "Foodstuffs",
    description: "Premium African food ingredients and prepared mixes for authentic cooking",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "foodstuffs",
    subcategories: [
      { id: "pantry", name: "Pantry", slug: "pantry", parentId: "foodstuffs", description: "Essential pantry items" },
      { id: "prepared-mixes", name: "Prepared Mixes", slug: "prepared-mixes", parentId: "foodstuffs", description: "Ready-to-cook food mixes" },
      { id: "soup-base", name: "Soup Base", slug: "soup-base", parentId: "foodstuffs", description: "Traditional soup bases" },
    ]
  },
  {
    id: "services",
    name: "Services",
    description: "Professional cleaning services for your home and office",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "services",
    subcategories: [
      { id: "cleaning-services", name: "Cleaning Services", slug: "cleaning-services", parentId: "services", description: "Professional cleaning services" },
    ]
  },
];

// Export fallback as default for backward compatibility
export const categories = fallbackCategories;

export const getCategory = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getSubcategory = (categorySlug: string, subcategorySlug: string): SubCategory | undefined => {
  const category = getCategory(categorySlug);
  return category?.subcategories?.find(subcategory => subcategory.slug === subcategorySlug);
};
