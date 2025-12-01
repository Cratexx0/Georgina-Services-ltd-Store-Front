import { useState, useEffect } from 'react';
import { apiService, Category as ApiCategory } from '@/lib/api';
import { fallbackCategories, Category as LocalCategory } from '@/data/categories';

// Union type that can handle both API and local categories
type CategoryType = ApiCategory | LocalCategory;

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>(fallbackCategories as CategoryType[]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiCategories = await apiService.getCategories();
        setCategories(apiCategories as CategoryType[]);
      } catch (err) {
        console.error('Failed to fetch categories from API:', err);
        setError('Failed to load categories');
        // Keep using fallback categories
        setCategories(fallbackCategories as CategoryType[]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
