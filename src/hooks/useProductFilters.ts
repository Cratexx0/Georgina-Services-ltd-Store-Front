import { useMemo, useState } from "react";
import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";
import {
  getNumericPrice,
  getProductColors,
  getProductRating,
  getProductSizes,
} from "@/lib/productUtils";

export type SortOption =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount";

export interface ProductFilterState {
  sizes: string[];
  colors: string[];
  brands: string[];
  inStockOnly: boolean;
  discountOnly: boolean;
  minRating: number | null;
  priceRange: [number, number];
  search: string;
  sort: SortOption;
}

export const useProductFilters = (products: FlexibleProduct[]) => {
  const bounds = useMemo(() => {
    const prices = products.map(getNumericPrice).filter((n) => !Number.isNaN(n));
    const min = prices.length ? Math.floor(Math.min(...prices)) : 0;
    const max = prices.length ? Math.ceil(Math.max(...prices)) : 500;
    return { min, max };
  }, [products]);

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [discountOnly, setDiscountOnly] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([bounds.min, bounds.max]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => getProductSizes(p).forEach((s) => set.add(s)));
    return Array.from(set);
  }, [products]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => getProductColors(p).forEach((c) => set.add(c)));
    return Array.from(set);
  }, [products]);

  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if ("brand" in p && p.brand) set.add(p.brand);
    });
    return Array.from(set);
  }, [products]);

  const hasRating = products.some((p) => getProductRating(p) != null);

  const filtered = useMemo(() => {
    let next = products.filter((p) => {
      const price = getNumericPrice(p);
      if (price < priceRange[0] || price > priceRange[1]) return false;
      if (inStockOnly && p.stock <= 0) return false;
      if (discountOnly && !getDiscountPrice(p)) return false;
      if (sizes.length) {
        const productSizes = getProductSizes(p);
        if (!sizes.some((s) => productSizes.includes(s))) return false;
      }
      if (colors.length) {
        const productColors = getProductColors(p);
        if (!colors.some((c) => productColors.includes(c))) return false;
      }
      if (brands.length) {
        const brand = "brand" in p ? p.brand : null;
        if (!brand || !brands.includes(brand)) return false;
      }
      if (minRating != null) {
        const rating = getProductRating(p);
        if (rating == null || rating < minRating) return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${p.name} ${p.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    next = [...next].sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return getNumericPrice(a) - getNumericPrice(b);
        case "price-desc":
          return getNumericPrice(b) - getNumericPrice(a);
        case "newest":
          return Number(!!("isNewArrival" in b && b.isNewArrival) || ("newArrival" in b && b.newArrival)) -
            Number(!!("isNewArrival" in a && a.isNewArrival) || ("newArrival" in a && a.newArrival));
        case "rating":
          return (getProductRating(b) || 0) - (getProductRating(a) || 0);
        case "discount":
          return (
            ((getDiscountPrice(b) ? 1 : 0) - (getDiscountPrice(a) ? 1 : 0)) ||
            getPrice(b) - getPrice(a)
          );
        default: {
          const featuredA = Number(
            ("isFeatured" in a && a.isFeatured) || ("featured" in a && a.featured)
          );
          const featuredB = Number(
            ("isFeatured" in b && b.isFeatured) || ("featured" in b && b.featured)
          );
          return featuredB - featuredA;
        }
      }
    });

    return next;
  }, [
    products,
    sizes,
    colors,
    brands,
    inStockOnly,
    discountOnly,
    minRating,
    priceRange,
    search,
    sort,
  ]);

  const activeCount =
    sizes.length +
    colors.length +
    brands.length +
    (inStockOnly ? 1 : 0) +
    (discountOnly ? 1 : 0) +
    (minRating ? 1 : 0) +
    (search.trim() ? 1 : 0) +
    (priceRange[0] !== bounds.min || priceRange[1] !== bounds.max ? 1 : 0);

  const clearAll = () => {
    setSizes([]);
    setColors([]);
    setBrands([]);
    setInStockOnly(false);
    setDiscountOnly(false);
    setMinRating(null);
    setPriceRange([bounds.min, bounds.max]);
    setSearch("");
    setSort("featured");
  };

  return {
    filtered,
    bounds,
    availableSizes,
    availableColors,
    availableBrands,
    hasRating,
    sizes,
    setSizes,
    colors,
    setColors,
    brands,
    setBrands,
    inStockOnly,
    setInStockOnly,
    discountOnly,
    setDiscountOnly,
    minRating,
    setMinRating,
    priceRange,
    setPriceRange,
    search,
    setSearch,
    sort,
    setSort,
    activeCount,
    clearAll,
  };
};
