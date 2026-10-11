// import { Product as ApiProduct } from "@/lib/type";
// import { Product as LocalProduct, products as localProducts } from "@/data/products";
// import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";
// import type { SyntheticEvent } from "react";

// export const CLOTHING_SLUG = "clothes";
// // Fallback images, shown when a product has no images or one fails to load.
// // Paste your Unsplash URLs here — the gallery shows every one of them.
// export const PLACEHOLDER_IMAGES: string[] = [
//   "https://images.unsplash.com/photo-1601653233006-5c9fd30eab12?w=600&auto=format&fit=crop&q=60",
//   "https://images.unsplash.com/photo-1746116572566-7e14bd735f6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1550393705-1ce798914528?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1627595359082-cc2b3487a40b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1643014205087-13f5861f1479?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//   "https://images.unsplash.com/photo-1687052249895-82122b115c52?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
// "https://plus.unsplash.com/premium_photo-1769339044484-55a59420f7e0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
// "https://images.unsplash.com/photo-1637932053449-40e8ee48b5f6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
// "https://images.unsplash.com/photo-1688990171710-219c986ae637?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
// "https://images.unsplash.com/photo-1663044023568-fd61ca7174cb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
// 'https://plus.unsplash.com/premium_photo-1769339044734-4f96667ed426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D'
// ];

// // Kept so any file that still imports PLACEHOLDER_IMAGE keeps working.
// export const PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGES[0];

// // Gives each product its own starting fallback image (so cards don't all look the same).
// // Same product always gets the same one; duplicates in PLACEHOLDER_IMAGES are ignored.
// const hashString = (s: string): number => {
//   let h = 0;
//   for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
//   return h;
// };

// const placeholdersFor = (product: FlexibleProduct): string[] => {
//   const list = [...new Set(PLACEHOLDER_IMAGES.filter(Boolean))];
//   if (list.length < 2) return list;
//   const start = hashString(String(product.slug ?? "")) % list.length;
//   return [...list.slice(start), ...list.slice(0, start)];
// };

// // Order matters: the first matching rule wins ("Skirt and Blouse Set" -> Sets, not Bottoms).
// const TYPE_RULES: [RegExp, string][] = [
//   [/bonnet|headwrap|gele|tote|bag|bow tie|pocket square/i, "Accessories"],
//   [/\bset\b|\bpair\b|suit|outfit/i, "Sets"],
//   [/kaftan|dashiki|agbada|boubou|buba/i, "Traditional"],
//   [/jacket|bomber|waistcoat|blazer/i, "Outerwear"],
//   [/dress|gown|jumpsuit|romper|onesie/i, "Dresses"],
//   [/blouse|shirt|\btop\b|crop/i, "Tops"],
//   [/skirt|trouser|pants|palazzo|shorts|culotte|jogger/i, "Bottoms"],
// ];

// export const deriveProductType = (name: string): string | null => {
//   const hit = TYPE_RULES.find(([re]) => re.test(name));
//   return hit ? hit[1] : null;
// };

// export const localToApiProduct = (p: LocalProduct): ApiProduct => ({
//   id: typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, ""), 10) || 0 : p.id,
//   name: p.name,
//   slug: p.slug,
//   description: p.description,
//   price: p.price.toString(),
//   discountPrice: p.discountPrice?.toString(),
//   categoryLevel1: p.categoryId === "clothes" ? "Clothes" : p.categoryId,
//   categoryLevel2: p.subcategoryId || null,
//   // Powers the "type" pills on the category page (Dresses, Sets, Tops...)
//   categoryLevel3: p.categoryId === "clothes" ? deriveProductType(p.name) : null,
//   serviceType: "physical",
//   serviceDuration: null,
//   unit: "piece",
//   stock: p.stock,
//   images: p.images,
//   isActive: true,
//   tags: [],
//   brand: null,
//   isFeatured: p.featured || false,
//   isTrending: p.trending || false,
//   isNewArrival: p.newArrival || false,
//   featuredOrder: 0,
//   trendingOrder: 0,
//   newArrivalOrder: 0,
//   wishList: false,
//   size: p.sizes || [],
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString(),
// });

