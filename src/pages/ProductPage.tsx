


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import RelatedProductsCarousel from '@/components/products/RelatedProductsCarousel';
import ProductReview from '@/components/products/ProductReview';
import { toast } from '@/components/ui/sonner';
import { apiService } from '@/lib/api';
import { Product } from '@/lib/type';

const ProductPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Helper function to get available sizes from product
  const getAvailableSizes = (product: Product): string[] => {
    if (!product.size) return [];
    
    if (Array.isArray(product.size)) {
      return product.size.filter(s => typeof s === 'string' && s.trim());
    }
    
    if (typeof product.size === 'string') {
      return product.size.split(',').map(s => s.trim()).filter(s => s);
    }
    
    return [];
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const productData = await apiService.getProductBySlug(productSlug);
        
        if (productData) {
          setProduct(productData);
          
          // Reset selected size when product changes
          const sizes = getAvailableSizes(productData);
          if (sizes.length > 0) {
            setSelectedSize(sizes[0]); // Auto-select first size
          } else {
            setSelectedSize(''); // Clear size selection
          }
          
          // Fetch related products
          try {
            const related = await apiService.getProductsByCategory(productData.categoryLevel1);
            setRelatedProducts(related.filter((p: Product) => p.id !== productData.id).slice(0, 4));
          } catch (relatedError) {
            console.error('Error fetching related products:', relatedError);
            const allProductsResponse = await apiService.getProducts();
            setRelatedProducts(allProductsResponse.products.filter((p: Product) => p.id !== productData.id).slice(0, 4));
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Check if product is in stock
    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }
    
    // Check if size is required and selected
    const availableSizes = getAvailableSizes(product);
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    addToCart(product, quantity, selectedSize);
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity}${selectedSize ? `, Size: ${selectedSize}` : ''}`,
    });
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  };

  const handleShare = async () => {
    if (!product) return;
    
    const shareData = {
      title: product.name,
      text: product.description || '',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
        toast.error('Failed to share product');
      }
    }
  };

  // Loading state with skeleton
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-4 md:py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <div className="h-3 md:h-4 w-12 bg-muted animate-pulse rounded" />
            <div className="h-3 md:h-4 w-2 bg-muted animate-pulse rounded" />
            <div className="h-3 md:h-4 w-16 bg-muted animate-pulse rounded" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Image skeleton */}
            <div className="space-y-3 md:space-y-4">
              <div className="w-full aspect-square bg-muted animate-pulse rounded-lg" />
              <div className="flex gap-2 overflow-x-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-14 h-14 md:w-16 md:h-16 bg-muted animate-pulse rounded-md flex-shrink-0" />
                ))}
              </div>
            </div>
            
            {/* Info skeleton */}
            <div className="space-y-3 md:space-y-4">
              <div className="h-6 md:h-8 w-3/4 bg-muted animate-pulse rounded" />
              <div className="flex items-center gap-2">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 md:h-7 w-20 bg-muted animate-pulse rounded" />
                <div className="h-5 w-16 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-16 md:h-20 w-full bg-muted animate-pulse rounded" />
              <div className="flex items-center gap-3 pt-4">
                <div className="h-9 md:h-10 w-28 bg-muted animate-pulse rounded" />
                <div className="h-9 md:h-10 flex-1 bg-muted animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 md:py-12 text-center">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-4">Product not found</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            {error || "The product you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild size="sm">
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Calculate discount percentage
  const discountPercentage = product.discountPrice && product.price 
    ? Math.round((1 - parseFloat(product.discountPrice.toString()) / parseFloat(product.price.toString())) * 100)
    : 0;

  // Parse price values
  const currentPrice = product.discountPrice ? parseFloat(product.discountPrice.toString()) : parseFloat(product.price.toString());
  const originalPrice = product.discountPrice ? parseFloat(product.price.toString()) : null;

  // Get available sizes for this product
  const availableSizes = getAvailableSizes(product);
  const hasSizes = availableSizes.length > 0;

  return (
    <Layout>
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center flex-wrap gap-1 md:gap-2 text-xs md:text-sm text-muted-foreground mb-4 md:mb-6">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          {product.categoryLevel1 && (
            <>
              <Link 
                to={`/category/${product.categoryLevel1.toLowerCase().replace(/\s+/g, '-')}`} 
                className="hover:text-foreground transition-colors"
              >
                {product.categoryLevel1}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-foreground truncate max-w-[150px] md:max-w-none">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {/* Product Images */}
          <div className="space-y-3 md:space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-muted">
              <img 
                src={product.images[selectedImage] || '/api/placeholder/400/400'} 
                alt={product.name} 
                className="w-full h-full object-contain" 
                onError={(e) => {
                  e.currentTarget.src = '/api/placeholder/400/400';
                }}
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-1 md:py-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    } rounded-md overflow-hidden h-14 w-14 md:h-16 md:w-16`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/64/64';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-base md:text-lg font-semibold text-foreground">
              {product.name}
            </h1>
            
            {/* Price */}
            <div className="py-1">
              {product.discountPrice ? (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-base md:text-lg font-semibold text-foreground">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-xs md:text-sm text-muted-foreground line-through">
                    ${originalPrice?.toFixed(2)}
                  </span>
                  <span className="text-[10px] md:text-xs font-medium text-destructive">
                    {discountPercentage}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-base md:text-lg font-semibold text-foreground">
                  ${currentPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {product.description || 'No description available'}
            </p>

            {/* Size Selection */}
            {hasSizes && (
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium">
                    Size: {selectedSize && <span className="text-primary">{selectedSize}</span>}
                  </label>
                  {selectedSize && (
                    <button 
                      onClick={() => setSelectedSize('')}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-primary bg-primary text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock and quantity selector */}
            <div className="border-t border-gray-200 pt-4">
              <p className="flex items-center text-xs mb-2">
                <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                <span>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
              </p>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-md text-sm">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-2 py-1 border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-2 py-1 border-l border-gray-300 hover:bg-gray-50 disabled:opacity-50"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1 py-2"
                  disabled={product.stock === 0 || (hasSizes && !selectedSize)}
                >
                  {product.stock === 0 
                    ? 'Out of Stock' 
                    : hasSizes && !selectedSize 
                      ? 'Select Size'
                      : 'Add to Cart'
                  }
                </Button>
              </div>
              
              {/* Size requirement warning */}
              {hasSizes && !selectedSize && (
                <p className="text-xs text-red-500 mt-2">
                  Please select a size before adding to cart
                </p>
              )}
            </div>
            
            {/* Wishlist and Share Actions */}
            <div className="flex flex-col gap-2 pt-3 border-t border-border">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center justify-start gap-2 text-xs h-8"
                onClick={handleWishlistToggle}
              >
                <Heart 
                  className={`h-3.5 w-3.5 ${
                    isInWishlist(product.id) 
                      ? 'text-destructive fill-destructive' 
                      : 'text-muted-foreground'
                  }`}
                />
                <span>
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Save to Wishlist'}
                </span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center justify-start gap-2 text-xs h-8 text-muted-foreground hover:text-foreground"
                onClick={handleShare}
              >
                <Share2 className="h-3.5 w-3.5" />
                <span className="truncate">
                  Share this {product.name.split(' ').slice(0, 3).join(' ')} with friends
                </span>
              </Button>
            </div>

            {/* Product Details Summary */}
            <div className="pt-3 border-t border-border space-y-1.5">
              <p className="text-[10px] text-muted-foreground">
                <span className="font-medium">Category:</span> {product.categoryLevel1}
                {product.categoryLevel2 && ` › ${product.categoryLevel2}`}
              </p>
              <p className="text-[10px] text-muted-foreground">
                <span className="font-medium">Type:</span> {product.serviceType}
              </p>
              {hasSizes && (
                <p className="text-[10px] text-muted-foreground">
                  <span className="font-medium">Sizes:</span> {availableSizes.join(', ')}
                </p>
              )}
            </div>

            {/* Reviews Section */}
            <div className="pt-3 border-t border-border">
              <ProductReview productId={product.id} />
            </div>
          </div>
        </div>
        
        {/* Product Features */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold mb-3">
            Features & Specifications
          </h2>
          <div className="border-t border-border pt-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  <li>Premium quality materials</li>
                  <li>Designed for durability and comfort</li>
                  <li>Easy to maintain and clean</li>
                  {product.tags && product.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex">
                  <span className="font-medium w-20 text-muted-foreground">Category:</span>
                  <span className="text-foreground capitalize">{product.categoryLevel1}</span>
                </div>
                <div className="flex">
                  <span className="font-medium w-20 text-muted-foreground">Subcategory:</span>
                  <span className="text-foreground capitalize">{product.categoryLevel2 || 'N/A'}</span>
                </div>
                {hasSizes && (
                  <div className="flex">
                    <span className="font-medium w-20 text-muted-foreground">Sizes:</span>
                    <span className="text-foreground">{availableSizes.join(', ')}</span>
                  </div>
                )}
                <div className="flex">
                  <span className="font-medium w-20 text-muted-foreground">Unit:</span>
                  <span className="text-foreground capitalize">{product.unit}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <RelatedProductsCarousel products={relatedProducts} title="Related Products" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;