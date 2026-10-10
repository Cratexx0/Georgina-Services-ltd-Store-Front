import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/components/ui/sonner";
import { Product as ApiProduct } from "@/lib/type";
import { Product as LocalProduct } from "@/data/products";
import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";
import {
  getDiscountPercent,
  getProductImages,
  getProductRating,
  getProductSizes,
  localToApiProduct,
} from "@/lib/productUtils";
import ProductImage from "@/components/common/ProductImage";
import ProductQuickView from "@/components/clothing/ProductQuickView";

interface ProductCardProps {
  product: FlexibleProduct;
}

const toApiProduct = (p: FlexibleProduct): ApiProduct =>
  "categoryLevel1" in p ? p : localToApiProduct(p as LocalProduct);

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [quickView, setQuickView] = useState(false);

  const productId =
    typeof product.id === "string" ? parseInt(product.id, 10) || 0 : product.id;
  const images = getProductImages(product);
  const sizes = getProductSizes(product);
  const currentPrice = getDiscountPrice(product) ?? getPrice(product);
  const originalPrice = getDiscountPrice(product) ? getPrice(product) : null;
  const discountPercentage = getDiscountPercent(product);
  const rating = getProductRating(product);
  const wished = isInWishlist(productId);
  const isNew =
    ("isNewArrival" in product && product.isNewArrival) ||
    ("newArrival" in product && product.newArrival);
  const isTrending =
    ("isTrending" in product && product.isTrending) ||
    ("trending" in product && product.trending);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }
    if (sizes.length > 0) {
      setQuickView(true);
      return;
    }
    addToCart(toApiProduct(product), 1);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (wished) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(toApiProduct(product));
    }
  };

  return (
    <>
      <article className="group relative bg-card">
        <Link to={`/product/${product.slug || product.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-stone-100">
            <ProductImage
              src={images[0]}
              hoverSrc={images[1]}
              alt={product.name}
              className="h-full w-full"
            />

            <div className="absolute top-2 left-2 flex flex-col gap-1">
              {discountPercentage > 0 && (
                <span className="bg-foreground text-background text-[10px] font-medium px-2 py-0.5">
                  -{discountPercentage}%
                </span>
              )}
              {isNew && (
                <span className="bg-white/90 text-foreground text-[10px] font-medium px-2 py-0.5">
                  New
                </span>
              )}
              {isTrending && !isNew && (
                <span className="bg-white/90 text-foreground text-[10px] font-medium px-2 py-0.5">
                  Trending
                </span>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="bg-amber-100 text-amber-800 text-[10px] font-medium px-2 py-0.5">
                  Low stock
                </span>
              )}
              {product.stock === 0 && (
                <span className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5">
                  Sold out
                </span>
              )}
            </div>

            <div className="absolute top-2 right-2 flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleWishlistToggle}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className="h-8 w-8 rounded-full bg-white/90 shadow-sm flex items-center justify-center transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Heart
                  className={`h-4 w-4 ${wished ? "fill-red-500 text-red-500" : "text-foreground"}`}
                />
              </button>
            </div>

            <div className="absolute inset-x-2 bottom-2 flex gap-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 motion-safe:transition-all max-md:opacity-100 max-md:translate-y-0">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 h-9 bg-foreground text-background text-xs font-medium rounded-md flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                {sizes.length ? "Select size" : "Add"}
              </button>
              <button
                type="button"
                aria-label="Quick view"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickView(true);
                }}
                className="h-9 w-9 bg-white text-foreground rounded-md flex items-center justify-center shadow-sm"
              >
                <Eye className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="pt-3 pb-1">
            <h3 className="text-sm font-medium line-clamp-2 leading-snug">{product.name}</h3>
            {rating != null && (
              <div className="flex items-center gap-1 mt-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-xs text-muted-foreground">{rating.toFixed(1)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-medium">£{currentPrice.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  £{originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>
        </Link>
      </article>
      <ProductQuickView product={product} open={quickView} onOpenChange={setQuickView} />
    </>
  );
};

export default ProductCard;
