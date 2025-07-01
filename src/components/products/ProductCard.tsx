
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart, Download, Scissors, Star } from 'lucide-react';
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
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="product-card group">
        <Link to={`/product/${product.slug}`} className="block h-full">
          <div className="relative bg-gray-50 rounded-t-xl h-80 overflow-hidden">
            <img
              src={displayImage}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              style={processedImageUrl ? { backgroundColor: 'white' } : {}}
            />
            <button
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-all duration-200"
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
              <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-sm">
                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
              </div>
            )}
            
            {/* Background removal controls */}
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm hover:bg-white"
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
                  className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm hover:bg-white"
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
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">{product.name}</h3>
          <div className="flex items-center bg-amber-50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
            <span className="text-sm font-medium text-amber-700">{product.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {product.discountPrice ? (
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">${product.price.toFixed(2)}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {product?.stock} left
          </div>
        </div>

        {/* Color swatches preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center space-x-1 mb-3">
            <span className="text-xs text-gray-600 mr-2">Colors:</span>
            {product.colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-200"
                style={{
                  backgroundColor: color.toLowerCase() === 'white' ? '#ffffff' :
                                 color.toLowerCase() === 'black' ? '#000000' :
                                 color.toLowerCase() === 'gray' ? '#6b7280' :
                                 color.toLowerCase() === 'navy' ? '#1e3a8a' :
                                 color.toLowerCase() === 'red' ? '#dc2626' :
                                 color.toLowerCase() === 'blue' ? '#2563eb' :
                                 color.toLowerCase() === 'green' ? '#16a34a' :
                                 '#9ca3af'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
            )}
          </div>
        )}

        <Button 
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          size="sm"
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
