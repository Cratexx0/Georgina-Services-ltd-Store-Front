import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, ShoppingBag, Utensils, Wrench } from 'lucide-react';

// Default images for each category
const DEFAULT_CATEGORY_IMAGES = {
  'Clothes': 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
  'Foodstuffs': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
  'Food & Spices': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=600&fit=crop',
  'Services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
  'Cleaning Services': 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&h=600&fit=crop',
  'default': 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=600&fit=crop'
};

// Icons for categories
const CATEGORY_ICONS = {
  'Clothes': ShoppingBag,
  'Foodstuffs': Utensils,
  'Food & Spices': Utensils,
  'Services': Wrench,
  'Cleaning Services': Wrench,
};

const CategoryTabs: React.FC = () => {
  const { categories, loading } = useCategories();

  // Function to get category image
  const getCategoryImage = (category: any) => {
    if (category.image) {
      return category.image;
    }

    // Check for exact match in default images
    if (DEFAULT_CATEGORY_IMAGES[category.name]) {
      return DEFAULT_CATEGORY_IMAGES[category.name];
    }

    // Fallback to Unsplash dynamic image based on category name
    return `https://source.unsplash.com/800x600/?${encodeURIComponent(category.name.toLowerCase())},shopping`;
  };

  // Function to handle image load error
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>, categoryName: string) => {
    // Try the default category image first
    if (DEFAULT_CATEGORY_IMAGES[categoryName]) {
      e.currentTarget.src = DEFAULT_CATEGORY_IMAGES[categoryName];
    } else {
      // Ultimate fallback to default image
      e.currentTarget.src = DEFAULT_CATEGORY_IMAGES.default;
    }

    // Prevent infinite loop if even fallback fails
    e.currentTarget.onerror = null;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600">
            Discover our curated collection of premium products and services
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="h-64 bg-gray-200 animate-pulse" />
              <CardContent className="p-6">
                <div className="h-6 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
        <p className="text-gray-600">
          Discover our curated collection of premium products and services
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.slice(0, 3).map((category) => {
          const Icon = CATEGORY_ICONS[category.name] || ShoppingBag;

          return (
            <Card
              key={category.id}
              className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="group"

              >
                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={getCategoryImage(category)}
                    alt={category.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={(e) => handleImageError(e, category.name)}
                  />
                  {/* Dark overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                  {/* Category info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-8 h-8" />
                      <h3 className="text-2xl font-bold">{category.name}</h3>
                    </div>
                    {category.subcategories?.length > 0 && (
                      <p className="text-sm opacity-90">
                        {category.subcategories.length} subcategories
                      </p>
                    )}
                  </div>
                </div>

                <CardContent className="p-6">
                  <button className="w-full flex items-center justify-between text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    <span>Explore {category.name}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </CardContent>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryTabs;