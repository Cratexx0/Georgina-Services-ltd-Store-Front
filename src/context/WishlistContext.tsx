// src/context/WishlistContext.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/lib/type";
import { apiService } from "./ApiService";
import { useAuth } from "./AuthContext";
import { WishlistContext } from "./WishlistContextValue";

interface WishlistProviderProps {
  children: React.ReactNode;
}

const compareProductIds = (id1: string | number, id2: string | number): boolean =>
  id1.toString() === id2.toString();

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load wishlist from backend
  const loadWishlistFromBackend = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getWishlist();
      
      if (response.success && response.data) {
        let wishlistItems: Product[] = [];
        
        if (Array.isArray(response.data)) {
          wishlistItems = response.data;
        } else if (Array.isArray(response.wishlist)) {
          wishlistItems = response.wishlist
            .map(item => item.product)
            .filter((product): product is Product => product !== undefined);
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
  }, []);

  // Load wishlist from backend when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      void loadWishlistFromBackend();
    } else {
      // Use local storage when not authenticated
      const savedWishlist = localStorage.getItem('wishlist');
      setWishlist(savedWishlist ? JSON.parse(savedWishlist) : []);
    }
  }, [isAuthenticated, user, loadWishlistFromBackend]);

  // Save wishlist to localStorage as backup
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Add to wishlist
  const addToWishlist = useCallback(async (product: Product) => {
    // Optimistically update UI first for immediate visual feedback
    setWishlist(current => {
      // Check if already exists before adding
      const alreadyExists = current.some(item => compareProductIds(item.id, product.id));
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

          if (response.message?.toLowerCase().includes('already')) {
            toast.info(response.message);
            // Re-add to state since it exists on backend
            setWishlist(current => {
              const exists = current.some(item => compareProductIds(item.id, product.id));
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
  }, [isAuthenticated, user]);

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string | number) => {
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
  }, [isAuthenticated, user, wishlist]);

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string | number) => {
    return wishlist.some(item => compareProductIds(item.id, productId));
  }, [wishlist]);

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
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
  }, [isAuthenticated, user]);

  const contextValue = useMemo(
    () => ({
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      isLoading,
    }),
    [
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
      isLoading,
    ],
  );

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  );
};