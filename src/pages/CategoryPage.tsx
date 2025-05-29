
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PaginatedProductGrid from '@/components/products/PaginatedProductGrid';
import { getCategory, getSubcategory } from '@/data/categories';
import { getProductsByCategory, getProductsBySubcategory } from '@/data/products';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ categorySlug: string, subcategorySlug?: string }>();
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(subcategorySlug);
  
  const category = categorySlug ? getCategory(categorySlug) : undefined;
  
  useEffect(() => {
    setActiveSubcategory(subcategorySlug);
  }, [subcategorySlug]);

  if (!category) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
          <p className="text-gray-600 mb-8">The category you're looking for doesn't exist.</p>
          <Button asChild>
            <a href="/">Back to Home</a>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const products = subcategorySlug 
    ? getProductsBySubcategory(subcategorySlug)
    : activeSubcategory 
      ? getProductsBySubcategory(activeSubcategory) 
      : getProductsByCategory(category.id);

  const handleSubcategoryClick = (subcategoryId: string) => {
    setActiveSubcategory(subcategoryId);
  };

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">{category.name}</h1>
          <p className="text-gray-600 max-w-3xl">{category.description}</p>
        </div>
      </div>
      
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="border-b border-gray-200 sticky top-16 bg-white z-30">
          <div className="container mx-auto px-4 py-4 overflow-x-auto flex space-x-4">
            <Button 
              variant={!activeSubcategory ? "default" : "outline"} 
              onClick={() => setActiveSubcategory(undefined)}
              className="whitespace-nowrap"
            >
              All {category.name}
            </Button>
            {category.subcategories.map((subcategory) => (
              <Button 
                key={subcategory.id} 
                variant={activeSubcategory === subcategory.id ? "default" : "outline"}
                onClick={() => handleSubcategoryClick(subcategory.id)}
                className="whitespace-nowrap"
              >
                {subcategory.name}
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-12">
        <PaginatedProductGrid 
          products={products} 
          title={activeSubcategory 
            ? `${category.subcategories?.find(sub => sub.id === activeSubcategory)?.name}` 
            : `All ${category.name}`
          } 
        />
      </div>
    </Layout>
  );
};

export default CategoryPage;
