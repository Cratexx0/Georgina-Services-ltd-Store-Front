import React from "react";
import { Link } from "react-router-dom";
import ProductCard from "@/components/products/ProductCard";
import { ProductCardSkeleton } from "@/components/Loader/SkeletonLoader";
import ErrorState from "@/components/common/ErrorState";
import { FlexibleProduct } from "@/lib/productTypes";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductRailProps {
  title: string;
  subtitle?: string;
  products: FlexibleProduct[];
  loading?: boolean;
  error?: string | null;
  href?: string;
}

const ProductRail: React.FC<ProductRailProps> = ({
  title,
  subtitle,
  products,
  loading,
  error,
  href = "/category/clothes",
}) => {
  return (
    <section className="py-14 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2 max-w-xl">{subtitle}</p>}
          </div>
          <Link
            to={href}
            className="hidden sm:inline-block text-xs uppercase tracking-[0.18em] border-b border-foreground pb-0.5 hover:opacity-70"
          >
            View all
          </Link>
        </div>

        {loading && (
          <Carousel className="w-full">
            <CarouselContent className="-ml-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="pl-3 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCardSkeleton />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}

        {error && !loading && <ErrorState message="We couldn’t load these products right now." />}

        {!loading && !error && products.length > 0 && (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent className="-ml-3">
              {products.map((product) => (
                <CarouselItem
                  key={product.id}
                  className="pl-3 basis-[70%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                >
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
};

export default ProductRail;
