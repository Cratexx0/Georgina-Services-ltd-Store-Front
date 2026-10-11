// src/data/clothingProducts.ts
// Ankara / African-print catalogue for Women, Men and Kids.
//
// IMAGES: products have no images yet, so the fallback array PLACEHOLDER_IMAGES
// (src/lib/productUtils.ts) is shown. To give a product real photos, add
//   images: ["https://...", "https://..."]   to its entry below.
//
// PLACEHOLDERS: prices, stock, colours are starting values — replace with your real ones.
// rating and likes are 0 on purpose so no fake social proof is shown.

import type { Product } from "../data/products";

type Audience = "women" | "men" | "kids";

interface Seed {
  id: string;
  audience: Audience;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  sizes?: string[];
  colors?: string[];
  stock?: number;
  images?: string[]; // optional real product images
  featured?: boolean;
  trending?: boolean;
  newArrival?: boolean;
}

const ADULT = ["S", "M", "L", "XL", "XXL"];
const MEN = ["M", "L", "XL", "XXL"];
const KIDS = ["2Y", "4Y", "6Y", "8Y", "10Y"];
const BABY = ["0-3M", "3-6M", "6-12M"];

const toProduct = (s: Seed): Product => ({
  id: s.id,
  name: s.name,
  description: s.description,
  price: s.price,
  ...(s.discountPrice ? { discountPrice: s.discountPrice } : {}),
  images: s.images ?? [],
  categoryId: "clothes",
  subcategoryId: s.audience,
  rating: 0,
  likes: 0,
  stock: s.stock ?? 30,
  slug: s.slug,
  ...(s.featured ? { featured: true } : {}),
  ...(s.trending ? { trending: true } : {}),
  ...(s.newArrival ? { newArrival: true } : {}),
  ...(s.sizes ? { sizes: s.sizes } : {}),
  ...(s.colors ? { colors: s.colors } : {}),
});

const seeds: Seed[] = [
  // ───────────── WOMEN ─────────────
  { id: "w1", audience: "women", name: "African Print Maxi Dress", slug: "african-print-maxi-dress", description: "Floor-length African print maxi dress in vibrant wax print cotton.", price: 89.99, discountPrice: 69.99, sizes: ADULT, colors: ["Multi"], featured: true, trending: true },
  { id: "w2", audience: "women", name: "African Print Blouse", slug: "african-print-blouse", description: "Easy-to-style African print blouse for casual and formal occasions.", price: 49.99, sizes: ADULT, colors: ["Multi", "Red", "Blue"] },
  { id: "w3", audience: "women", name: "Traditional African Wear Set", slug: "traditional-african-wear-set", description: "Matching top and wrapper set for weddings, church and special occasions.", price: 129.99, sizes: ADULT, colors: ["Gold", "Royal Blue", "Purple"], featured: true },
  { id: "w4", audience: "women", name: "African Wear Kaftan", slug: "african-wear-kaftan", description: "Relaxed kaftan with intricate embroidery, easy to dress up or down.", price: 95.99, sizes: ADULT, colors: ["White", "Cream", "Black"], newArrival: true },
  { id: "w5", audience: "women", name: "Ankara Maxi Dress", slug: "ankara-maxi-dress", description: "Bold Ankara maxi dress with a flattering flowing silhouette.", price: 85.99, sizes: ADULT, colors: ["Multi"], trending: true },
  { id: "w6", audience: "women", name: "Ankara Pencil Skirt", slug: "ankara-pencil-skirt", description: "Fitted Ankara pencil skirt for the office or an evening out.", price: 45.99, sizes: ADULT, colors: ["Multi", "Red", "Green"] },
  { id: "w9", audience: "women", name: "Ankara Peplum Dress", slug: "ankara-peplum-dress", description: "Fitted bodice with a flared peplum waist in a statement Ankara print.", price: 79.99, sizes: ADULT, colors: ["Multi"], newArrival: true },
  { id: "w10", audience: "women", name: "Ankara Wrap Dress", slug: "ankara-wrap-dress", description: "Adjustable wrap dress that flatters every shape.", price: 74.99, sizes: ADULT, colors: ["Multi", "Orange", "Teal"] },
  { id: "w11", audience: "women", name: "Ankara Off-Shoulder Dress", slug: "ankara-off-shoulder-dress", description: "Off-shoulder Ankara dress for parties and celebrations.", price: 82.99, sizes: ADULT, colors: ["Multi"], trending: true },
  { id: "w12", audience: "women", name: "Ankara Mermaid Gown", slug: "ankara-mermaid-gown", description: "Show-stopping fitted gown with a flared mermaid hem.", price: 139.99, sizes: ADULT, colors: ["Multi", "Gold"], featured: true, stock: 15 },
  { id: "w13", audience: "women", name: "Ankara Puff-Sleeve Blouse", slug: "ankara-puff-sleeve-blouse", description: "Statement puff-sleeve blouse that pairs with skirts and trousers.", price: 44.99, sizes: ADULT, colors: ["Multi", "Yellow", "Blue"] },
  { id: "w14", audience: "women", name: "Ankara Palazzo Trousers", slug: "ankara-palazzo-trousers", description: "Wide-leg palazzo trousers in a bold, breathable print.", price: 54.99, sizes: ADULT, colors: ["Multi"] },
  { id: "w15", audience: "women", name: "Ankara Skirt and Blouse Set", slug: "ankara-skirt-and-blouse-set", description: "Coordinated two-piece set — one outfit, zero effort.", price: 99.99, sizes: ADULT, colors: ["Multi", "Green", "Red"], featured: true },
  { id: "w16", audience: "women", name: "Ankara Jumpsuit", slug: "ankara-jumpsuit", description: "Tailored Ankara jumpsuit with a belted waist.", price: 89.99, sizes: ADULT, colors: ["Multi"], newArrival: true },

  // ───────────── MEN ─────────────
  { id: "m1", audience: "men", name: "Men's African Wear Dashiki", slug: "mens-african-wear-dashiki", description: "Traditional dashiki with embroidered neckline.", price: 79.99, sizes: MEN, colors: ["White", "Black", "Blue", "Gold"], featured: true },
  { id: "m2", audience: "men", name: "African Senator Suit", slug: "african-senator-suit", description: "Elegant senator-style suit for formal occasions.", price: 149.99, discountPrice: 129.99, sizes: MEN, colors: ["White", "Navy", "Burgundy"], trending: true, stock: 15 },
  { id: "m3", audience: "men", name: "Men's African Print Trousers", slug: "mens-african-print-trousers", description: "Comfortable straight-cut trousers in African print.", price: 69.99, discountPrice: 54.99, sizes: MEN, colors: ["Multi", "Brown", "Navy"] },
  { id: "m4", audience: "men", name: "Men's Ankara Short-Sleeve Shirt", slug: "mens-ankara-short-sleeve-shirt", description: "Slim-fit short-sleeve shirt in a bold Ankara print.", price: 44.99, sizes: MEN, colors: ["Multi", "Blue", "Orange"], newArrival: true },
  { id: "m5", audience: "men", name: "Men's Ankara Long-Sleeve Shirt", slug: "mens-ankara-long-sleeve-shirt", description: "Long-sleeve Ankara shirt that works for the office or a party.", price: 54.99, sizes: MEN, colors: ["Multi", "Green"] },
  { id: "m6", audience: "men", name: "Men's Ankara Shirt and Trousers Set", slug: "mens-ankara-shirt-and-trousers-set", description: "Matching two-piece set ready for weddings and celebrations.", price: 109.99, sizes: MEN, colors: ["Multi", "Navy"], featured: true },
  { id: "m7", audience: "men", name: "Men's Ankara Kaftan Set", slug: "mens-ankara-kaftan-set", description: "Kaftan top with matching trousers in Ankara print.", price: 119.99, sizes: MEN, colors: ["Multi", "Gold"], trending: true },
  { id: "m8", audience: "men", name: "Men's Ankara Agbada", slug: "mens-ankara-agbada", description: "Three-piece agbada with Ankara detailing for ceremonial wear.", price: 179.99, sizes: MEN, colors: ["Multi", "Royal Blue"], stock: 10 },
  { id: "m9", audience: "men", name: "Men's Ankara Bomber Jacket", slug: "mens-ankara-bomber-jacket", description: "Lightweight bomber with an Ankara print shell.", price: 89.99, sizes: MEN, colors: ["Multi"], newArrival: true },
  { id: "m10", audience: "men", name: "Men's Ankara Waistcoat", slug: "mens-ankara-waistcoat", description: "Tailored waistcoat to layer over a plain shirt.", price: 59.99, sizes: MEN, colors: ["Multi"] },
  { id: "m11", audience: "men", name: "Men's Ankara Shorts", slug: "mens-ankara-shorts", description: "Relaxed Ankara shorts for warm days.", price: 34.99, sizes: MEN, colors: ["Multi", "Blue"] },

  // ───────────── KIDS ─────────────
  { id: "k1", audience: "kids", name: "Kids African Wear Complete Outfit", slug: "kids-african-wear-complete-outfit", description: "Complete African wear outfit with matching accessories.", price: 49.99, sizes: KIDS, colors: ["Multi", "Blue", "Pink", "Yellow"], featured: true, newArrival: true },
  { id: "k2", audience: "kids", name: "Children's Traditional Dashiki Set", slug: "childrens-traditional-dashiki-set", description: "Traditional dashiki set for boys and girls.", price: 45.99, sizes: KIDS, colors: ["Red", "Gold", "Green", "Purple"] },
  { id: "k3", audience: "kids", name: "Kids Ankara Dress", slug: "kids-ankara-dress", description: "Playful Ankara dress for girls in vibrant patterns.", price: 39.99, sizes: KIDS, colors: ["Multi", "Pink", "Blue"], trending: true },
  { id: "k4", audience: "kids", name: "Girls' Ankara Puff-Sleeve Dress", slug: "girls-ankara-puff-sleeve-dress", description: "Twirl-worthy puff-sleeve dress for birthdays and festivals.", price: 42.99, sizes: KIDS, colors: ["Multi", "Yellow"], newArrival: true },
  { id: "k5", audience: "kids", name: "Girls' Ankara Skirt and Top Set", slug: "girls-ankara-skirt-and-top-set", description: "Comfortable two-piece set for everyday and special days.", price: 44.99, sizes: KIDS, colors: ["Multi", "Pink"] },
  { id: "k6", audience: "kids", name: "Boys' Ankara Shirt and Shorts Set", slug: "boys-ankara-shirt-and-shorts-set", description: "Smart-casual Ankara shirt and shorts set for boys.", price: 41.99, sizes: KIDS, colors: ["Multi", "Blue"] },
  { id: "k7", audience: "kids", name: "Kids Ankara Mini Kaftan", slug: "kids-ankara-mini-kaftan", description: "Mini kaftan with matching trousers for little gentlemen.", price: 38.99, sizes: KIDS, colors: ["Multi", "Gold"] },
  { id: "k8", audience: "kids", name: "Ankara Baby Onesie", slug: "ankara-baby-onesie", description: "Soft cotton onesie in cheerful Ankara print.", price: 19.99, sizes: BABY, colors: ["Multi"], stock: 50 },
  { id: "k9", audience: "kids", name: "Mother and Daughter Ankara Dress Pair", slug: "mother-daughter-ankara-dress-pair", description: "Matching dresses in the same print — adult and child sizes in one order.", price: 89.99, sizes: KIDS, colors: ["Multi"], featured: true, stock: 20 },
  { id: "k10", audience: "kids", name: "Father and Son Ankara Shirt Pair", slug: "father-son-ankara-shirt-pair", description: "Matching shirts for dad and son in the same Ankara print.", price: 79.99, sizes: KIDS, colors: ["Multi"], stock: 20 },
];

export const clothingProducts: Product[] = seeds.map(toProduct);