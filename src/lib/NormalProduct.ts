// src/lib/normalizeProduct.ts
// Your API returns Product (lib/api) where `size` is a string, while the UI uses
// Product (lib/type) where `size` is string[]. This converts one into the other
// in a single place so the pages stay type-safe.
import type { Product } from "@/lib/type";

const toSizeArray = (size: unknown): string[] => {
  if (Array.isArray(size)) return size.map(String).map((s) => s.trim()).filter(Boolean);
  if (typeof size === "string") {
    return size
      .split(/[,/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const normalizeProduct = (p: any): Product =>
  ({ ...p, size: toSizeArray(p?.size) }) as Product;