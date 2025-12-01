// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import Layout from '@/components/layout/Layout';
// import { Button } from '@/components/ui/button';
// import { Heart, Share2, Star, Loader2 } from 'lucide-react';
// import { useCart } from '@/context/CartContext';
// import { useWishlist } from '@/context/WishlistContext';
// import RelatedProductsCarousel from '@/components/products/RelatedProductsCarousel';
// import { toast } from '@/components/ui/sonner';
// import { apiService } from '@/lib/api'; // Use your ApiService
// import { Product } from '@/lib/type'; // Use your unified Product type

// const ProductPage = () => {
//   const { productSlug } = useParams<{ productSlug: string }>();
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [product, setProduct] = useState<Product | null>(null);
//   const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const { addToCart } = useCart();
//   const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

//   // Fetch product data
// // Fetch product data
// useEffect(() => {
//   const fetchProduct = async () => {
//     if (!productSlug) return;
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // Use the ApiService to get product by slug
//       const productData = await apiService.getProductBySlug(productSlug);
      
//       if (productData) {
//         setProduct(productData);
        
//         // Fetch related products from the same category
//         try {
//           const related = await apiService.getProductsByCategory(productData.categoryLevel1);
//           // Now 'related' is already a Product[] array, so we can filter directly
//           setRelatedProducts(related.filter((p: Product) => p.id !== productData.id).slice(0, 4));
//         } catch (relatedError) {
//           console.error('Error fetching related products:', relatedError);
//           // Fallback: get some products as related
//           const allProductsResponse = await apiService.getProducts();
//           // Access the products array from the response
//           setRelatedProducts(allProductsResponse.products.filter((p: Product) => p.id !== productData.id).slice(0, 4));
//         }
//       } else {
//         setError('Product not found');
//       }
//     } catch (err) {
//       console.error('Error fetching product:', err);
//       setError('Failed to load product');
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchProduct();
// }, [productSlug]);
//   const handleAddToCart = () => {
//     if (!product) return;
    
//     // Check if product is in stock
//     if (product.stock === 0) {
//       toast.error('This product is out of stock');
//       return;
//     }
    
//     // Check if size is required and selected
//     if (product.size && product.size.length > 0 && !selectedSize) {
//       toast.error('Please select a size');
//       return;
//     }
    
//     addToCart(product, quantity);
//     toast.success(`${product.name} added to cart`, {
//       description: `Quantity: ${quantity}${selectedSize ? `, Size: ${selectedSize}` : ''}`,
//     });
//   };

//   const handleWishlistToggle = () => {
//     if (!product) return;
    
//     if (isInWishlist(product.id)) {
//       removeFromWishlist(product.id);
//       toast.success('Removed from wishlist');
//     } else {
//       addToWishlist(product);
//       toast.success('Added to wishlist');
//     }
//   };

//   const handleShare = async () => {
//     if (!product) return;
    
//     const shareData = {
//       title: product.name,
//       text: product.description || '',
//       url: window.location.href,
//     };

//     if (navigator.share) {
//       try {
//         await navigator.share(shareData);
//       } catch (err) {
//         console.log('Error sharing:', err);
//       }
//     } else {
//       // Fallback: copy to clipboard
//       try {
//         await navigator.clipboard.writeText(window.location.href);
//         toast.success('Link copied to clipboard');
//       } catch (err) {
//         console.log('Error copying to clipboard:', err);
//         toast.error('Failed to share product');
//       }
//     }
//   };

//   // Loading state
//   if (loading) {
//     return (
//       <Layout>
//         <div className="container mx-auto px-4 py-12 text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
//           <h2 className="text-xl font-semibold">Loading product...</h2>
//         </div>
//       </Layout>
//     );
//   }

//   // Error state
//   if (error || !product) {
//     return (
//       <Layout>
//         <div className="container mx-auto px-4 py-12 text-center">
//           <h1 className="text-3xl font-bold mb-4">Product not found</h1>
//           <p className="text-gray-600 mb-8">
//             {error || "The product you're looking for doesn't exist or has been removed."}
//           </p>
//           <Button asChild>
//             <Link to="/products">Browse Products</Link>
//           </Button>
//         </div>
//       </Layout>
//     );
//   }

//   // Calculate discount percentage
//   const discountPercentage = product.discountPrice && product.price 
//     ? Math.round((1 - parseFloat(product.discountPrice.toString()) / parseFloat(product.price.toString())) * 100)
//     : 0;

