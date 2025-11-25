
import React from 'react';
import ProductCard from './ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Loader2 } from 'lucide-react';

const FeaturedProductsCarousel: React.FC = () => {
  const { products, loading, error } = useFeaturedProducts(1, 8);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading featured products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 py-12">
        <p>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        <p>No featured products available at the moment.</p>
      </div>
    );
  }
  return (
    <Carousel 
      className="w-full"
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {products.map((product) => (
          <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
            <div className="p-1">
              <ProductCard product={product} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
};

export default FeaturedProductsCarousel;
