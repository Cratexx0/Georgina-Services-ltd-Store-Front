// src/components/products/ProductCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from '@/components/ui/sonner';
import { Product } from '@/lib/type';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  // Calculate price display
  const currentPrice = product.discountPrice ? parseFloat(product.discountPrice.toString()) : parseFloat(product.price.toString());
  const originalPrice = product.discountPrice ? parseFloat(product.price.toString()) : null;
  const discountPercentage = product.discountPrice 
    ? Math.round((1 - parseFloat(product.discountPrice.toString()) / parseFloat(product.price.toString())) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-sm border border-gray-200 overflow-hidden hover:shadow-sm transition-all duration-300">
      <Link to={`/product/${product.slug || product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100 relative">
          <img
            src={product.images[0] || '/api/placeholder/300/300'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = '/api/placeholder/300/300';
            }}
          />
          
          {/* Discount Badge */}
          {product.discountPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              {discountPercentage}% OFF
            </div>
          )}
          
          {/* Action Buttons - Top Right */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className="bg-white/80 hover:bg-white p-2 rounded-full transition-colors shadow-sm"
            >
              <Heart
                className={`h-4 w-4 ${
                  isInWishlist(product.id)
                    ? 'text-red-500 fill-red-500'
                    : 'text-gray-600'
                }`}
              />
            </button>
            
            {/* Add to Cart Button - Icon Only */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-white/80 hover:bg-blue-600  p-2 rounded-full transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title="Add to Cart"
            >
              <ShoppingCart className="h-4 hover:text-white w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">
            {product.description}
          </p>

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg font-bold text-gray-900">
              ${currentPrice.toFixed(2)}
            </span>
            {originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center justify-between">
            <span className={`text-xs ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;