//   // Parse price values
//   const currentPrice = product.discountPrice ? parseFloat(product.discountPrice.toString()) : parseFloat(product.price.toString());
//   const originalPrice = product.discountPrice ? parseFloat(product.price.toString()) : null;

//   return (
//     <Layout>
//       <div className="container mx-auto px-4 py-8">
//         {/* Breadcrumb */}
//         <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
//           <Link to="/" className="hover:text-gray-700">Home</Link>
//           <span>/</span>
//           <Link to="/products" className="hover:text-gray-700">Products</Link>
//           <span>/</span>
//           <span className="text-gray-900">{product.name}</span>
//         </nav>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           {/* Product Images */}
//           <div className="space-y-4">
//             <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center p-4">
//               <img 
//                 src={product.images[selectedImage] || '/api/placeholder/400/400'} 
//                 alt={product.name} 
//                 className="w-full h-auto max-h-[400px] object-contain object-center" 
//                 onError={(e) => {
//                   e.currentTarget.src = '/api/placeholder/400/400';
//                 }}
//               />
//             </div>
//             {product.images.length > 1 && (
//               <div className="flex space-x-2 overflow-x-auto py-2">
//                 {product.images.map((image, index) => (
//                   <button 
//                     key={index}
//                     onClick={() => setSelectedImage(index)}
//                     className={`flex-shrink-0 border-2 ${
//                       selectedImage === index ? 'border-primary' : 'border-transparent'
//                     } rounded-md overflow-hidden h-16 w-16`}
//                   >
//                     <img 
//                       src={image} 
//                       alt={`${product.name} - Image ${index + 1}`}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.currentTarget.src = '/api/placeholder/64/64';
//                       }}
//                     />
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
          
//           {/* Product Info */}
//           <div className="space-y-4">
//             <h1 className="text-2xl font-bold">
//               {product.name}
//             </h1>
            
//             {/* Rating - Using placeholder since your API might not have these */}
//             <div className="flex items-center space-x-2">
//               <div className="flex">
//                 {Array.from({ length: 5 }).map((_, index) => (
//                   <Star
//                     key={index}
//                     className={`w-4 h-4 ${index < 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
//                   />
//                 ))}
//               </div>
//               <span className="text-sm text-gray-600">
//                 4.0 (42 reviews) {/* Placeholder values */}
//               </span>
//             </div>
            
//             {/* Price */}
//             <div className="py-2">
//               {product.discountPrice ? (
//                 <div className="flex items-center">
//                   <span className="text-xl font-bold text-gray-900">
//                     ${currentPrice.toFixed(2)}
//                   </span>
//                   <span className="text-base text-gray-500 line-through ml-2">
//                     ${originalPrice?.toFixed(2)}
//                   </span>
//                   <span className="ml-2 text-xs font-medium text-red-500">
//                     {discountPercentage}% OFF
//                   </span>
//                 </div>
//               ) : (
//                 <span className="text-xl font-bold text-gray-900">
//                   ${currentPrice.toFixed(2)}
//                 </span>
//               )}
//             </div>
            
//             <p className="text-gray-700 text-sm">
//               {product.description || 'No description available'}
//             </p>

//             {/* Stock and quantity selector */}
//             <div className="border-t border-gray-200 pt-4">
//               <p className="flex items-center text-xs mb-2">
//                 <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
//                 <span>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
//               </p>
              
//               <div className="flex items-center space-x-3">
//                 <div className="flex items-center border border-gray-300 rounded-md text-sm">
//                   <button 
//                     onClick={() => setQuantity(q => Math.max(1, q - 1))}
//                     className="px-2 py-1 border-r border-gray-300 hover:bg-gray-50 disabled:opacity-50"
//                     disabled={quantity <= 1}
//                   >
//                     -
//                   </button>
//                   <span className="px-3 py-1">{quantity}</span>
//                   <button 
//                     onClick={() => setQuantity(q => q + 1)}
//                     className="px-2 py-1 border-l border-gray-300 hover:bg-gray-50 disabled:opacity-50"
//                     disabled={quantity >= product.stock}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <Button 
//                   onClick={handleAddToCart} 
//                   className="flex-1 py-2"
//                   disabled={product.stock === 0}
//                 >
//                   {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
//                 </Button>
//               </div>
//             </div>
            
