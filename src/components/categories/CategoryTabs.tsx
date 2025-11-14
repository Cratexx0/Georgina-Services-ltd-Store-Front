
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';

const CategoryTabs: React.FC = () => {
  const { categories, loading, error } = useCategories();
  const [activeTab, setActiveTab] = useState<string>('');
  
  // Set the first category as active when categories are loaded
  React.useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].id);
    }
  }, [categories, activeTab]);
  
  if (loading) {
    return (
      <div className="mb-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Remove error display - fallback categories are used automatically
  
  return (
    <div className="mb-12">
      <div className="mb-6 border-b border-gray-200">
        <div className="container mx-auto px-4 flex overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveTab(category.id)}
              className={cn(
                "px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors relative",
                activeTab === category.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-600 hover:text-primary"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 animate-fade-in">
        {categories.map((category) => (
          <div 
            key={category.id}
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4",
              activeTab === category.id ? "block" : "hidden"
            )}
          >
            {category.subcategories?.map((subcategory) => (
              <Link
                key={subcategory.id}
                to={`/category/${category.slug}/${subcategory.slug}`}
                className="category-link text-center p-4 rounded-md hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-700">{subcategory.name}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;
