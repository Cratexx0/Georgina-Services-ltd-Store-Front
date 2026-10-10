import React from "react";
import ProductCard from "./ProductCard";
import { FlexibleProduct } from "@/lib/productTypes";
import EmptyState from "@/components/common/EmptyState";
import { ShoppingBag } from "lucide-react";

interface ProductGridProps {
  products: FlexibleProduct[];
  title?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ products, title }) => {
  return (
    <div className="mb-8 md:mb-12">
      {title && (
        <h2 className="font-serif text-2xl md:text-3xl mb-6">{title}</h2>
      )}
      {products.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-7 w-7" />}
          title="No products found"
          description="Try adjusting your filters or exploring another category."
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
