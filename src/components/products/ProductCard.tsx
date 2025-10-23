
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart, Download, Scissors, Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from '@/components/ui/sonner';
import { removeBackground, loadImageFromUrl } from '@/utils/backgroundRemoval';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const handleRemoveBackground = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsRemovingBg(true);
    toast.info('Removing background...', {
      description: 'This may take a few moments'
    });

    try {
      const img = await loadImageFromUrl(product.images[0]);
      const processedBlob = await removeBackground(img);
      const processedUrl = URL.createObjectURL(processedBlob);
      setProcessedImageUrl(processedUrl);
      
      toast.success('Background removed successfully!');
    } catch (error) {
      console.error('Failed to remove background:', error);
      toast.error('Failed to remove background', {
        description: 'Please try again later'
      });
    } finally {
      setIsRemovingBg(false);
    }
  };

  const handleDownloadProcessed = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (processedImageUrl) {
      const link = document.createElement('a');
      link.href = processedImageUrl;
      link.download = `${product.name}-no-bg.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('Image downloaded!');
    }
  };

  const displayImage = processedImageUrl || product.images[0];

  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-border group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative bg-muted overflow-hidden aspect-square">
          <img
            src={displayImage}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            style={processedImageUrl ? { backgroundColor: 'white' } : {}}
          />
          
          {/* Top action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <button
              onClick={handleWishlistToggle}
              className="p-2.5 bg-background/95 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-all duration-200 border border-border/50"
              title={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart 
                className={`h-4 w-4 transition-colors ${
                  isInWishlist(product.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-muted-foreground hover:text-foreground'
                }`} 
              />
              <span className="sr-only">
                {isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              </span>
            </button>
            
            <button
              onClick={handleAddToCart}
              className="p-2.5 bg-primary hover:bg-primary/90 backdrop-blur-md rounded-full shadow-lg hover:scale-110 transition-all duration-200"
              title="Add to cart"
            >
              <ShoppingCart className="h-4 w-4 text-primary-foreground" />
              <span className="sr-only">Add to cart</span>
            </button>
          </div>
          
          {/* Discount badge */}
          {product.discountPrice && (
            <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground px-3 py-1.5 text-xs font-bold rounded-full shadow-lg backdrop-blur-sm">
              -{Math.round((1 - product.discountPrice / product.price) * 100)}%
            </div>
          )}
          
          {/* Background removal controls */}
          <div className="absolute bottom-3 left-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              size="sm"
              variant="secondary"
              className="h-8 w-8 p-0 bg-background/95 backdrop-blur-md hover:bg-background shadow-lg border border-border/50"
              onClick={handleRemoveBackground}
              disabled={isRemovingBg}
              title="Remove background"
            >
              <Scissors className="h-3.5 w-3.5" />
            </Button>
            
            {processedImageUrl && (
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 bg-background/95 backdrop-blur-md hover:bg-background shadow-lg border border-border/50"
                onClick={handleDownloadProcessed}
                title="Download processed image"
              >
                <Download className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          
          {/* Stock indicator */}
          {product.stock < 10 && (
            <div className="absolute bottom-3 right-3 bg-background/95 backdrop-blur-md text-foreground px-2.5 py-1 text-xs font-semibold rounded-full shadow-lg border border-border/50">
              Only {product.stock} left
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <Link to={`/product/${product.slug}`}>
          <div className="flex items-start justify-between gap-2 mb-3">
            <h3 className="font-semibold text-foreground line-clamp-2 flex-1 text-sm leading-snug hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center bg-amber-50 dark:bg-amber-950 px-2 py-1 rounded-lg shrink-0 border border-amber-200 dark:border-amber-800">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400">{product.rating}</span>
            </div>
          </div>
        </Link>

        <div className="flex items-baseline gap-2 mb-1">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-foreground">${product.discountPrice.toFixed(2)}</span>
              <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            </>
          ) : (
            <span className="text-xl font-bold text-foreground">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground">Free shipping on orders over $50</p>
      </div>
    </div>
  );
};

export default ProductCard;
