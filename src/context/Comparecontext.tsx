// src/context/CompareContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Product } from "@/lib/type";

export const MAX_COMPARE = 3;

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string | number) => void;
  toggleCompare: (product: Product) => void;
  isInCompare: (productId: string | number) => boolean;
  clearCompare: () => void;
  count: number;
  isFull: boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
};

const same = (a: string | number, b: string | number) => a.toString() === b.toString();

export const CompareProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [compareItems, setCompareItems] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem("compare");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("compare", JSON.stringify(compareItems));
    } catch {
      /* storage unavailable */
    }
  }, [compareItems]);

  const isInCompare = (id: string | number) => compareItems.some((p) => same(p.id, id));

  const addToCompare = (product: Product) => {
    if (isInCompare(product.id)) return;
    if (compareItems.length >= MAX_COMPARE) {
      toast.error(`You can compare up to ${MAX_COMPARE} products`);
      return;
    }
    setCompareItems([...compareItems, product]);
    toast.success(`${product.name} added to compare`);
  };

  const removeFromCompare = (id: string | number) => {
    setCompareItems((items) => items.filter((p) => !same(p.id, id)));
  };

  const toggleCompare = (product: Product) => {
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
      toast.success(`${product.name} removed from compare`);
    } else {
      addToCompare(product);
    }
  };

  const clearCompare = () => setCompareItems([]);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        toggleCompare,
        isInCompare,
        clearCompare,
        count: compareItems.length,
        isFull: compareItems.length >= MAX_COMPARE,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};