// export const isClothingProduct = (product: FlexibleProduct): boolean => {
//   if ("categoryId" in product) {
//     return product.categoryId === "clothes" || product.categoryId === CLOTHING_SLUG;
//   }
//   const level1 = (product.categoryLevel1 || "").toLowerCase();
//   return level1.includes("cloth") || level1 === "fashion";
// };

// // Returns every image of the product (de-duplicated, empty entries removed).
// // Falls back to the placeholder array only when the product has no images at all.
// export const getProductImages = (product: FlexibleProduct): string[] => {
//   const images = [...new Set((product.images ?? []).filter(Boolean))];
//   return images.length ? images : placeholdersFor(product);
// };

// // Use on any <img>: onError={handleImageError}
// // A missing / broken image steps through PLACEHOLDER_IMAGES one by one, then stops (no loops).
// export const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
//   const img = e.currentTarget;
//   const next = Number(img.dataset.fallbackIndex ?? "-1") + 1;
//   if (next >= PLACEHOLDER_IMAGES.length) return;
//   img.dataset.fallbackIndex = String(next);
//   img.src = PLACEHOLDER_IMAGES[next];
// };

// export const getNumericPrice = (product: FlexibleProduct): number => {
//   const discounted = getDiscountPrice(product);
//   return discounted ?? getPrice(product);
// };

// export const getDiscountPercent = (product: FlexibleProduct): number => {
//   const original = getPrice(product);
//   const discounted = getDiscountPrice(product);
//   if (!discounted || !original) return 0;
//   return Math.round((1 - discounted / original) * 100);
// };

// export const getProductSizes = (product: FlexibleProduct): string[] => {
//   if ("sizes" in product && Array.isArray(product.sizes)) {
//     return product.sizes.filter(Boolean);
//   }
//   // `size` can arrive as a string ("S, M, L") or an array depending on the source,
//   // so treat it as unknown instead of trusting the declared type.
//   const size: unknown = (product as ApiProduct).size;
//   if (Array.isArray(size)) {
//     return size.filter((s): s is string => typeof s === "string" && s.trim() !== "");
//   }
//   if (typeof size === "string") {
//     return size.split(",").map((s) => s.trim()).filter(Boolean);
//   }
//   return [];
// };

// export const getProductColors = (product: FlexibleProduct): string[] => {
//   if ("colors" in product && Array.isArray(product.colors)) {
//     return product.colors.filter(Boolean);
//   }
//   return [];
// };

// export const getProductRating = (product: FlexibleProduct): number | undefined => {
//   if ("rating" in product && typeof product.rating === "number") return product.rating;
//   return undefined;
// };

// export const getLocalClothingProducts = (): ApiProduct[] =>
//   localProducts.filter((p) => p.categoryId === "clothes").map(localToApiProduct);

// export const getLocalProductsByCategory = (categorySlug: string): ApiProduct[] => {
//   if (categorySlug === CLOTHING_SLUG || categorySlug === "clothes") {
//     return getLocalClothingProducts();
//   }
//   return localProducts
//     .filter((p) => p.categoryId === categorySlug)
//     .map(localToApiProduct);
// };

// export const searchLocalProducts = (query: string, clothingOnly = false): ApiProduct[] => {
//   const q = query.toLowerCase().trim();
//   if (!q) return [];
//   return localProducts
//     .filter((p) => {
//       if (clothingOnly && p.categoryId !== "clothes") return false;
//       return (
//         p.name.toLowerCase().includes(q) ||
//         p.description.toLowerCase().includes(q) ||
//         p.slug.toLowerCase().includes(q) ||
//         p.subcategoryId.toLowerCase().includes(q)
//       );
//     })
//     .map(localToApiProduct);
// };

// const RECENT_KEY = "recently_viewed_products";

