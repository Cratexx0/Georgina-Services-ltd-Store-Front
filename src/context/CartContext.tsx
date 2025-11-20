

import React, { createContext, useContext, useState, useEffect } from 'react';

import { toast } from '@/components/ui/sonner';
import { Product } from '@/lib/type';



export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
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
    // Initialize from local storage if available
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update local storage when cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(currentCart => {
      const existingItem = currentCart.find(item => item.product.id === product.id);
      
      if (existingItem) {
        toast.success(`Updated ${product.name} quantity in cart`);
        return currentCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        toast.success(`${product.name} added to cart`);
        return [...currentCart, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(currentCart => currentCart.filter(item => item.product.id !== productId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(currentCart => 
      currentCart.map(item => 
        item.product.id === productId ? { ...item, quantity } : item
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
      const price = parseFloat(priceStr);
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

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice,
      getTotalItems,
    }}>
      {children}
    </CartContext.Provider>
  );
};
