
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/categories';
import { cn } from '@/lib/utils';

const CategoryTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('womens-clothing');
  
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
