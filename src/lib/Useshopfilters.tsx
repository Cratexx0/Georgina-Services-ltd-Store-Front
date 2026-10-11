// src/hooks/useShopFilters.ts
// Self-contained filtering + sorting for the category page:
// type (level 3) · price · size · on sale · in stock · new arrivals · sort order.
import { useCallback, useMemo, useState } from "react";
import type { Product } from "@/lib/type";
import { getProductSizes } from "@/lib/productUtils";

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "name-asc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Lowest price" },
  { value: "price-desc", label: "Highest price" },
  { value: "name-asc", label: "Name A–Z" },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const priceOf = (p: Product): number => {
  const n = Number(p.discountPrice || p.price);
  return Number.isFinite(n) ? n : 0;
};

const isOnSale = (p: Product) =>
  !!p.discountPrice && Number(p.discountPrice) < Number(p.price);

export interface FilterChip {
  key: string;
  label: string;
  clear: () => void;
}

export const useShopFilters = (products: Product[]) => {
  const [types, setTypes] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [onSale, setOnSale] = useState(false);
  const [inStock, setInStock] = useState(false);
  const [newOnly, setNewOnly] = useState(false);
  const [sort, setSort] = useState<SortKey>("featured");

  // price slider limits come from the products being browsed
  const bounds = useMemo(() => {
    const prices = products.map(priceOf).filter((n) => n > 0);
    if (!prices.length) return { min: 0, max: 0 };
    return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
  }, [products]);

  const effectiveMax =
    maxPrice === null ? bounds.max : Math.max(bounds.min, Math.min(maxPrice, bounds.max));
  const priceActive = maxPrice !== null && effectiveMax < bounds.max;

  const typeCounts = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => {
      if (p.categoryLevel3) map.set(p.categoryLevel3, (map.get(p.categoryLevel3) || 0) + 1);
    });
    return [...map.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const sizeOptions = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => getProductSizes(p).forEach((s) => set.add(s)));
    const idx = (s: string) => {
      const i = SIZE_ORDER.indexOf(s.toUpperCase());
      return i === -1 ? 99 : i;
    };
    return [...set].sort(
      (a, b) => idx(a) - idx(b) || a.localeCompare(b, undefined, { numeric: true })
    );
  }, [products]);

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (types.length && !types.includes(p.categoryLevel3 || "")) return false;
      if (sizes.length && !getProductSizes(p).some((s) => sizes.includes(s))) return false;
      if (priceActive && priceOf(p) > effectiveMax) return false;
      if (onSale && !isOnSale(p)) return false;
      if (inStock && !(p.stock > 0)) return false;
      if (newOnly && !p.isNewArrival) return false;
      return true;
    });

    const indexed = list.map((p, i) => ({ p, i }));
    const byIndex = (a: { i: number }, b: { i: number }) => a.i - b.i;
    switch (sort) {
      case "price-asc":
        indexed.sort((a, b) => priceOf(a.p) - priceOf(b.p) || byIndex(a, b));
        break;
      case "price-desc":
        indexed.sort((a, b) => priceOf(b.p) - priceOf(a.p) || byIndex(a, b));
        break;
      case "name-asc":
        indexed.sort((a, b) => a.p.name.localeCompare(b.p.name) || byIndex(a, b));
        break;
      case "newest":
        indexed.sort(
          (a, b) =>
            Number(!!b.p.isNewArrival) - Number(!!a.p.isNewArrival) ||
            (Date.parse(b.p.createdAt) || 0) - (Date.parse(a.p.createdAt) || 0) ||
            byIndex(a, b)
        );
        break;
      default:
        indexed.sort(
          (a, b) =>
            Number(!!b.p.isFeatured) - Number(!!a.p.isFeatured) ||
            Number(!!b.p.isTrending) - Number(!!a.p.isTrending) ||
            byIndex(a, b)
        );
    }
    return indexed.map((x) => x.p);
  }, [products, types, sizes, priceActive, effectiveMax, onSale, inStock, newOnly, sort]);

  const toggleType = useCallback(
    (t: string) => setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t])),
    []
  );
  const toggleSize = useCallback(
    (s: string) => setSizes((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s])),
    []
  );

  const reset = useCallback(() => {
    setTypes([]);
    setSizes([]);
    setMaxPrice(null);
    setOnSale(false);
    setInStock(false);
    setNewOnly(false);
  }, []);

  const chips: FilterChip[] = [
    ...types.map((t) => ({ key: `t-${t}`, label: t, clear: () => toggleType(t) })),
    ...sizes.map((s) => ({ key: `s-${s}`, label: `Size ${s}`, clear: () => toggleSize(s) })),
    ...(priceActive
      ? [{ key: "price", label: `Up to ${effectiveMax}`, clear: () => setMaxPrice(null) }]
      : []),
    ...(onSale ? [{ key: "sale", label: "On sale", clear: () => setOnSale(false) }] : []),
    ...(inStock ? [{ key: "stock", label: "In stock", clear: () => setInStock(false) }] : []),
    ...(newOnly ? [{ key: "new", label: "New", clear: () => setNewOnly(false) }] : []),
  ];

  // changes whenever the visible result set should restart from page 1
  const signature = JSON.stringify([types, sizes, maxPrice, onSale, inStock, newOnly, sort]);

  return {
    // data
    filtered,
    total: products.length,
    bounds,
    effectiveMax,
    typeCounts,
    sizeOptions,
    chips,
    activeCount: chips.length,
    signature,
    // state
    types,
    sizes,
    onSale,
    inStock,
    newOnly,
    sort,
    // actions
    toggleType,
    toggleSize,
    setMaxPrice,
    setOnSale,
    setInStock,
    setNewOnly,
    setSort,
    reset,
  };
};

export type ShopFilters = ReturnType<typeof useShopFilters>;