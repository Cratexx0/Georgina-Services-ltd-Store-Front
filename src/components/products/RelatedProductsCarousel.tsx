import React from 'react';
import ProductCard from './ProductCard';
// import { Product } from '@/hooks/useProducts';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Product } from '@/lib/type';

interface RelatedProductsCarouselProps {
  products: Product[];
  title?: string;
}

const RelatedProductsCarousel: React.FC<RelatedProductsCarouselProps> = ({ 
  products, 
  title = "Related Products" 
}) => {
  if (products.length === 0) return null;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <Carousel 
        className="w-full"
        opts={{
          align: "start",
          loop: false,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
              <div className="p-1">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex -left-4" />
        <CarouselNext className="hidden sm:flex -right-4" />
      </Carousel>
    </section>
  );
};

export default RelatedProductsCarousel;