// export const addRecentlyViewed = (product: FlexibleProduct) => {
//   try {
//     const existing: FlexibleProduct[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
//     const next = [product, ...existing.filter((p) => p.slug !== product.slug)].slice(0, 8);
//     localStorage.setItem(RECENT_KEY, JSON.stringify(next));
//   } catch {
//     /* ignore */
//   }
// };

// export const getRecentlyViewed = (excludeSlug?: string): FlexibleProduct[] => {
//   try {
//     const existing: FlexibleProduct[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
//     return existing.filter((p) => p.slug !== excludeSlug);
//   } catch {
//     return [];
//   }
// };

import { Product as ApiProduct } from "@/lib/type";
import { Product as LocalProduct, products as localProducts } from "@/data/products";
import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";
import type { SyntheticEvent } from "react";

export const CLOTHING_SLUG = "clothes";
// Fallback images, shown when a product has no images or one fails to load.
// Paste your Unsplash URLs here — the gallery shows every one of them.
export const PLACEHOLDER_IMAGES: string[] = [
  "https://images.unsplash.com/photo-1601653233006-5c9fd30eab12?w=600&auto=format&fit=crop&q=60",
  "https://images.unsplash.com/photo-1746116572566-7e14bd735f6f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1618354690420-1f3e5c8b6d4e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1550393705-1ce798914528?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1627595359082-cc2b3487a40b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
  "https://images.unsplash.com/photo-1643014205087-13f5861f1479?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D"

];

// Kept so any file that still imports PLACEHOLDER_IMAGE keeps working.
export const PLACEHOLDER_IMAGE = PLACEHOLDER_IMAGES[0];

// Gives each product its own starting fallback image (so cards don't all look the same).
// Same product always gets the same one; duplicates in PLACEHOLDER_IMAGES are ignored.
const hashString = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

const placeholdersFor = (product: FlexibleProduct): string[] => {
  const list = [...new Set(PLACEHOLDER_IMAGES.filter(Boolean))];
  if (list.length < 2) return list;
  const start = hashString(String(product.slug ?? "")) % list.length;
  return [...list.slice(start), ...list.slice(0, start)];
};

// Clothing categories shown as the "type" filter. Order matters: the first matching rule wins
// (e.g. "Skirt and Blouse Set" -> Two-Piece Sets, not Skirts).
const TYPE_RULES: [RegExp, string][] = [
  [/\bpair\b|matching/i, "Matching Sets"],
  [/baby|onesie/i, "Baby Wear"],
  [/\bset\b|\bsuit\b|outfit/i, "Two-Piece Sets"],
  [/kaftan|dashiki|agbada|boubou|buba/i, "Traditional Wear"],
  [/jacket|bomber|waistcoat|blazer/i, "Jackets & Waistcoats"],
  [/dress|gown/i, "Dresses & Gowns"],
  [/jumpsuit|romper/i, "Jumpsuits"],
  [/blouse|shirt|\btop\b|crop/i, "Tops & Shirts"],
  [/skirt/i, "Skirts"],
  [/trouser|pants|palazzo|shorts|culotte|jogger/i, "Trousers & Shorts"],
];

export const deriveProductType = (name: string): string | null => {
  const hit = TYPE_RULES.find(([re]) => re.test(name));
  return hit ? hit[1] : null;
};

