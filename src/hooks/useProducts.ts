import { useState, useEffect } from 'react';

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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Import dummy products
        const { products: dummyProducts, getProductsByCategory, getProductsBySubcategory } = await import('@/data/products');
        
        let filteredProducts = dummyProducts;
        
        if (category) {
          filteredProducts = getProductsByCategory(category);
        }
        
        if (subcategory) {
          filteredProducts = getProductsBySubcategory(subcategory);
        }
        
        setTotal(filteredProducts.length);
        setProducts(filteredProducts);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError("Failed to load products.");
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { getTrendingProducts } = await import('@/data/products');
        const trendingProducts = getTrendingProducts();
        
        setTotal(trendingProducts.length);
        setProducts(trendingProducts);
      } catch (err) {
        console.error("Failed to load trending products:", err);
        setError("Failed to load trending products.");
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { getNewArrivalProducts } = await import('@/data/products');
        const newArrivals = getNewArrivalProducts();
        
        setTotal(newArrivals.length);
        setProducts(newArrivals);
      } catch (err) {
        console.error("Failed to load new arrival products:", err);
        setError("Failed to load new arrival products.");
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
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const { getFeaturedProducts } = await import('@/data/products');
        const featured = getFeaturedProducts();
        
        setTotal(featured.length);
        setProducts(featured);
      } catch (err) {
        console.error("Failed to load featured products:", err);
        setError("Failed to load featured products.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};
