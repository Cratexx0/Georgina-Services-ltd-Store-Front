import { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  image?: string;
  images?: string[];
  categoryId: string;
  subcategoryId?: string;
  subCategoryId?: string;
  rating?: number;
  likes?: number;
  stock: number;
  slug?: string;
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
  sizes?: string[];
  colors?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

export const useProducts = (page = 1, limit = 10, category?: string, subcategory?: string): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProducts(page, limit, category, subcategory);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to fetch products from API:", err);
        setError("Failed to load products from server.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, limit, category, subcategory]);

  return { products, loading, error, total, page, limit };
};

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
        const data = await apiService.getTrendingProducts(page, limit);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to fetch trending products from API:", err);
        setError("Failed to load trending products from server.");
        setProducts([]);
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
        const data = await apiService.getNewArrivalProducts(page, limit);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to fetch new arrival products from API:", err);
        setError("Failed to load new arrival products from server.");
        setProducts([]);
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
        const data = await apiService.getFeaturedProducts(page, limit);
        setProducts(data.products);
        setTotal(data.total);
      } catch (err) {
        console.error("Failed to fetch featured products from API:", err);
        setError("Failed to load featured products from server.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};
