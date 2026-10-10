import { useState, useEffect } from "react";
import { apiService } from "@/lib/api";
import { Product } from "@/lib/type";
import {
  getLocalClothingProducts,
  isClothingProduct,
  localToApiProduct,
} from "@/lib/productUtils";
import {
  getFeaturedProducts,
  getNewArrivalProducts,
  getTrendingProducts,
  products as localProducts,
} from "@/data/products";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
}

const asApiList = (list: ReturnType<typeof getFeaturedProducts>): Product[] =>
  list.map(localToApiProduct);

const clothingOnly = (list: Product[]) => list.filter(isClothingProduct);

export const useTrendingProducts = (page = 1, limit = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getTrendingProducts(page, limit);
        const list = clothingOnly(data.products || []);
        if (!cancelled) {
          if (list.length) {
            setProducts(list);
            setTotal(data.total || list.length);
          } else {
            const fallback = clothingOnly(asApiList(getTrendingProducts()));
            setProducts(fallback);
            setTotal(fallback.length);
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = clothingOnly(asApiList(getTrendingProducts()));
          setProducts(fallback);
          setTotal(fallback.length);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};

export const useNewArrivalProducts = (page = 1, limit = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getNewArrivalProducts(page, limit);
        const list = clothingOnly(data.products || []);
        if (!cancelled) {
          if (list.length) {
            setProducts(list);
            setTotal(data.total || list.length);
          } else {
            const fallback = clothingOnly(asApiList(getNewArrivalProducts()));
            setProducts(fallback);
            setTotal(fallback.length);
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = clothingOnly(asApiList(getNewArrivalProducts()));
          setProducts(fallback);
          setTotal(fallback.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};

export const useFeaturedProducts = (page = 1, limit = 10): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getFeaturedProducts(page, limit);
        const list = clothingOnly(data.products || []);
        if (!cancelled) {
          if (list.length) {
            setProducts(list);
            setTotal(data.total || list.length);
          } else {
            const fallback = clothingOnly(asApiList(getFeaturedProducts()));
            setProducts(fallback);
            setTotal(fallback.length);
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = clothingOnly(asApiList(getFeaturedProducts()));
          setProducts(fallback);
          setTotal(fallback.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, limit]);

  return { products, loading, error, total, page, limit };
};

export const useProducts = (
  page = 1,
  limit = 12,
  category?: string,
  search?: string
): UseProductsResult => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiService.getProducts(page, limit, category, undefined, search);
        if (!cancelled) {
          if (data.products?.length) {
            setProducts(data.products);
            setTotal(data.total);
          } else {
            const fallback = search
              ? localProducts
                  .filter((p) =>
                    `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())
                  )
                  .map(localToApiProduct)
              : category
                ? localProducts
                    .filter((p) => p.categoryId === category || p.subcategoryId === category)
                    .map(localToApiProduct)
                : getLocalClothingProducts();
            setProducts(fallback);
            setTotal(fallback.length);
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = search
            ? localProducts
                .filter((p) =>
                  `${p.name} ${p.description}`.toLowerCase().includes(search.toLowerCase())
                )
                .map(localToApiProduct)
            : getLocalClothingProducts();
          setProducts(fallback);
          setTotal(fallback.length);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, limit, category, search]);

  return { products, loading, error, total, page, limit };
};
