// export default CategoryPage;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import PaginatedProductGrid from '@/components/products/PaginatedProductGrid';
import { apiService, Category } from '@/lib/api';
import { Product } from '@/lib/type';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronRight } from 'lucide-react';

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{ 
    categorySlug: string; 
    subcategorySlug?: string 
  }>();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [level3Categories, setLevel3Categories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedLevel3, setSelectedLevel3] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch categories from API
        const categories = await apiService.getCategories();
        
        // Find current category by slug
        let currentCat: Category | null = null;
        
        if (categorySlug) {
          currentCat = categories.find(cat => 
            cat.slug === categorySlug && cat.level === 1 && cat.parentId === null
          ) || null;
        }
        
        if (!currentCat) {
          setError('Category not found');
          setLoading(false);
          return;
        }
        
        setCurrentCategory(currentCat);
        
        // Get subcategories for the current category (Level 2 categories)
        const currentSubcategories = categories.filter(
          cat => cat.level === 2 && cat.parentId === currentCat!.id
        );
        setSubcategories(currentSubcategories);
        
        // Fetch products ONLY for the current Level 1 category
        try {
          const response = await apiService.getProducts(1, 100, currentCat.name);
          const categoryProducts = response.products.filter(
            product => product.categoryLevel1 === currentCat!.name
          );
          setProducts(categoryProducts);
          
        } catch (productError) {
          console.error('Error fetching products:', productError);
          setProducts([]);
        }
      } catch (err) {
        console.error('Error fetching category data:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  // Update Level 3 categories and filter products when selection changes
  useEffect(() => {
    if (products.length === 0) {
      setFilteredProducts([]);
      setLevel3Categories([]);
      return;
    }

    let filtered = [...products];

    // Filter by Level 2 category if selected
    if (subcategorySlug) {
      const selectedSubcategory = subcategories.find(sub => sub.slug === subcategorySlug);
      if (selectedSubcategory) {
        filtered = filtered.filter(product => 
          product.categoryLevel2 === selectedSubcategory.name
        );
      }
    }

    // Extract Level 3 categories from the CURRENTLY filtered products
    const availableLevel3Cats = [...new Set(filtered.map(product => product.categoryLevel3))]
      .filter(Boolean)
      .filter(cat => {
        // Double-check that the Level 3 category actually belongs to products in the current Level 1 category
        return filtered.some(product => product.categoryLevel3 === cat);
      }) as string[];
    
    setLevel3Categories(availableLevel3Cats);

    // Apply Level 3 filter if selected
    if (selectedLevel3) {
      filtered = filtered.filter(product => 
        product.categoryLevel3 === selectedLevel3
      );
    }

    setFilteredProducts(filtered);
  }, [products, subcategories, subcategorySlug, selectedLevel3]);

  // Reset Level 3 filter when subcategory changes
  useEffect(() => {
    setSelectedLevel3(null);
  }, [subcategorySlug]);

  // Only show Level 3 filters if we have more than 1 category
  const shouldShowLevel3Filters = level3Categories.length > 1;

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="h-6 w-48 bg-muted animate-pulse rounded mb-6" />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg overflow-hidden border border-border">
                <div className="aspect-square bg-muted animate-pulse" />
                <div className="p-2 md:p-3 space-y-2">
                  <div className="h-3 md:h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-2 md:h-3 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-4 md:h-5 bg-muted animate-pulse rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !currentCategory) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Category not found</h1>
          <p className="text-gray-600 mb-8">
            {error || "The category you're looking for doesn't exist."}
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Home</Link>
            {currentCategory && (
              <>
                <ChevronRight className="h-4 w-4" />
                {subcategorySlug ? (
                  <Link to={`/category/${currentCategory.slug}`} className="hover:text-gray-900">
                    {currentCategory.name}
                  </Link>
                ) : (
                  <span className="text-gray-900 font-medium">{currentCategory.name}</span>
                )}
              </>
            )}
            {subcategorySlug && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-gray-900 font-medium">
                  {subcategories.find(sub => sub.slug === subcategorySlug)?.name || subcategorySlug}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Level 2 Subcategory Tabs */}
      {subcategories.length > 0 && (
        <div className="border-b border-gray-200 sticky top-16 bg-white z-30">
          <div className="container mx-auto px-4 py-4">
            <div className="flex space-x-2 overflow-x-auto">
              <Button
                variant={!subcategorySlug ? "default" : "outline"}
                asChild
                className="whitespace-nowrap flex-shrink-0"
              >
                <Link to={`/category/${currentCategory.slug}`}>
                  All {currentCategory.name}
                </Link>
              </Button>
              {subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={subcategorySlug === subcategory.slug ? "default" : "outline"}
                  asChild
                  className="whitespace-nowrap flex-shrink-0"
                >
                  <Link to={`/category/${currentCategory.slug}/${subcategory.slug}`}>
                    {subcategory.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Level 3 Category Filters - Only show if we have multiple Level 3 categories */}
      {shouldShowLevel3Filters && (
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 overflow-x-auto">
                <Button
                  variant={!selectedLevel3 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedLevel3(null)}
                  className="whitespace-nowrap flex-shrink-0"
                >
                  All Types
                </Button>
                {level3Categories.map((level3Cat) => (
                  <Button
                    key={level3Cat}
                    variant={selectedLevel3 === level3Cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel3(level3Cat)}
                    className="whitespace-nowrap flex-shrink-0"
                  >
                    {level3Cat}
                  </Button>
                ))}
              </div>
              
              {/* Product Count */}
              <div className="text-sm text-gray-600 whitespace-nowrap ml-4">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {selectedLevel3 && ` in ${selectedLevel3}`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Category Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">
            {selectedLevel3 
              ? `${selectedLevel3} ${subcategorySlug ? `- ${subcategories.find(sub => sub.slug === subcategorySlug)?.name}` : ''}`
              : subcategorySlug 
                ? `${subcategories.find(sub => sub.slug === subcategorySlug)?.name || subcategorySlug}`
                : `All ${currentCategory.name}`
            }
          </h1>
          <p className="text-gray-600 max-w-3xl">
            {subcategorySlug 
              ? subcategories.find(sub => sub.slug === subcategorySlug)?.description || currentCategory.description
              : currentCategory.description
            }
          </p>
          
          {/* Show available types if we don't show the filter bar */}
          {!shouldShowLevel3Filters && level3Categories.length === 1 && (
            <p className="text-sm text-gray-500 mt-2">
              Category: {level3Categories[0]}
            </p>
          )}
        </div>
      </div>
      
      {/* Products */}
      <div className="container mx-auto px-4 py-12">
        {filteredProducts.length > 0 ? (
          <PaginatedProductGrid 
            products={filteredProducts} 
            title={
              selectedLevel3 
                ? `${selectedLevel3} ${subcategorySlug ? `- ${subcategories.find(sub => sub.slug === subcategorySlug)?.name}` : ''}`
                : subcategorySlug 
                  ? `${subcategories.find(sub => sub.slug === subcategorySlug)?.name || subcategorySlug}`
                  : `All ${currentCategory.name}`
            }
          />
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">
              {selectedLevel3 
                ? `There are no ${selectedLevel3} products${subcategorySlug ? ` in ${subcategories.find(sub => sub.slug === subcategorySlug)?.name}` : ''} yet.`
                : subcategorySlug 
                  ? `There are no products in the ${subcategories.find(sub => sub.slug === subcategorySlug)?.name || subcategorySlug} category yet.`
                  : `There are no products in the ${currentCategory.name} category yet.`
              }
            </p>
            {selectedLevel3 && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedLevel3(null)}
                className="mt-4"
              >
                Show All Products
              </Button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;