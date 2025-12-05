// src/hooks/useProducts.ts
import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { Product } from '@/lib/type';

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

// All hooks now simply use the normalized Product[] from ApiService
export const useTrendingProducts = (page = 1, limit = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ApiService returns normalized Product[] directly
        const productsData = await apiService.getTrendingProducts();
        
        setProducts(productsData.products);
        setTotal(productsData.total);
      } catch (err) {
        console.error("Failed to load trending products:", err);
        setError("Failed to load trending products.");
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};

export const useNewArrivalProducts = (page = 1, limit = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchNewArrivalProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ApiService returns normalized Product[] directly
        const productsData = await apiService.getNewArrivalProducts();
        
        setProducts(productsData.products);
        setTotal(productsData.total);
      } catch (err) {
        console.error("Failed to load new arrival products:", err);
        setError("Failed to load new arrival products.");
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivalProducts();
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};

export const useFeaturedProducts = (page = 1, limit = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ApiService returns normalized Product[] directly
        const productsData = await apiService.getFeaturedProducts();
        
        setProducts(productsData.products);
        setTotal(productsData.total); // FIXED: Changed .limit to .length
      } catch (err) {
        console.error("Failed to load featured products:", err);
        setError("Failed to load featured products.");
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};

export const useProducts = (page = 1, limit = 10, category?: string, search?: string): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params: any = {
          page,
          limit,
        };
        
        if (category) {
          params.category = category;
        }
        
        if (search) {
          params.search = search;
        }
        
        // ApiService returns normalized Product[] directly
        const productsData = await apiService.getProducts(params);
        
        setProducts(productsData.products);
        setTotal(productsData.total);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products.");
        setProducts([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, category, search]);

  return { products, loading, error, total, page, limit };
};