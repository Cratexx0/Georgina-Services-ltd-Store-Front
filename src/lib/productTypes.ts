// Unified product type that works with both API and local fallback products
import { Product as ApiProduct } from '@/lib/type';
import { Product as LocalProduct } from '@/data/products';

// Union type that accepts both product formats
export type FlexibleProduct = ApiProduct | LocalProduct;

// Type guard to check if it's an API product
export const isApiProduct = (product: FlexibleProduct): product is ApiProduct => {
  return 'categoryLevel1' in product;
};

// Type guard to check if it's a local product
export const isLocalProduct = (product: FlexibleProduct): product is LocalProduct => {
  return 'categoryId' in product;
};

// Helper to get product ID as string
export const getProductId = (product: FlexibleProduct): string | number => {
  return product.id;
};

// Helper to get product slug
export const getProductSlug = (product: FlexibleProduct): string => {
  return product.slug;
};

// Helper to get price as number
export const getPrice = (product: FlexibleProduct): number => {
  if (typeof product.price === 'string') {
    return parseFloat(product.price);
  }
  return product.price;
};

// Helper to get discount price as number or undefined
export const getDiscountPrice = (product: FlexibleProduct): number | undefined => {
  if (!product.discountPrice) return undefined;
  if (typeof product.discountPrice === 'string') {
    return parseFloat(product.discountPrice);
  }
  return product.discountPrice;
};

// Helper to check if product is in wishlist (needs product id)
export const getProductIdForWishlist = (product: FlexibleProduct): number => {
  if (typeof product.id === 'number') {
    return product.id;
  }
  // Convert string id to a number for wishlist compatibility
  return parseInt(product.id, 10) || 0;
};
