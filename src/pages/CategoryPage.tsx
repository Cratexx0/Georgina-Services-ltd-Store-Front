import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import PaginatedProductGrid from "@/components/products/PaginatedProductGrid";
import { apiService, Category } from "@/lib/api";
import { Product } from "@/lib/type";
import { Button } from "@/components/ui/button";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { fallbackCategories } from "@/data/categories";
import { getLocalProductsByCategory } from "@/lib/productUtils";
import { useProductFilters } from "@/hooks/useProductFilters";
import ProductFilters from "@/components/clothing/ProductFilters";
import ProductSort from "@/components/clothing/ProductSort";
import ErrorState from "@/components/common/ErrorState";
import { ProductGridSkeleton } from "@/components/Loader/SkeletonLoader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

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
  const [level3Categories, setLevel3Categories] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedLevel3, setSelectedLevel3] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

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
          const categoryProducts = (response.products || []).filter(
            (product) =>
              product.categoryLevel1?.toLowerCase() === currentCat!.name.toLowerCase()
          );
          if (categoryProducts.length) {
            setProducts(categoryProducts);
          } else {
            setProducts(getLocalProductsByCategory(currentCat.slug));
          }
        } catch {
          setProducts(getLocalProductsByCategory(currentCat.slug));
        }
      } catch {
        setError("Failed to load this category.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, [categorySlug]);

  const baseFiltered = useMemo(() => {
    let filtered = [...products];
    if (subcategorySlug) {
      const selectedSubcategory = subcategories.find((sub) => sub.slug === subcategorySlug);
      if (selectedSubcategory) {
        filtered = filtered.filter(
          (product) =>
            product.categoryLevel2?.toLowerCase() === selectedSubcategory.name.toLowerCase() ||
            product.categoryLevel2?.toLowerCase() === selectedSubcategory.slug
        );
      }
    }
    return filtered;
  }, [products, subcategories, subcategorySlug]);

  useEffect(() => {
    const cats = [...new Set(baseFiltered.map((p) => p.categoryLevel3).filter(Boolean))] as string[];
    setLevel3Categories(cats);
  }, [baseFiltered]);

  useEffect(() => {
    setSelectedLevel3(null);
  }, [subcategorySlug]);

  const preFilter = useMemo(() => {
    if (!selectedLevel3) return baseFiltered;
    return baseFiltered.filter((p) => p.categoryLevel3 === selectedLevel3);
  }, [baseFiltered, selectedLevel3]);

  const filters = useProductFilters(preFilter);
  const isClothes = categorySlug === "clothes";
  const selectedSub = subcategories.find((sub) => sub.slug === subcategorySlug);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="h-6 w-48 bg-muted animate-pulse rounded mb-8" />
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

  const heading = selectedLevel3
    ? selectedLevel3
    : selectedSub
      ? selectedSub.name
      : currentCategory.name;

  return (
    <Layout>
      <div className="border-b bg-background">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4" />
            {subcategorySlug ? (
              <Link to={`/category/${currentCategory.slug}`} className="hover:text-foreground">
                {currentCategory.name}
              </Link>
            ) : (
              <span className="text-foreground">{currentCategory.name}</span>
            )}
            {selectedSub && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">{selectedSub.name}</span>
              </>
            )}
          </nav>
        </div>
      </div>

      {subcategories.length > 0 && (
        <div className="border-b sticky top-16 bg-background/95 backdrop-blur z-30">
          <div className="container mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            <Button variant={!subcategorySlug ? "default" : "outline"} size="sm" asChild className="flex-shrink-0">
              <Link to={`/category/${currentCategory.slug}`}>All {currentCategory.name}</Link>
            </Button>
            {subcategories.map((subcategory) => (
              <Button
                key={subcategory.id}
                variant={subcategorySlug === subcategory.slug ? "default" : "outline"}
                size="sm"
                asChild
                className="flex-shrink-0"
              >
                <Link to={`/category/${currentCategory.slug}/${subcategory.slug}`}>
                  {subcategory.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-2">{heading}</h1>
            <p className="text-muted-foreground max-w-2xl">
              {selectedSub?.description || currentCategory.description}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filters.filtered.length} product{filters.filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter & Sort
            </Button>
            <div className="hidden lg:block">
              <ProductSort value={filters.sort} onChange={filters.setSort} showRating={filters.hasRating} />
            </div>
          </div>
        </div>

        {level3Categories.length > 1 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setSelectedLevel3(null)}
              className={`px-3 py-1.5 text-sm rounded-full border ${!selectedLevel3 ? "bg-foreground text-background" : "hover:border-foreground"}`}
            >
              All types
            </button>
            {level3Categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedLevel3(cat)}
                className={`px-3 py-1.5 text-sm rounded-full border ${selectedLevel3 === cat ? "bg-foreground text-background" : "hover:border-foreground"}`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <div className={isClothes ? "grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8" : ""}>
          {isClothes && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <ProductFilters filters={filters} />
              </div>
            </aside>
          )}
          <div>
            <PaginatedProductGrid products={filters.filtered} itemsPerPage={12} />
          </div>
        </div>
      </div>

      <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
        <SheetContent side="bottom" className="h-[88vh] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter & Sort</SheetTitle>
          </SheetHeader>
          <div className="py-4 space-y-6">
            <ProductSort value={filters.sort} onChange={filters.setSort} showRating={filters.hasRating} />
            <ProductFilters filters={filters} />
            <Button className="w-full" onClick={() => setFilterOpen(false)}>
              Show {filters.filtered.length} products
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Layout>
  );
};

export default CategoryPage;
