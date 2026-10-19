// src/pages/Compare.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Download, GitCompare, ShoppingBag, X } from "lucide-react";
import { useCompare, MAX_COMPARE } from "@/context/Comparecontext";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/type";
import { getProductImages, getProductSizes, handleImageError } from "@/lib/productUtils";
import { formatPrice } from "@/lib/Audience";
import { productPath } from "@/lib/CardsForm";
import Layout from "@/components/layout/Layout";
// ---- defensive accessors: the Product type may not declare every field ----
const p = (product: Product) => product as any;

const getBrand = (x: Product) => p(x).brand ?? "";
const getCategory = (x: Product) => {
  const c = p(x).category;
  return typeof c === "object" && c ? c.name : c ?? "—";
};
const getColors = (x: Product): string[] => {
  const c = p(x).colors;
  if (!Array.isArray(c)) return [];
  return c.map((v: any) => (typeof v === "string" ? v : v?.name)).filter(Boolean);
};
const getSpecs = (x: Product): Record<string, string> => {
  const s = p(x).specs ?? p(x).specifications;
  if (!s) return {};
  if (Array.isArray(s)) {
    return Object.fromEntries(
      s.map((row: any) => [row.label ?? row.name ?? row.key, String(row.value ?? "")]).filter(([k]) => k)
    );
  }
  return Object.fromEntries(Object.entries(s).map(([k, v]) => [k, String(v)]));
};

const EMPTY = <span className="text-muted-foreground/50">—</span>;

// ---- small image carousel for each product header ----
const ProductImages = ({ product }: { product: Product }) => {
  const images = getProductImages(product);
  const [i, setI] = useState(0);
  const go = (d: number) => setI((cur) => (cur + d + images.length) % images.length);

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl bg-muted/40">
      <img
        src={images[i]}
        alt={product.name}
        onError={handleImageError}
        className="h-full w-full object-contain p-6"
      />
      {images.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/80 shadow"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-background/80 shadow"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all ${idx === i ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Row = ({ label, cols, children }: { label: string; cols: number; children: React.ReactNode }) => (
  <div className="grid items-stretch gap-4" style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(0, 1fr))` }}>
    <div className="flex items-center px-3 text-sm text-muted-foreground">{label}</div>
    {children}
  </div>
);

const Cell = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center rounded-xl bg-muted/30 px-4 py-4 text-sm">{children}</div>
);

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const cols = compareItems.length;

  

  if (cols === 0) {
    return (
        <Layout>

      <main className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <GitCompare className="h-10 w-10 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">Nothing to compare yet</h1>
        <p className="max-w-sm text-muted-foreground">
          Tap the compare icon on up to {MAX_COMPARE} products and they'll show up here side by side.
        </p>
        <Link to="/category/clothes" className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground">
          Browse products
        </Link>
      </main>
        </Layout>
    );
  }

  // union of spec names across all selected products, in first-seen order
  const specKeys: string[] = [];
  compareItems.forEach((item) =>
    Object.keys(getSpecs(item)).forEach((k) => {
      if (!specKeys.includes(k)) specKeys.push(k);
    })
  );

  const cartSize = (item: Product) => getProductSizes(item)[0] ?? "";

  return (
    <Layout >
    <main className="container mx-auto space-y-10 px-4 py-10 print:py-0">
      {/* heading */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-primary">
            <GitCompare className="h-4 w-4" /> Compare
          </p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight">Side by side</h1>
          <p className="mt-1 text-muted-foreground">Compare up to {MAX_COMPARE} products to find your perfect match.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium hover:bg-muted/50"
          >
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button
            type="button"
            onClick={clearCompare}
            className="rounded-full border border-white/10 px-4 py-2 text-sm text-muted-foreground hover:bg-muted/50"
          >
            Clear all
          </button>
        </div>
      </header>

      <div className="space-y-4 overflow-x-auto">
        <div className="min-w-[760px] space-y-4">
          {/* product header cards */}
          <Row label="" cols={cols}>
            {compareItems.map((item) => {
              const price = Number(item.price);
              const sale = item.discountPrice ? Number(item.discountPrice) : 0;
              const hasSale = sale > 0 && sale < price;
              const out = item.stock === 0;
              return (
                <div key={item.id} className="relative flex flex-col gap-3 rounded-2xl border border-white/10 bg-muted/20 p-4">
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => removeFromCompare(item.id)}
                    className="absolute right-6 top-6 z-10 grid h-8 w-8 place-items-center rounded-full bg-background/80 shadow print:hidden"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <ProductImages product={item} />
                  <div>
                    {getBrand(item) && (
                      <p className="text-xs uppercase tracking-wide text-muted-foreground">{getBrand(item)}</p>
                    )}
                    <Link to={productPath(item.slug)} className="font-semibold hover:underline">
                      {item.name}
                    </Link>
                    <p className="mt-1 font-bold text-primary">
                      {formatPrice(hasSale ? sale : price)}
                      {hasSale && (
                        <span className="ml-2 text-xs font-normal text-muted-foreground line-through">
                          {formatPrice(price)}
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={out}
                    onClick={() => addToCart(item, 1, cartSize(item))}
                    className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-primary/15 py-2.5 text-sm font-medium text-primary transition hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-50 print:hidden"
                  >
                    <ShoppingBag className="h-4 w-4" /> {out ? "Sold out" : "Add to cart"}
                  </button>
                </div>
              );
            })}
          </Row>

          {/* overview */}
          <Row label="Category" cols={cols}>
            {compareItems.map((x) => <Cell key={x.id}>{getCategory(x)}</Cell>)}
          </Row>

          <Row label="Rating" cols={cols}>
            {compareItems.map((x) => {
              const rating = p(x).rating;
              const reviews = p(x).reviewCount ?? p(x).reviews;
              return (
                <Cell key={x.id}>
                  {rating ? (
                    <>
                      {Number(rating).toFixed(1)} ★
                      {typeof reviews === "number" && (
                        <span className="ml-1 text-muted-foreground">({reviews.toLocaleString()})</span>
                      )}
                    </>
                  ) : EMPTY}
                </Cell>
              );
            })}
          </Row>

          <Row label="In stock" cols={cols}>
            {compareItems.map((x) => (
              <Cell key={x.id}>
                {x.stock > 0 ? <span className="text-green-500">✓</span> : <span className="text-red-500">Sold out</span>}
              </Cell>
            ))}
          </Row>

          <Row label="Colors" cols={cols}>
            {compareItems.map((x) => {
              const c = getColors(x);
              return <Cell key={x.id}>{c.length ? c.join(", ") : EMPTY}</Cell>;
            })}
          </Row>

          <Row label="Variants" cols={cols}>
            {compareItems.map((x) => {
              const s = getProductSizes(x);
              return <Cell key={x.id}>{s.length ? s.join(", ") : EMPTY}</Cell>;
            })}
          </Row>

          {/* specifications */}
          {specKeys.length > 0 && (
            <>
              <p className="pt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Specifications</p>
              {specKeys.map((key) => (
                <Row key={key} label={key} cols={cols}>
                  {compareItems.map((x) => {
                    const v = getSpecs(x)[key];
                    return <Cell key={x.id}>{v || EMPTY}</Cell>;
                  })}
                </Row>
              ))}
            </>
          )}
        </div>
      </div>
    </main>
    </Layout>
  );
};

export default Compare;