import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PaginatedProductGrid from "@/components/products/PaginatedProductGrid";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { apiService } from "@/lib/api";
import { Product } from "@/lib/type";
import { searchLocalProducts } from "@/lib/productUtils";
import { useDebounce } from "@/hooks/useDebounce";
import { ProductGridSkeleton } from "@/components/Loader/SkeletonLoader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounced = useDebounce(initialQuery, 300);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!debounced.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const data = await apiService.getProducts(1, 48, undefined, undefined, debounced);
        if (!cancelled) {
          setResults(data.products?.length ? data.products : searchLocalProducts(debounced));
        }
      } catch {
        if (!cancelled) {
          setResults(searchLocalProducts(debounced));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) setSearchParams({ q: searchQuery.trim() });
  };

  const title = useMemo(
    () => (initialQuery ? `Results for “${initialQuery}”` : "Search"),
    [initialQuery]
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl md:text-4xl mb-6">{title}</h1>
        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-8">
          <Input
            type="search"
            placeholder="Search clothing…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </form>

        {loading && <ProductGridSkeleton count={8} />}
        {error && !loading && <ErrorState message="Search is unavailable right now." />}
        {!loading && initialQuery && results.length === 0 && (
          <EmptyState
            icon={<Search className="h-7 w-7" />}
            title="No matches"
            description={`We couldn’t find anything for “${initialQuery}”. Try a different word or browse the collection.`}
          />
        )}
        {!loading && results.length > 0 && (
          <>
            <p className="text-sm text-muted-foreground mb-6">{results.length} products</p>
            <PaginatedProductGrid products={results} itemsPerPage={12} />
          </>
        )}
      </div>
    </Layout>
  );
};

export default SearchResults;
