// src/context/CartContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { Product } from '@/lib/type';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string; // Changed from string[] to string since we're selecting one size
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (productId: string | number) => void;
  updateQuantity: (productId: string | number, quantity: number) => void;
  updateSize: (productId: string | number, size: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getItemByProductId: (productId: string | number) => CartItem | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Helper function to compare product IDs (handles both string and number)
  const compareProductIds = (id1: string | number, id2: string | number): boolean => {
    return id1.toString() === id2.toString();
  };

  const addToCart = (product: Product, quantity = 1, size?: string) => {
    setCart(currentCart => {
      // Check if product with same ID AND same size already exists in cart
      const existingItem = currentCart.find(item => 
        compareProductIds(item.product.id, product.id) && item.size === size
      );
      
      if (existingItem) {
        // Update quantity for existing item with same size
        toast.success(`Updated ${product.name} quantity in cart`);
        return currentCart.map(item => 
          compareProductIds(item.product.id, product.id) && item.size === size
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Add new item to cart
        toast.success(`${product.name} added to cart${size ? ` (Size: ${size})` : ''}`);
        return [...currentCart, { product, quantity, size: size || '' }];
      }
    });
  };

  const removeFromCart = (productId: string | number) => {
    setCart(currentCart => 
      currentCart.filter(item => !compareProductIds(item.product.id, productId))
    );
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string | number, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(currentCart => 
      currentCart.map(item => 
        compareProductIds(item.product.id, productId) ? { ...item, quantity } : item
      )
    );
  };

  const updateSize = (productId: string | number, size: string) => {
    setCart(currentCart => 
      currentCart.map(item => 
        compareProductIds(item.product.id, productId) ? { ...item, size } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    toast.success("Cart cleared");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const priceStr = item.product.discountPrice || item.product.price;
      const price = parseFloat(priceStr.toString());
      if (isNaN(price)) {
        console.error(`Invalid price value: ${priceStr} for product ${item.product.name}`);
        return total;
      }
      return total + price * item.quantity;
    }, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getItemByProductId = (productId: string | number): CartItem | undefined => {
    return cart.find(item => compareProductIds(item.product.id, productId));
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateSize,
      clearCart,
      getTotalPrice,
      getTotalItems,
      getItemByProductId,
    }}>
      {children}
    </CartContext.Provider>
  );
};