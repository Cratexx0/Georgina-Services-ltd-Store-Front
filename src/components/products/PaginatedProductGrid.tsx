import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "@/components/Loader/SkeletonLoader";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { FlexibleProduct } from "@/lib/productTypes";
import EmptyState from "@/components/common/EmptyState";
import { ShoppingBag } from "lucide-react";

interface PaginatedProductGridProps {
  products: FlexibleProduct[];
  title?: string;
  itemsPerPage?: number;
  isLoading?: boolean;
}

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({
  products,
  title,
  itemsPerPage = 12,
  isLoading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const goTo = (page: number) => {
    const next = Math.min(totalPages, Math.max(1, page));
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <div className="mb-8">
        {title && <h2 className="font-serif text-2xl mb-6">{title}</h2>}
        <ProductGridSkeleton count={itemsPerPage} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag className="h-7 w-7" />}
        title="No products found"
        description="Try adjusting your filters or exploring another category."
      />
    );
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
    if (totalPages <= 7) return true;
    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
  });

  return (
    <div className="mb-8">
      {title && <h2 className="font-serif text-2xl mb-6">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent className="flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => goTo(currentPage - 1)}
                className={`cursor-pointer text-xs md:text-sm ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
            {pages.map((page, i) => (
              <React.Fragment key={page}>
                {i > 0 && pages[i - 1] !== page - 1 && (
                  <PaginationItem className="hidden sm:flex">
                    <span className="px-2 text-muted-foreground">…</span>
                  </PaginationItem>
                )}
                <PaginationItem className="hidden sm:block">
                  <PaginationLink
                    onClick={() => goTo(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              </React.Fragment>
            ))}
            <PaginationItem className="sm:hidden">
              <span className="text-xs px-2">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => goTo(currentPage + 1)}
                className={`cursor-pointer text-xs md:text-sm ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginatedProductGrid;
