// src/context/WishlistContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Product } from '@/lib/type';
// import { Product } from '@/types/product';

interface WishlistContextType {
  wishlist: Product[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string | number) => void;
  isInWishlist: (productId: string | number) => boolean;
  clearWishlist: () => void;
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
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Helper function to compare product IDs
  const compareProductIds = (id1: string | number, id2: string | number): boolean => {
    return id1.toString() === id2.toString();
  };

  const addToWishlist = (product: Product) => {
    setWishlist(current => {
      if (current.find(item => compareProductIds(item.id, product.id))) {
        toast.info('Product is already in your wishlist');
        return current;
      }
      toast.success('Added to wishlist');
      return [...current, product];
    });
  };

  const removeFromWishlist = (productId: string | number) => {
    setWishlist(current => 
      current.filter(item => !compareProductIds(item.id, productId))
    );
    toast.success('Removed from wishlist');
  };

  const isInWishlist = (productId: string | number) => {
    return wishlist.some(item => compareProductIds(item.id, productId));
  };

  const clearWishlist = () => {
    setWishlist([]);
    toast.success('Wishlist cleared');
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};