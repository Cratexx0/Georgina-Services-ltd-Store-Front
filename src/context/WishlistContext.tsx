// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Product } from '@/lib/type';
import { apiService } from './ApiService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string | number) => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
  clearWishlist: () => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlistFromBackend();
    } else {
      // Use local storage when not authenticated
      const savedWishlist = localStorage.getItem('wishlist');
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
  }, [isAuthenticated, user]);

  // Save wishlist to localStorage as backup
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load wishlist from backend
  const loadWishlistFromBackend = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getWishlist();
      
      if (response.success && response.data) {
        let wishlistItems: any[] = [];
        
        if (Array.isArray(response.data)) {
          wishlistItems = response.data;
        } else if (Array.isArray(response.wishlist)) {
          wishlistItems = response.wishlist;
        }
        
        setWishlist(wishlistItems);
      }
    } catch (error) {
      console.error('Failed to load wishlist from backend:', error);
      // Fall back to local storage
      const savedWishlist = localStorage.getItem('wishlist');
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to compare product IDs
  const compareProductIds = (id1: string | number, id2: string | number): boolean => {
    return id1.toString() === id2.toString();
  };

  // Add to wishlist
  const addToWishlist = async (product: Product) => {
    // Optimistically update UI first for immediate visual feedback
    setWishlist(current => {
      // Check if already exists before adding
      const alreadyExists = current.find(item => compareProductIds(item.id, product.id));
      if (alreadyExists) {
        return current; // No change needed
      }
      return [...current, product];
    });

    try {
      if (isAuthenticated && user) {
        // Call backend API
        setIsLoading(true);
        const response = await apiService.addToWishlist(product.id.toString());

        if (response.success) {
          toast.success(response.message || 'Added to wishlist');
        } else {
          // Rollback on failure
          setWishlist(current => current.filter(item => !compareProductIds(item.id, product.id)));

          if (response.message && response.message.toLowerCase().includes('already')) {
            toast.info(response.message);
            // Re-add to state since it exists on backend
            setWishlist(current => {
              const exists = current.find(item => compareProductIds(item.id, product.id));
              if (exists) return current;
              return [...current, product];
            });
          } else {
            toast.error(response.message || 'Failed to add to wishlist');
          }
        }
      } else {
        // For non-authenticated users, just show success
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      // Rollback on error
      setWishlist(current => current.filter(item => !compareProductIds(item.id, product.id)));
      toast.error(error instanceof Error ? error.message : 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId: string | number) => {
    // Store the product in case we need to rollback
    const productToRemove = wishlist.find(item => compareProductIds(item.id, productId));

    // Optimistically update UI first for immediate feedback
    setWishlist(current =>
      current.filter(item => !compareProductIds(item.id, productId))
    );

    try {
      if (isAuthenticated && user) {
        // Call backend API
        setIsLoading(true);
        const response = await apiService.removeFromWishlist(productId.toString());

        if (response.success) {
          toast.success(response.message || 'Removed from wishlist');
        } else {
          // Rollback on failure
          if (productToRemove) {
            setWishlist(current => [...current, productToRemove]);
          }
          toast.error(response.message || 'Failed to remove from wishlist');
        }
      } else {
        // For non-authenticated users, just show success
        toast.success('Removed from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      // Rollback on error
      if (productToRemove) {
        setWishlist(current => [...current, productToRemove]);
      }
      toast.error(error instanceof Error ? error.message : 'Failed to remove from wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId: string | number) => {
    return wishlist.some(item => compareProductIds(item.id, productId));
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      setIsLoading(true);

      if (isAuthenticated && user) {
        // Call backend API
        const response = await apiService.clearWishlist();
        
        if (response.success) {
          setWishlist([]);
          toast.success('Wishlist cleared');
        } else {
          throw new Error(response.message || 'Failed to clear wishlist');
        }
      } else {
        // Clear local wishlist when not authenticated
        setWishlist([]);
        toast.success('Wishlist cleared');
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to clear wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      isLoading,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};