import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { ProductGridSkeleton } from '@/components/Loader/SkeletonLoader';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Product as ApiProduct } from '@/lib/type';
import { Product as LocalProduct } from '@/data/products';

type FlexibleProduct = ApiProduct | LocalProduct;

interface PaginatedProductGridProps {
  products: FlexibleProduct[];
  title?: string;
  itemsPerPage?: number;
  isLoading?: boolean;
}

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({ 
  products, 
  title, 
  itemsPerPage = 10,
  isLoading = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="mb-8 md:mb-12">
        {title && (
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">{title}</h2>
        )}
        <ProductGridSkeleton count={itemsPerPage} />
      </div>
    );
  }

  return (
    <div className="mb-8 md:mb-12">
      {title && (
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-6 md:mb-8">
        {currentProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-base md:text-lg text-muted-foreground">No products found</p>
        </div>
      )}
      
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent className="flex-wrap gap-1">
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={`text-xs md:text-sm ${currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page} className="hidden sm:block">
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer text-xs md:text-sm h-8 w-8 md:h-9 md:w-9"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {/* Mobile page indicator */}
            <PaginationItem className="sm:hidden">
              <span className="text-xs px-2">
                {currentPage} / {totalPages}
              </span>
            </PaginationItem>
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={`text-xs md:text-sm ${currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginatedProductGrid;
