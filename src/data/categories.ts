
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
    image: "https://images.unsplash.com/photo-1601653233006-5c9fd30eab12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    slug: "clothes",
    subcategories: [
      { id: "women", name: "Women", slug: "women", parentId: "clothes", description: "Women's fashion and accessories" },
      { id: "men", name: "Men", slug: "men", parentId: "clothes", description: "Men's fashion and accessories" },
      { id: "kids", name: "Kids", slug: "kids", parentId: "clothes", description: "Children's clothing" },
    ]
  }
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
