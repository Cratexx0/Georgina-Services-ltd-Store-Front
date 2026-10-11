


import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import StoreProductCard from "../lib/CardsForm";
import ShopFilterPanel, { SortSelect } from "../lib/CardFilters";
import { useShopFilters, priceOf } from "../lib/Useshopfilters";
import { apiService, Category } from "@/lib/api";
import { Product } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { ChevronRight, SlidersHorizontal, Sparkles, X } from "lucide-react";
import { fallbackCategories } from "@/data/categories";
import { getLocalProductsByCategory } from "@/lib/productUtils";
import ErrorState from "@/components/common/ErrorState";
import { ProductGridSkeleton } from "@/components/Loader/SkeletonLoader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { AUDIENCE_META, detectAudience, formatPrice } from "@/lib/Audience";
import { normalizeProduct } from "@/lib/NormalProduct";

const PAGE_SIZE = 12;

const toLocalCategory = (): Category[] =>
  fallbackCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    level: 1,
    parentId: null,
    description: cat.description,
    sortOrder: 0,
    isActive: true,
    createdAt: "",
    updatedAt: "",
    image: cat.image,
    subcategories: cat.subcategories,
  }));

const CategoryPage = () => {
  const { categorySlug, subcategorySlug } = useParams<{
    categorySlug: string;
    subcategorySlug?: string;
  }>();
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [subcategories, setSubcategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        setError(null);

        let categories: Category[] = [];
        try {
          categories = await apiService.getCategories();
        } catch {
          categories = toLocalCategory();
        }
        if (!categories?.length) categories = toLocalCategory();

        let currentCat =
          categories.find(
            (cat) => cat.slug === categorySlug && (cat.level === 1 || !cat.level)
          ) || categories.find((cat) => cat.slug === categorySlug) || null;

        if (!currentCat && categorySlug === "clothes") {
          currentCat = toLocalCategory().find((c) => c.slug === "clothes") || null;
        }

        if (!currentCat) {
          setError("Category not found");
          setLoading(false);
          return;
        }

        setCurrentCategory(currentCat);

        const currentSubcategories = categories.filter(
          (cat) => cat.level === 2 && cat.parentId === currentCat!.id
        );
        if (currentSubcategories.length) {
          setSubcategories(currentSubcategories);
        } else {
          const local = fallbackCategories.find((c) => c.slug === currentCat!.slug);
          setSubcategories(
            (local?.subcategories || []).map((sub) => ({
              id: sub.id,
              name: sub.name,
              slug: sub.slug,
              level: 2,
              parentId: currentCat!.id,
              description: sub.description || "",
              sortOrder: 0,
              isActive: true,
              createdAt: "",
              updatedAt: "",
            }))
          );
        }

        try {
          const response = await apiService.getProducts(1, 100, currentCat.name);
          const categoryProducts = (response.products || []).map(normalizeProduct).filter(
            (product) =>
              product.categoryLevel1?.toLowerCase() === currentCat!.name.toLowerCase()
          );
          setProducts(
            categoryProducts.length
              ? categoryProducts
              : getLocalProductsByCategory(currentCat.slug).map(normalizeProduct)
          );
        } catch {
          setProducts(getLocalProductsByCategory(currentCat.slug).map(normalizeProduct));
        }
      } catch {
        setError("Failed to load this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  // Smooth scroll to top whenever the route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [categorySlug, subcategorySlug]);

  const selectedSub = subcategories.find((sub) => sub.slug === subcategorySlug);

  const baseFiltered = useMemo(() => {
    if (!selectedSub) return products;
    return products.filter(
      (product) =>
        product.categoryLevel2?.toLowerCase() === selectedSub.name.toLowerCase() ||
        product.categoryLevel2?.toLowerCase() === selectedSub.slug
    );
  }, [products, selectedSub]);

  const filters = useShopFilters(baseFiltered);
  const { reset } = filters;

  // New section chosen -> start with a clean slate
  useEffect(() => {
    reset();
  }, [categorySlug, subcategorySlug, reset]);

  // Any filter / sort / section change -> back to the first page of results
  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [filters.signature, categorySlug, subcategorySlug]);

  // Audience (men / women / kids) drives copy and style tips
  const audience = detectAudience(subcategorySlug, selectedSub?.name, filters.types[0]);
  const meta = AUDIENCE_META[audience];

  // Small facts shown next to the title
  const insight = useMemo(() => {
    if (!baseFiltered.length) return null;
    const prices = baseFiltered.map(priceOf).filter((n) => n > 0);
    return {
      count: baseFiltered.length,
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
      onSale: baseFiltered.filter(
        (p) => p.discountPrice && Number(p.discountPrice) < Number(p.price)
      ).length,
    };
  }, [baseFiltered]);

  useEffect(() => {
    if (currentCategory) {
      document.title = `${selectedSub?.name || currentCategory.name} | Ankara Fashion`;
    }
  }, [currentCategory, selectedSub]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="mb-3 h-4 w-40 animate-pulse rounded bg-muted" />
          <div className="mb-8 h-9 w-64 animate-pulse rounded bg-muted" />
          <ProductGridSkeleton count={8} />
        </div>
      </Layout>
    );
  }

  if (error || !currentCategory) {
    return (
      <Layout>
        <ErrorState
          title="Category not found"
          message={error || "The category you're looking for doesn't exist."}
        />
      </Layout>
    );
  }

  const heading = filters.types.length === 1 ? filters.types[0] : selectedSub?.name || currentCategory.name;
  const description =
    selectedSub?.description || currentCategory.description || meta.tagline;
  const shown = filters.filtered.slice(0, visible);
  const progress = filters.filtered.length ? (shown.length / filters.filtered.length) * 100 : 0;

  return (
    <Layout>
      {/* ───────── Compact page header ───────── */}
      <header className="border-b">
        <div className="container mx-auto px-4 pb-5 pt-5 md:pb-6 md:pt-6">
          <nav
            aria-label="Breadcrumb"
            className="mb-2 flex flex-wrap items-center gap-1 text-xs text-muted-foreground md:text-sm"
          >
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            {subcategorySlug ? (
              <Link
                to={`/category/${currentCategory.slug}`}
                className="transition-colors hover:text-foreground"
              >
                {currentCategory.name}
              </Link>
            ) : (
              <span className="text-foreground">{currentCategory.name}</span>
            )}
            {selectedSub && (
              <>
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="text-foreground">{selectedSub.name}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between md:gap-6">
            <div>
              <h1 className="font-serif text-3xl leading-tight md:text-4xl">{heading}</h1>
              <p className="mt-1 line-clamp-1 max-w-2xl text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            {insight && (
              <p className="shrink-0 text-xs text-muted-foreground md:text-sm">
                {insight.count} style{insight.count !== 1 ? "s" : ""}
                {insight.max > 0 && (
                  <>
                    {" · "}
                    {formatPrice(insight.min)}
                    {insight.max !== insight.min ? ` – ${formatPrice(insight.max)}` : ""}
                  </>
                )}
                {insight.onSale > 0 && <> · {insight.onSale} on sale</>}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ───────── Men / Women / Kids switcher ───────── */}
      {subcategories.length > 0 && (
        <div className="sticky top-16 z-30 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto flex snap-x gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
            <Button
              variant={!subcategorySlug ? "default" : "outline"}
              size="sm"
              asChild
              className="flex-shrink-0 snap-start rounded-full transition-all"
            >
              <Link to={`/category/${currentCategory.slug}`}>All {currentCategory.name}</Link>
            </Button>
            {subcategories.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant={subcategorySlug === subcategory.slug ? "default" : "outline"}
                size="sm"
                asChild
                className="flex-shrink-0 snap-start rounded-full transition-all hover:-translate-y-0.5"
              >
                <Link to={`/category/${currentCategory.slug}/${subcategory.slug}`}>
                  {subcategory.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* ───────── Listing ───────── */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        {/* toolbar */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filters
              {filters.activeCount > 0 && (
                <span className="ml-2 grid h-5 min-w-5 place-items-center rounded-full bg-foreground px-1 text-[11px] text-background">
                  {filters.activeCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="hidden rounded-full lg:inline-flex"
              onClick={() => setShowFilters((v) => !v)}
              aria-expanded={showFilters}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? "Hide filters" : "Show filters"}
            </Button>
            <p className="text-xs text-muted-foreground md:text-sm" aria-live="polite">
              Showing {shown.length} of {filters.filtered.length}
            </p>
          </div>
          <SortSelect value={filters.sort} onChange={filters.setSort} />
        </div>

        {/* active filter chips */}
        {filters.chips.length > 0 && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {filters.chips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={chip.clear}
                className="inline-flex items-center gap-1.5 rounded-full border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-foreground"
              >
                {chip.label}
                <X className="h-3 w-3" />
              </button>
            ))}
            <button
              type="button"
              onClick={filters.reset}
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Clear all
            </button>
          </div>
        )}

        <div className={showFilters ? "lg:grid lg:grid-cols-[240px_1fr] lg:gap-10" : ""}>
          {showFilters && (
            <aside className="hidden lg:block">
              <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
                <ShopFilterPanel filters={filters} />
              </div>
            </aside>
          )}

          <div>
            {filters.filtered.length > 0 ? (
              <>
                <div
                  className={`grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 ${
                    showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4"
                  }`}
                >
                  {shown.map((product, i) => (
                    <StoreProductCard key={product.id} product={product} index={i} />
                  ))}
                </div>

                {shown.length < filters.filtered.length && (
                  <div className="mx-auto mt-12 max-w-xs text-center">
                    <p className="mb-2 text-xs text-muted-foreground">
                      You've viewed {shown.length} of {filters.filtered.length}
                    </p>
                    <div className="mb-4 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-foreground transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-full px-8"
                      onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    >
                      Load more
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-dashed py-20 text-center">
                <p className="mb-2 font-serif text-2xl">No pieces match yet</p>
                <p className="mb-5 text-muted-foreground">
                  Try clearing a filter or browse the full collection.
                </p>
                <Button variant="outline" className="rounded-full" onClick={filters.reset}>
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ───────── Style + sizing insight ───────── */}
      <section className="border-t bg-muted/40">
        <div className="container mx-auto grid gap-10 px-4 py-12 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 font-serif text-2xl md:text-3xl">
              Styling {meta.label === "Ankara" ? "Ankara" : `Ankara for ${meta.label.toLowerCase()}`}
            </h2>
            <ul className="space-y-3">
              {meta.styling.map((tip) => (
                <li key={tip} className="flex gap-3 text-muted-foreground">
                  <Sparkles className="mt-1 h-4 w-4 shrink-0 text-foreground/60" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-4 font-serif text-2xl md:text-3xl">
              Size guide <span className="text-base text-muted-foreground">({meta.sizeSystem})</span>
            </h2>
            <div className="overflow-x-auto rounded-lg border bg-background">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    {meta.sizeChart.headers.map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meta.sizeChart.rows.map((row) => (
                    <tr key={row[0]} className="border-t transition-colors hover:bg-muted/40">
                      {row.map((cell, i) => (
                        <td key={i} className={`px-4 py-2 ${i === 0 ? "font-medium" : ""}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Mobile filter sheet ───────── */}
      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="flex h-[88vh] flex-col rounded-t-2xl p-0">
          <SheetHeader className="border-b px-5 py-4 text-left">
            <SheetTitle>Filters &amp; sort</SheetTitle>
          </SheetHeader>
          <div className="flex-1 space-y-5 overflow-y-auto px-5 py-4">
            <SortSelect value={filters.sort} onChange={filters.setSort} />
            <ShopFilterPanel filters={filters} />
          </div>
          <div className="flex gap-3 border-t bg-background px-5 py-4">
            <Button variant="outline" className="rounded-full" onClick={filters.reset}>
              Clear
            </Button>
            <Button className="flex-1 rounded-full" onClick={() => setFilterOpen(false)}>
              Show {filters.filtered.length} products
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default CategoryPage;