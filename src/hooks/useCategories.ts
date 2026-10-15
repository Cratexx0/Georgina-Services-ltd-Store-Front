import { useState, useEffect } from 'react';
import { apiService, Category as ApiCategory } from '@/lib/api';

export const useCategories = () => {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiCategories = await apiService.getCategories();
        setCategories(apiCategories);
      } catch (err) {
        console.error('Failed to fetch categories from API:', err);
        setError('Failed to load categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
