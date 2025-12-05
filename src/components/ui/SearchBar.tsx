import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { searchProducts } from '@/data/products';
import { Product } from '@/data/products';

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onClose, className = '' }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        const searchResults = searchProducts(query);
        setResults(searchResults.slice(0, 5)); // Show max 5 suggestions
        setOpen(searchResults.length > 0);
      } else {
        setResults([]);
        setOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (productSlug: string) => {
    navigate(`/product/${productSlug}`);
    setQuery('');
    setResults([]);
    setOpen(false);
    onClose?.();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setQuery('');
      setResults([]);
      setOpen(false);
      onClose?.();
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim().length > 1 && results.length > 0 && setOpen(true)}
            placeholder="Search products..."
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
      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          <div className="p-2">
            {results.map((product) => {
              const currentPrice = product.discountPrice ? parseFloat(product.discountPrice.toString()) : parseFloat(product.price.toString());
              const originalPrice = product.discountPrice ? parseFloat(product.price.toString()) : null;
              
              return (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product.slug || product.id.toString())}
                  className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={product.images[0] || '/api/placeholder/50/50'}
                      alt={product.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/50/50';
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-medium text-foreground">
                        ${currentPrice.toFixed(2)}
                      </span>
                      {originalPrice && (
                        <span className="text-xs text-muted-foreground line-through">
                          ${originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
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
