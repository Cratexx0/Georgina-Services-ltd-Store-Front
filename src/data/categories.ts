
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

// Fallback categories for when API is not available
export const fallbackCategories: Category[] = [
  {
    id: "clothes",
    name: "Clothes",
    description: "Discover our curated collection of premium clothing for every style and occasion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "clothes",
    subcategories: [
      { id: "men-african-wear", name: "Men - African Wear", slug: "men-african-wear", parentId: "clothes" },
      { id: "men-trousers", name: "Men - Trousers", slug: "men-trousers", parentId: "clothes" },
      { id: "women-african-print", name: "Women - African Print", slug: "women-african-print", parentId: "clothes" },
      { id: "women-african-wear", name: "Women - African Wear", slug: "women-african-wear", parentId: "clothes" },
      { id: "women-ankara", name: "Women - Ankara", slug: "women-ankara", parentId: "clothes" },
      { id: "women-bonnet", name: "Women - Bonnet", slug: "women-bonnet", parentId: "clothes" },
      { id: "kids-african-wear", name: "Kids - African Wear", slug: "kids-african-wear", parentId: "clothes" },
    ]
  },
  {
    id: "foodstuffs",
    name: "Foodstuffs",
    description: "Premium African food ingredients and prepared mixes for authentic cooking",
    image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "foodstuffs",
    subcategories: [
      { id: "pantry-vegetable-oils", name: "Pantry - Vegetable Oils", slug: "pantry-vegetable-oils", parentId: "foodstuffs" },
      { id: "pantry-zomi", name: "Pantry - Zomi", slug: "pantry-zomi", parentId: "foodstuffs" },
      { id: "pantry-gari", name: "Pantry - Gari", slug: "pantry-gari", parentId: "foodstuffs" },
      { id: "pantry-spaghetti", name: "Pantry - Spaghetti", slug: "pantry-spaghetti", parentId: "foodstuffs" },
      { id: "pantry-tomatoes-paste", name: "Pantry - Tomatoes Paste", slug: "pantry-tomatoes-paste", parentId: "foodstuffs" },
      { id: "prepared-fufu", name: "Prepared Mixes - Fufu", slug: "prepared-fufu", parentId: "foodstuffs" },
      { id: "prepared-banku", name: "Prepared Mixes - Banku", slug: "prepared-banku", parentId: "foodstuffs" },
      { id: "prepared-tom-brown", name: "Prepared Mixes - Tom Brown", slug: "prepared-tom-brown", parentId: "foodstuffs" },
      { id: "prepared-konkonte", name: "Prepared Mixes - Konkonte", slug: "prepared-konkonte", parentId: "foodstuffs" },
      { id: "soup-palm-nut", name: "Soup Base - Palm Nut Soup", slug: "soup-palm-nut", parentId: "foodstuffs" },
    ]
  },
  {
    id: "services",
    name: "Services",
    description: "Professional cleaning services for your home and office",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
    slug: "services",
    subcategories: [
      { id: "cleaning-office", name: "Office Cleaning", slug: "office-cleaning", parentId: "services" },
      { id: "cleaning-kitchen", name: "Kitchen Cleaning", slug: "kitchen-cleaning", parentId: "services" },
      { id: "cleaning-bathroom", name: "Bathroom Cleaning", slug: "bathroom-cleaning", parentId: "services" },
      { id: "cleaning-dusting", name: "Dusting", slug: "dusting", parentId: "services" },
      { id: "cleaning-mopping", name: "Mopping", slug: "mopping", parentId: "services" },
      { id: "cleaning-vacuuming", name: "Vacuuming", slug: "vacuuming", parentId: "services" },
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
