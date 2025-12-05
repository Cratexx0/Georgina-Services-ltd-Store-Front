import React from 'react';
import { useTrendingProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '@/components/Loader/SkeletonLoader';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const TrendingProducts: React.FC = () => {
  const { products, loading, error } = useTrendingProducts(1, 8);

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and trending products that customers love
            </p>
          </div>
          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <CarouselItem key={i} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/2 lg:basis-1/4 xl:basis-1/5">
                  <div className="p-1">
                    <ProductCardSkeleton />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600">
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500">
            <p>No trending products available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Trending Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular and trending products that customers love
          </p>
        </div>
        
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
      </div>
    </div>


  );
};

export default TrendingProducts;
