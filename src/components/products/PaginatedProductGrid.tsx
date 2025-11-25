
import React, { useState } from 'react';
import ProductCard from './ProductCard';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Product } from '@/lib/type';

interface PaginatedProductGridProps {
  products: Product[];
  title?: string;
  itemsPerPage?: number;
}

const PaginatedProductGrid: React.FC<PaginatedProductGridProps> = ({ 
  products, 
  title, 
  itemsPerPage = 8 
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

  return (
    <div className="mb-12">
      {title && (
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-8">
        {currentProducts?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found</p>
        </div>
      )}
      
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default PaginatedProductGrid;
