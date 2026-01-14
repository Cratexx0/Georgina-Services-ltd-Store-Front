import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from '@/components/ui/sonner';
import { Product as ApiProduct } from '@/lib/type';
import { Product as LocalProduct } from '@/data/products';

// Union type that accepts both product formats
type FlexibleProduct = ApiProduct | LocalProduct;

interface ProductCardProps {
  product: FlexibleProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Helper to get price as number
  const getPrice = (price: string | number): number => {
    return typeof price === 'string' ? parseFloat(price) : price;
  };

  // Convert product to API format for cart/wishlist operations
  const toApiProduct = (p: FlexibleProduct): ApiProduct => {
    if ('categoryLevel1' in p) return p;
    
    return {
      id: typeof p.id === 'string' ? parseInt(p.id, 10) || 0 : p.id as number,
      name: p.name,
      slug: p.slug,
      description: p.description,
      price: p.price.toString(),
      discountPrice: p.discountPrice?.toString(),
      categoryLevel1: (p as LocalProduct).categoryId || '',
      categoryLevel2: (p as LocalProduct).subcategoryId || null,
      categoryLevel3: null,
      serviceType: 'physical',
      serviceDuration: null,
      unit: 'piece',
      stock: p.stock,
      images: p.images,
      isActive: true,
      tags: [],
      brand: null,
      isFeatured: (p as LocalProduct).featured || false,
      isTrending: (p as LocalProduct).trending || false,
      isNewArrival: (p as LocalProduct).newArrival || false,
      featuredOrder: 0,
      trendingOrder: 0,
      newArrivalOrder: 0,
      wishList: false,
      size: (p as LocalProduct).sizes || [],

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  };
  // handle add to cart

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    addToCart(toApiProduct(product), 1);
  };

  const productId = typeof product.id === 'string' ? parseInt(product.id, 10) || 0 : product.id;

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId);
    } else {
      await addToWishlist(toApiProduct(product));
    }
  };

  // Calculate price display
  const currentPrice = product.discountPrice ? getPrice(product.discountPrice) : getPrice(product.price);
  const originalPrice = product.discountPrice ? getPrice(product.price) : null;
  const discountPercentage = product.discountPrice 
    ? Math.round((1 - getPrice(product.discountPrice) / getPrice(product.price)) * 100)
    : 0;

  return (
    <div className="group relative rounded-lg overflow-hidden bg-card transition-all duration-300 hover:shadow-md">
      <Link to={`/product/${product.slug || product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted relative">
          <img
            src={product.images[0] || '/api/placeholder/300/300'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/300/300';
            }}
          />
          
          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 bg-destructive text-destructive-foreground text-[10px] md:text-xs font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="absolute top-1.5 right-1.5 md:top-2 md:right-2 flex flex-col gap-1.5 md:gap-2">
            <button
              onClick={handleWishlistToggle}
              className={`p-1.5 md:p-2 rounded-full transition-all shadow-sm ${
                isInWishlist(productId)
                  ? 'bg-red-50 hover:bg-red-100'
                  : 'bg-background/80 hover:bg-background'
              }`}
              title={isInWishlist(productId) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`h-3.5 w-3.5 md:h-4 md:w-4 transition-all ${
                  isInWishlist(productId)
                    ? 'text-red-500 fill-red-500'
                    : 'text-muted-foreground hover:text-red-500'
                }`}
              />
            </button>
            
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-primary text-primary-foreground p-1.5 md:p-2 rounded-full transition-colors shadow-sm hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add to Cart"
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-2 md:p-3">
          <h3 className="font-normal text-foreground text-[11px] md:text-xs mb-0.5 line-clamp-2">
            {product.name}
          </h3>
          
          <p className="text-muted-foreground text-[9px] md:text-[10px] mb-1 line-clamp-1">
            {product.description}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                  index < 4 ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground'
                }`}
              />
            ))}
            <span className="text-[9px] md:text-[10px] text-muted-foreground ml-0.5">(42)</span>
          </div>

          {/* Price and Stock */}
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs md:text-sm font-medium text-foreground">
              £{currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-[9px] md:text-[10px] text-muted-foreground line-through">
                £{originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[9px] md:text-[10px]">•</span>
            <span className={`text-[9px] md:text-[10px] ${product.stock > 0 ? 'text-green-600' : 'text-destructive'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
