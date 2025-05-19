
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/products/ProductGrid';
import { searchProducts } from '@/data/products';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState(searchProducts(initialQuery));
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery });
      setResults(searchProducts(searchQuery));
    }
  };
  
  // Update results when URL query parameter changes
  useEffect(() => {
    setResults(searchProducts(initialQuery));
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">
            {initialQuery 
              ? `Search results for "${initialQuery}"` 
              : 'Search Products'
            }
          </h1>
          <form onSubmit={handleSearch} className="flex space-x-2 max-w-xl">
            <Input
              type="text"
              placeholder="Search for products..."
              className="flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </form>
        </div>
        
        {initialQuery && (
          <>
            {results.length > 0 ? (
              <ProductGrid products={results} />
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-2">No results found</h2>
                <p className="text-gray-600 mb-6">
                  We couldn't find any products matching "{initialQuery}".
                </p>
                <p className="text-gray-600">
                  Try a different search term or explore our categories.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
