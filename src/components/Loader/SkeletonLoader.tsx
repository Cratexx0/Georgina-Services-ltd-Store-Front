import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export const ProductCardSkeleton = () => (
  <Card className="overflow-hidden border-border shadow-soft animate-pulse h-full flex flex-col">
    <div className="relative">
      <Skeleton className="w-full h-52 md:h-56 lg:h-60" />
      <Skeleton className="absolute top-2 left-2 h-5 w-16 rounded-full" />
      <Skeleton className="absolute top-2 right-2 h-8 w-8 rounded-full" />
    </div>
    <CardContent className="p-2.5 flex-1 flex flex-col">
      <Skeleton className="h-3 w-full mb-1" />
      <Skeleton className="h-3 w-3/4 mb-1" />
      <Skeleton className="h-2 w-1/2 mb-2" />
      <div className="flex items-center justify-between mt-auto pt-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-7 w-7 rounded-full" />
      </div>
    </CardContent>
  </Card>
);

export const ServiceCardSkeleton = () => (
  <Card className="border-border shadow-soft animate-pulse">
    <CardContent className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <Skeleton className="h-6 w-32" />
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="space-y-2 mb-4">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
        <Skeleton className="h-3 w-3/4" />
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-10 w-28" />
      </div>
    </CardContent>
  </Card>
);

export const CartItemSkeleton = () => (
  <div className="py-3 animate-pulse">
    <div className="flex gap-3">
      <Skeleton className="w-20 h-20 md:w-24 md:h-24 rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-4 w-3/4 mb-1" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-7 w-32" />
        </div>
      </div>
    </div>
  </div>
);

export const CategoryCardSkeleton = () => (
  <Card className="border-border shadow-soft animate-pulse cursor-pointer">
    <CardContent className="p-6">
      <Skeleton className="h-12 w-12 rounded-lg mb-4" />
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5 mt-1" />
    </CardContent>
  </Card>
);

export const HeroSkeleton = () => (
  <div className="relative h-[600px] bg-muted animate-pulse">
    <Skeleton className="w-full h-full" />
  </div>
);

export const BannerSkeleton = () => (
  <div className="relative h-64 md:h-80 lg:h-96 bg-muted animate-pulse">
    <Skeleton className="w-full h-full" />
  </div>
);
