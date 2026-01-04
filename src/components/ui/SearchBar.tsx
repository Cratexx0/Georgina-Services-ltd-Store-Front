import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ShoppingBag, FolderOpen, Sparkles, Loader2 } from 'lucide-react';
import { apiService, Product, Category, SubCategory } from '@/lib/api';

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

interface SearchResults {
  products: Product[];
  categories: Category[];
  subcategories: { subcategory: SubCategory; category: Category }[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    products: [],
    categories: [],
    subcategories: [],
  });
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await apiService.getCategories();
        setAllCategories(cats);
      } catch (err) {
        console.error('Failed to fetch categories for search:', err);
      }
    };
    fetchCategories();
  }, []);

  // Search across all data types
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const searchQuery = query.toLowerCase().trim();

        try {
          // Search products via API
          const productsData = await apiService.getProducts(1, 10, undefined, searchQuery);
          const productResults = productsData.products?.slice(0, 4) || [];

          // Search categories locally from fetched API data
          const categoryResults = allCategories.filter(
            (cat) =>
              cat.name.toLowerCase().includes(searchQuery) ||
              cat.description?.toLowerCase().includes(searchQuery)
          );

          // Search subcategories
          const subcategoryResults: { subcategory: SubCategory; category: Category }[] = [];
          allCategories.forEach((cat) => {
            cat.subcategories?.forEach((sub) => {
              if (
                sub.name.toLowerCase().includes(searchQuery) ||
                sub.description?.toLowerCase().includes(searchQuery)
              ) {
                subcategoryResults.push({ subcategory: sub, category: cat });
              }
            });
          });

          setResults({
            products: productResults,
            categories: categoryResults.slice(0, 3),
            subcategories: subcategoryResults.slice(0, 3),
          });

          const hasResults =
            productResults.length > 0 ||
            categoryResults.length > 0 ||
            subcategoryResults.length > 0;
          setOpen(hasResults);
        } catch (err) {
          console.error('Search failed:', err);
          setResults({ products: [], categories: [], subcategories: [] });
          setOpen(false);
        } finally {
          setLoading(false);
        }
      } else {
        setResults({ products: [], categories: [], subcategories: [] });
        setOpen(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query, allCategories]);

  const handleSelectProduct = (productSlug: string) => {
    navigate(`/product/${productSlug}`);
    handleClear();
  };

  const handleSelectCategory = (categorySlug: string) => {
    navigate(`/category/${categorySlug}`);
    handleClear();
  };

  const handleSelectSubcategory = (categorySlug: string, subcategorySlug: string) => {
    if (subcategorySlug === 'cleaning-services') {
      navigate('/cleaning-services');
    } else {
      navigate(`/category/${categorySlug}/${subcategorySlug}`);
    }
    handleClear();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      handleClear();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults({ products: [], categories: [], subcategories: [] });
    setOpen(false);
    onClose?.();
  };

  const hasResults =
    results.products.length > 0 ||
    results.categories.length > 0 ||
    results.subcategories.length > 0;

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          {loading ? (
            <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
          ) : (
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && hasResults && setOpen(true)}
            placeholder="Search products, categories, services..."
            className="w-full h-10 pl-9 pr-9 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {open && hasResults && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-[450px] overflow-y-auto">
          {/* Categories Section */}
          {results.categories.length > 0 && (
            <div className="p-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1 flex items-center gap-1">
                <FolderOpen className="h-3 w-3" /> Categories
              </p>
              {results.categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleSelectCategory(category.slug)}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0 flex items-center justify-center">
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FolderOpen className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{category.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{category.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Subcategories/Services Section */}
          {results.subcategories.length > 0 && (
            <div className="p-2 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Subcategories & Services
              </p>
              {results.subcategories.map(({ subcategory, category }) => (
                <button
                  key={subcategory.id}
                  onClick={() => handleSelectSubcategory(category.slug, subcategory.slug)}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{subcategory.name}</p>
                    <p className="text-xs text-muted-foreground">in {category.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Products Section */}
          {results.products.length > 0 && (
            <div className="p-2">
              <p className="text-xs font-medium text-muted-foreground px-2 py-1 flex items-center gap-1">
                <ShoppingBag className="h-3 w-3" /> Products
              </p>
              {results.products.map((product) => {
                const currentPrice = product.discountPrice
                  ? parseFloat(product.discountPrice.toString())
                  : parseFloat(product.price.toString());
                const originalPrice = product.discountPrice
                  ? parseFloat(product.price.toString())
                  : null;

                return (
                  <button
                    key={product.id}
                    onClick={() => handleSelectProduct(product.slug || product.id.toString())}
                    className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.images?.[0] || '/api/placeholder/50/50'}
                        alt={product.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = '/api/placeholder/50/50';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm font-medium text-foreground">
                          £{currentPrice.toFixed(2)}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            £{originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* View All Results */}
          {query.trim() && (
            <div className="border-t border-border p-2">
              <button
                onClick={handleSearch}
                className="w-full text-sm text-primary hover:text-primary/80 p-2 rounded-md hover:bg-accent transition-colors text-left flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                View all results for "{query}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
