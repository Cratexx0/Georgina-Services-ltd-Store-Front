import { Product as ApiProduct } from "@/lib/type";
import { Product as LocalProduct, products as localProducts } from "@/data/products";
import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";

export const CLOTHING_SLUG = "clothes";
export const PLACEHOLDER_IMAGE = "/gina_logo.png";

export const localToApiProduct = (p: LocalProduct): ApiProduct => ({
  id: typeof p.id === "string" ? parseInt(p.id.replace(/\D/g, ""), 10) || 0 : p.id,
  name: p.name,
  slug: p.slug,
  description: p.description,
  price: p.price.toString(),
  discountPrice: p.discountPrice?.toString(),
  categoryLevel1: p.categoryId === "clothes" ? "Clothes" : p.categoryId,
  categoryLevel2: p.subcategoryId || null,
  categoryLevel3: null,
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

export const getProductImages = (product: FlexibleProduct): string[] => {
  const images = product.images?.filter(Boolean) ?? [];
  return images.length ? images : [PLACEHOLDER_IMAGE];
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
  const size = (product as ApiProduct).size;
  if (!size) return [];
  if (Array.isArray(size)) return size.filter((s) => typeof s === "string" && s.trim());
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
