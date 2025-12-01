import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const ProductCardSkeleton = () => (
  <Card className="overflow-hidden border-border shadow-sm h-full flex flex-col">
    <div className="relative">
      <Skeleton className="w-full aspect-square" />
      <Skeleton className="absolute top-1.5 left-1.5 md:top-2 md:left-2 h-4 md:h-5 w-12 md:w-16 rounded" />
      <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 flex flex-col gap-1.5 md:gap-2">
        <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
        <Skeleton className="h-6 w-6 md:h-8 md:w-8 rounded-full" />
      </div>
    </div>
    <CardContent className="p-2 md:p-3 flex-1 flex flex-col">
      <Skeleton className="h-3 md:h-4 w-full mb-1" />
      <Skeleton className="h-3 md:h-4 w-3/4 mb-1.5 md:mb-2" />
      <Skeleton className="h-2 md:h-3 w-1/2 mb-1.5 md:mb-2" />
      <div className="flex items-center gap-2 mt-auto">
        <Skeleton className="h-4 md:h-5 w-14 md:w-16" />
        <Skeleton className="h-3 md:h-4 w-10 md:w-12" />
      </div>
      <Skeleton className="h-2 md:h-3 w-16 md:w-20 mt-1" />
    </CardContent>
  </Card>
);

export const ServiceCardSkeleton = () => (
  <Card className="border-border shadow-sm">
    <CardContent className="p-4 md:p-6">
      <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
        <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-lg" />
        <Skeleton className="h-5 md:h-6 w-24 md:w-32" />
      </div>
      <Skeleton className="h-3 md:h-4 w-full mb-1.5 md:mb-2" />
      <Skeleton className="h-3 md:h-4 w-5/6 mb-3 md:mb-4" />
      <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
        <Skeleton className="h-2.5 md:h-3 w-full" />
        <Skeleton className="h-2.5 md:h-3 w-4/5" />
        <Skeleton className="h-2.5 md:h-3 w-3/4" />
      </div>
      <div className="flex items-center justify-between pt-3 md:pt-4 border-t border-border">
        <Skeleton className="h-5 md:h-6 w-20 md:w-24" />
        <Skeleton className="h-8 md:h-10 w-24 md:w-28" />
      </div>
    </CardContent>
  </Card>
);

export const CartItemSkeleton = () => (
  <div className="py-2 md:py-3">
    <div className="flex gap-2 md:gap-3">
      <Skeleton className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-3.5 md:h-4 w-3/4 mb-1" />
        <Skeleton className="h-2.5 md:h-3 w-1/2 mb-1.5 md:mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 md:h-5 w-14 md:w-16" />
          <Skeleton className="h-6 md:h-7 w-24 md:w-32" />
        </div>
      </div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <Card className="border-border shadow-sm cursor-pointer overflow-hidden">
    <Skeleton className="w-full aspect-[4/3]" />
    <CardContent className="p-3 md:p-4">
      <Skeleton className="h-4 md:h-5 w-24 md:w-32 mb-1.5 md:mb-2" />
      <Skeleton className="h-2.5 md:h-3 w-full" />
      <Skeleton className="h-2.5 md:h-3 w-4/5 mt-1" />
    </CardContent>
  </Card>
);

export const HeroSkeleton = () => (
  <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-muted">
    <Skeleton className="w-full h-full" />
    <div className="absolute inset-0 flex flex-col justify-center items-start p-4 md:p-8 lg:p-12">
      <Skeleton className="h-6 md:h-8 lg:h-10 w-3/4 md:w-1/2 mb-2 md:mb-4" />
      <Skeleton className="h-4 md:h-5 lg:h-6 w-2/3 md:w-1/3 mb-4 md:mb-6" />
      <Skeleton className="h-8 md:h-10 lg:h-12 w-32 md:w-40" />
    </div>
  </div>
);

export const BannerSkeleton = () => (
  <div className="relative h-48 sm:h-56 md:h-64 lg:h-80 bg-muted">
    <Skeleton className="w-full h-full" />
  </div>
);

export const ProductGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

export const ServiceGridSkeleton = ({ count = 4 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ServiceCardSkeleton key={index} />
    ))}
  </div>
);

export const ProductDetailSkeleton = () => (
  <div className="container mx-auto px-4 py-6 md:py-8">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-4 md:mb-6">
      <Skeleton className="h-3 md:h-4 w-12" />
      <Skeleton className="h-3 md:h-4 w-2" />
      <Skeleton className="h-3 md:h-4 w-16" />
      <Skeleton className="h-3 md:h-4 w-2" />
      <Skeleton className="h-3 md:h-4 w-24" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
      {/* Image Gallery */}
      <div className="space-y-3 md:space-y-4">
        <Skeleton className="w-full aspect-square rounded-lg" />
        <div className="flex gap-2 overflow-x-auto">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="w-14 h-14 md:w-16 md:h-16 rounded-md flex-shrink-0" />
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-3 md:space-y-4">
        <Skeleton className="h-6 md:h-8 w-3/4" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 md:h-7 w-20" />
          <Skeleton className="h-5 w-16" />
        </div>
        <Skeleton className="h-16 md:h-20 w-full" />
        <div className="flex items-center gap-3 pt-4">
          <Skeleton className="h-9 md:h-10 w-28" />
          <Skeleton className="h-9 md:h-10 flex-1" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-9 w-36" />
          <Skeleton className="h-9 w-24" />
        </div>
      </div>
    </div>
  </div>
);
