
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
    id: "clothes",
    name: "Clothing",
    description: "Browse our latest clothing collection",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    slug: "clothing",
    subcategories: [
      { id: "new-arrivals", name: "New Arrivals", slug: "new-arrivals", parentId: "clothes" },
      { id: "trending", name: "Trending", slug: "trending", parentId: "clothes" },
      { id: "kids", name: "Kids", slug: "kids", parentId: "clothes" },
      { id: "adults", name: "Adults", slug: "adults", parentId: "clothes" },
      { id: "male", name: "Male", slug: "male", parentId: "clothes" },
      { id: "female", name: "Female", slug: "female", parentId: "clothes" },
    ]
  },
  {
    id: "food",
    name: "Food",
    description: "Delicious food items for your pantry",
    image: "https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    slug: "food",
    subcategories: [
      { id: "fresh-produce", name: "Fresh Produce", slug: "fresh-produce", parentId: "food" },
      { id: "dairy", name: "Dairy & Eggs", slug: "dairy", parentId: "food" },
      { id: "bakery", name: "Bakery", slug: "bakery", parentId: "food" },
      { id: "snacks", name: "Snacks", slug: "snacks", parentId: "food" },
      { id: "beverages", name: "Beverages", slug: "beverages", parentId: "food" },
    ]
  },
  {
    id: "cleaning",
    name: "Cleaning",
    description: "Professional cleaning services and supplies",
    image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60",
    slug: "cleaning",
    subcategories: [
      { id: "home-cleaning", name: "Home Cleaning", slug: "home-cleaning", parentId: "cleaning" },
      { id: "laundry", name: "Laundry Services", slug: "laundry", parentId: "cleaning" },
      { id: "supplies", name: "Cleaning Supplies", slug: "supplies", parentId: "cleaning" },
      { id: "commercial", name: "Commercial Cleaning", slug: "commercial", parentId: "cleaning" },
    ]
  },
];

export const getCategory = (slug: string): Category | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getSubcategory = (categorySlug: string, subcategorySlug: string): SubCategory | undefined => {
  const category = getCategory(categorySlug);
  return category?.subcategories?.find(subcategory => subcategory.slug === subcategorySlug);
};
