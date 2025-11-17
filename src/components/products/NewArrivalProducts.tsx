import React from 'react';
import { useNewArrivalProducts } from '@/hooks/useProducts';
import ProductCard from './ProductCard';
import { Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const NewArrivalProducts: React.FC = () => {
  const { products, loading, error } = useNewArrivalProducts(1, 8);

  if (loading) {
    return (
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading new arrivals...</span>
          </div>
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
            <p>No new arrivals available at the moment.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">New Arrivals</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Check out our latest products and fresh additions to our collection
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
          <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
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

export default NewArrivalProducts;
