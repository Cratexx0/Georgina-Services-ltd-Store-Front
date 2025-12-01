import React from 'react';
import ProductCard from './ProductCard';
import { Product as ApiProduct } from '@/lib/type';
import { Product as LocalProduct } from '@/data/products';

type FlexibleProduct = ApiProduct | LocalProduct;

interface ProductGridProps {
  products: FlexibleProduct[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  return (
    <div className="mb-8 md:mb-12">
      {title && (
        <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">{title}</h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <div className="text-center py-8 md:py-12">
          <p className="text-base md:text-lg text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
