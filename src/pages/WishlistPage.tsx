import React from "react";
import Layout from "@/components/layout/Layout";
import { useWishlist } from "@/context/useWishlist";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import EmptyState from "@/components/common/EmptyState";
import ProductGrid from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/Loader/SkeletonLoader";

const WishlistPage: React.FC = () => {
  const { wishlist, clearWishlist, isLoading } = useWishlist();

  if (isLoading && wishlist.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-10">
          <div className="h-8 w-40 bg-muted animate-pulse rounded mb-8" />
          <ProductGridSkeleton count={8} />
        </div>
      </Layout>
    );
  }

  if (wishlist.length === 0) {
    return (
      <Layout>
        <EmptyState
          icon={<Heart className="h-8 w-8" />}
          title="Your wishlist is empty"
          description="Save the pieces you love and they’ll wait for you here."
          actionLabel="Explore clothing"
          actionTo="/category/clothes"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-end gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-1">Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} saved {wishlist.length === 1 ? "item" : "items"}
            </p>
          </div>
          <Button variant="outline" onClick={clearWishlist}>Clear all</Button>
        </div>
        <ProductGrid products={wishlist} />
      </div>
    </Layout>
  );
};

export default WishlistPage;