export const localToApiProduct = (p: LocalProduct): ApiProduct => ({
  id: typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, ""), 10) || 0 : p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: p.price.toString(),
  discountPrice: p.discountPrice?.toString(),
  categoryLevel1: p.categoryId === "clothes" ? "Clothes" : p.categoryId,
  categoryLevel2: p.subcategoryId || null,
  // Powers the "type" pills on the category page (Dresses, Sets, Tops...)
  categoryLevel3: p.categoryId === "clothes" ? deriveProductType(p.name) : null,
  serviceType: "physical",
  serviceDuration: null,
  unit: "piece",
  stock: p.stock,
  images: p.images,
  isActive: true,
  tags: [],
  brand: null,
  isFeatured: p.featured || false,
  isTrending: p.trending || false,
  isNewArrival: p.newArrival || false,
  featuredOrder: 0,
  trendingOrder: 0,
  newArrivalOrder: 0,
  wishList: false,
  size: p.sizes || [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const isClothingProduct = (product: FlexibleProduct): boolean => {
  if ("categoryId" in product) {
    return product.categoryId === "clothes" || product.categoryId === CLOTHING_SLUG;
  }
  const level1 = (product.categoryLevel1 || "").toLowerCase();
  return level1.includes("cloth") || level1 === "fashion";
};

// Returns every image of the product (de-duplicated, empty entries removed).
// Falls back to the placeholder array only when the product has no images at all.
export const getProductImages = (product: FlexibleProduct): string[] => {
  const images = [...new Set((product.images ?? []).filter(Boolean))];
  return images.length ? images : placeholdersFor(product);
};

// Use on any <img>: onError={handleImageError}
// A missing / broken image steps through PLACEHOLDER_IMAGES one by one, then stops (no loops).
export const handleImageError = (e: SyntheticEvent<HTMLImageElement>) => {
  const img = e.currentTarget;
  const next = Number(img.dataset.fallbackIndex ?? "-1") + 1;
  if (next >= PLACEHOLDER_IMAGES.length) return;
  img.dataset.fallbackIndex = String(next);
  img.src = PLACEHOLDER_IMAGES[next];
};

export const getNumericPrice = (product: FlexibleProduct): number => {
  const discounted = getDiscountPrice(product);
  return discounted ?? getPrice(product);
};

export const getDiscountPercent = (product: FlexibleProduct): number => {
  const original = getPrice(product);
  const discounted = getDiscountPrice(product);
  if (!discounted || !original) return 0;
  return Math.round((1 - discounted / original) * 100);
};

export const getProductSizes = (product: FlexibleProduct): string[] => {
  if ("sizes" in product && Array.isArray(product.sizes)) {
    return product.sizes.filter(Boolean);
  }
  // `size` can arrive as a string ("S, M, L") or an array depending on the source,
  // so treat it as unknown instead of trusting the declared type.
  const size: unknown = (product as ApiProduct).size;
  if (Array.isArray(size)) {
    return size.filter((s): s is string => typeof s === "string" && s.trim() !== "");
  }
  if (typeof size === "string") {
    return size.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
};

export const getProductColors = (product: FlexibleProduct): string[] => {
  if ("colors" in product && Array.isArray(product.colors)) {
    return product.colors.filter(Boolean);
  }
  return [];
};

export const getProductRating = (product: FlexibleProduct): number | undefined => {
  if ("rating" in product && typeof product.rating === "number") return product.rating;
  return undefined;
};

export const getLocalClothingProducts = (): ApiProduct[] =>
  localProducts.filter((p) => p.categoryId === "clothes").map(localToApiProduct);

export const getLocalProductsByCategory = (categorySlug: string): ApiProduct[] => {
  if (categorySlug === CLOTHING_SLUG || categorySlug === "clothes") {
    return getLocalClothingProducts();
  }
  return localProducts
    .filter((p) => p.categoryId === categorySlug)
    .map(localToApiProduct);
};

export const searchLocalProducts = (query: string, clothingOnly = false): ApiProduct[] => {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return localProducts
    .filter((p) => {
      if (clothingOnly && p.categoryId !== "clothes") return false;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.subcategoryId.toLowerCase().includes(q)
      );
    })
    .map(localToApiProduct);
};

const RECENT_KEY = "recently_viewed_products";

export const addRecentlyViewed = (product: FlexibleProduct) => {
  try {
    const existing: FlexibleProduct[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    const next = [product, ...existing.filter((p) => p.slug !== product.slug)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
};

export const getRecentlyViewed = (excludeSlug?: string): FlexibleProduct[] => {
  try {
    const existing: FlexibleProduct[] = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    return existing.filter((p) => p.slug !== excludeSlug);
  } catch {
    return [];
  }
};