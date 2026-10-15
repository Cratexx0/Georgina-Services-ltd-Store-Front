
// export default ProductCard;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { toast } from "@/components/ui/sonner";
import { Product as ApiProduct } from "@/lib/type";
import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";
import {
  getDiscountPercent,
  getProductImages,
  getProductRating,
  getProductSizes,
} from "@/lib/productUtils";
import ProductImage from "@/components/common/ProductImage";

interface ProductCardProps {
  product: FlexibleProduct;
}

const toApiProduct = (p: FlexibleProduct): ApiProduct =>
  p as ApiProduct;

const stop = (e: React.SyntheticEvent) => {
  e.preventDefault();
  e.stopPropagation();
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [pickerOpen, setPickerOpen] = useState(false);

  const productId =
    typeof product.id === "string" ? parseInt(product.id, 10) || 0 : product.id;
  const detailsPath = `/product/${product.slug || product.id}`;
  const images = getProductImages(product);
  const sizes = getProductSizes(product);
  const currentPrice = getDiscountPrice(product) ?? getPrice(product);
  const originalPrice = getDiscountPrice(product) ? getPrice(product) : null;
  const discountPercentage = getDiscountPercent(product);
  const rating = getProductRating(product);
  const wished = isInWishlist(productId);
  const soldOut = product.stock === 0;
  const isNew =
    ("isNewArrival" in product && product.isNewArrival) ||
    ("newArrival" in product && product.newArrival);
  const isTrending =
    ("isTrending" in product && product.isTrending) ||
    ("trending" in product && product.trending);

  const handleCartClick = (e: React.MouseEvent) => {
    stop(e);
    if (soldOut) {
      toast.error("This product is out of stock");
      return;
    }
    if (sizes.length > 0) {
      setPickerOpen((open) => !open);
      return;
    }
    addToCart(toApiProduct(product), 1);
  };

  const handleSizePick = (e: React.MouseEvent, size: string) => {
    stop(e);
    // NOTE: assumes addToCart(product, quantity, size?) - adjust to match your CartContext
    addToCart(toApiProduct(product), 1, size);
    setPickerOpen(false);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    stop(e);
    if (wished) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(toApiProduct(product));
    }
  };

  const iconButton =
    "h-9 w-9 rounded-full bg-white/90 shadow-sm backdrop-blur flex items-center justify-center transition-all hover:scale-105 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 disabled:hover:scale-100";

  return (
    <article
      className="group relative bg-card"
      onMouseLeave={() => setPickerOpen(false)}
    >
      <Link to={detailsPath} className="block">
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
            {soldOut && (
              <span className="bg-muted text-muted-foreground text-[10px] font-medium px-2 py-0.5">
                Sold out
              </span>
            )}
          </div>

          <div className="absolute top-2 right-2 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleWishlistToggle}
              aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={wished}
              className={iconButton}
            >
              <Heart
                className={`h-4 w-4 ${wished ? "fill-red-500 text-red-500" : "text-foreground"}`}
              />
            </button>
            <button
              type="button"
              onClick={handleCartClick}
              disabled={soldOut}
              aria-label="Add to cart"
              aria-expanded={sizes.length > 0 ? pickerOpen : undefined}
              className={iconButton}
            >
              <ShoppingBag className="h-4 w-4 text-foreground" />
            </button>
          </div>

          {/* Compact size picker, shown inside the card instead of a modal */}
          {pickerOpen && sizes.length > 0 && (
            <div
              onClick={stop}
              className="absolute inset-x-2 bottom-2 rounded-xl bg-white/95 p-3 shadow-lg backdrop-blur animate-in fade-in slide-in-from-bottom-2 duration-200"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground">
                  Select size
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    stop(e);
                    setPickerOpen(false);
                  }}
                  aria-label="Close size picker"
                  className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sizes.map((size) => (
                  <button
                    key={String(size)}
                    type="button"
                    onClick={(e) => handleSizePick(e, String(size))}
                    className="min-w-8 rounded-md border border-border bg-white px-2 py-1 text-xs font-medium text-foreground transition-colors hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {String(size)}
                  </button>
                ))}
              </div>
            </div>
          )}
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
  );
};

export default ProductCard;