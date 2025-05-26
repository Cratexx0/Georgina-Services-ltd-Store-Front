import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getProductBySlug, getProductsByCategory } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import ProductGrid from '@/components/products/ProductGrid';
import { toast } from '@/components/ui/sonner';

const ProductPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const product = productSlug ? getProductBySlug(productSlug) : undefined;
  
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`, {
      description: `Quantity: ${quantity}`,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Images - Updated section */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center p-4">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-auto max-h-[400px] object-contain object-center" 
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    } rounded-md overflow-hidden h-16 w-16`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${index < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.likes} reviews)
              </span>
            </div>
            
            <div className="py-2">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-gray-900">
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-base text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs font-medium text-red-500">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 text-sm">
              {product.description}
            </p>
            
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
                    className="px-2 py-1 border-r border-gray-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-2 py-1 border-l border-gray-300"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1 py-2"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </div>
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
              <Button variant="outline" size="sm" className="flex items-center space-x-1">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product details - Compact version */}
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
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm">
                  Specifications
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Category:</span>
                    <span className="text-gray-700">{product.categoryId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Subcategory:</span>
                    <span className="text-gray-700">{product.subcategoryId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">
              Related Products
            </h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