//             <div className="flex space-x-3 pt-4">
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 className="flex items-center space-x-1"
//                 onClick={handleWishlistToggle}
//               >
//                 <Heart 
//                   className={`h-4 w-4 ${
//                     isInWishlist(product.id) 
//                       ? 'text-red-500 fill-red-500' 
//                       : 'text-gray-500'
//                   }`}
//                 />
//                 <span>
//                   {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
//                 </span>
//               </Button>
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 className="flex items-center space-x-1"
//                 onClick={handleShare}
//               >
//                 <Share2 className="h-4 w-4" />
//                 <span>Share</span>
//               </Button>
//             </div>
//           </div>
//         </div>
        
//         {/* Product details */}
//         <div className="mt-8">
//           <h2 className="text-xl font-bold mb-4">
//             Product Details
//           </h2>
//           <div className="border-t border-gray-200 pt-4">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <h3 className="font-medium text-sm">
//                   Features
//                 </h3>
//                 <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
//                   <li>Premium quality materials</li>
//                   <li>Designed for durability and comfort</li>
//                   <li>Easy to maintain and clean</li>
//                   {product.tags && product.tags.map((tag, index) => (
//                     <li key={index}>{tag}</li>
//                   ))}
//                 </ul>
//               </div>
//               <div className="space-y-2">
//                 <h3 className="font-medium text-sm">
//                   Specifications
//                 </h3>
//                 <div className="space-y-1 text-sm">
//                   <div className="flex">
//                     <span className="font-medium w-24 text-gray-600">Category:</span>
//                     <span className="text-gray-700 capitalize">{product.categoryLevel1}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium w-24 text-gray-600">Subcategory:</span>
//                     <span className="text-gray-700 capitalize">{product.categoryLevel2 || 'N/A'}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium w-24 text-gray-600">Type:</span>
//                     <span className="text-gray-700 capitalize">{product.categoryLevel3 || 'N/A'}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium w-24 text-gray-600">Service Type:</span>
//                     <span className="text-gray-700 capitalize">{product.serviceType}</span>
//                   </div>
//                   <div className="flex">
//                     <span className="font-medium w-24 text-gray-600">Unit:</span>
//                     <span className="text-gray-700 capitalize">{product.unit}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Related products */}
//         {relatedProducts.length > 0 && (
//           <div className="mt-12">
//             <RelatedProductsCarousel products={relatedProducts} title="Related Products" />
//           </div>
//         )}
//       </div>
//     </Layout>
//   );
// };

// export default ProductPage;


import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import RelatedProductsCarousel from '@/components/products/RelatedProductsCarousel';
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
            setSelectedSize('');
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
          <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
          <span>/</span>
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
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 ${index < 4 ? 'fill-amber-400 text-amber-400' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">
                4.0 (42 reviews)
              </span>
            </div>
            
            {/* Price */}
            <div className="py-1 md:py-2">
              {product.discountPrice ? (
                <div className="flex items-center flex-wrap gap-2">
                  <span className="text-lg md:text-xl font-semibold text-foreground">
                    ${currentPrice.toFixed(2)}
                  </span>
                  <span className="text-sm md:text-base text-muted-foreground line-through">
                    ${originalPrice?.toFixed(2)}
                  </span>
                  <span className="text-xs font-medium text-destructive">
                    {discountPercentage}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-lg md:text-xl font-semibold text-foreground">
                  ${currentPrice.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
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
            
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={handleWishlistToggle}
              >
                <Heart 
                  className={`h-4 w-4 ${
                    isInWishlist(product.id) 
                      ? 'text-red-500 fill-red-500' 
                      : 'text-gray-500'
                  }`}
                />
                <span>
                  {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center space-x-1"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product details */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Product Details
          </h2>
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm">
                  Features
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                  <li>Premium quality materials</li>
                  <li>Designed for durability and comfort</li>
                  <li>Easy to maintain and clean</li>
                  {product.tags && product.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm">
                  Specifications
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Category:</span>
                    <span className="text-gray-700 capitalize">{product.categoryLevel1}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Subcategory:</span>
                    <span className="text-gray-700 capitalize">{product.categoryLevel2 || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Type:</span>
                    <span className="text-gray-700 capitalize">{product.categoryLevel3 || 'N/A'}</span>
                  </div>
                  {hasSizes && (
                    <div className="flex">
                      <span className="font-medium w-24 text-gray-600">Available Sizes:</span>
                      <span className="text-gray-700">{availableSizes.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Service Type:</span>
                    <span className="text-gray-700 capitalize">{product.serviceType}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Unit:</span>
                    <span className="text-gray-700 capitalize">{product.unit}</span>
                  </div>
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