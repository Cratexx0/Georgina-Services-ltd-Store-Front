import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart, Download, Scissors } from 'lucide-react';
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
    <div className="">
      <div className="product-card group rounded-md overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block h-full">
          <div className="relative bg-slate-300 rounded-md h-80 overflow-hidden">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              style={processedImageUrl ? { backgroundColor: 'white' } : {}}
            />
            <button
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Heart 
                className={`h-4 w-4 ${
                  isInWishlist(product.id) 
                    ? 'text-red-500 fill-red-500' 
                    : 'text-gray-400'
                }`} 
              />
              <span className="sr-only">
                {isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
              </span>
            </button>
            {product.discountPrice && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
                SALE
              </div>
            )}
            
            {/* Background removal controls */}
            <div className="absolute bottom-2 left-2 flex gap-1">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveBackground}
                disabled={isRemovingBg}
                title="Remove background"
              >
                <Scissors className="h-3 w-3" />
              </Button>
              
              {processedImageUrl && (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={handleDownloadProcessed}
                  title="Download processed image"
                >
                  <Download className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </Link>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
          <div className="flex items-center">
            <span className="text-amber-500">★</span>
            <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {product.discountPrice ? (
              <>
                <span className="text-lg font-semibold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm font-bold text-gray-900 line-through ml-2">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-sm font-base text-neutral-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          <p className="text-neutral-900 text-sm">{product?.stock} items left</p>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
