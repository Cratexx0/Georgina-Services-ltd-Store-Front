
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { getProductBySlug, getProductsByCategory } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ProductGrid from '@/components/products/ProductGrid';
import { toast } from '@/components/ui/sonner';

const ProductPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

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

  // Get related products from the same category
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-full object-contain object-center"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 ${selectedImage === index ? 'border-primary' : 'border-transparent'} rounded-md overflow-hidden h-20 w-20`}
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
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-5 h-5 ${
                      index < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">{product.rating} ({product.likes} reviews)</span>
            </div>
            
            <div className="mb-6">
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-2xl font-bold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-lg text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                  <span className="ml-2 text-sm font-medium text-red-500">
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            <div className="border-t border-gray-200 pt-6 mb-6">
              <p className="flex items-center text-sm mb-4">
                <span className={`h-3 w-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                <span>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
              </p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1 border-r border-gray-300"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-1">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3 py-1 border-l border-gray-300"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1"
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <Heart className="h-5 w-5" />
                <span>Add to Wishlist</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product details */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Product Details</h2>
          <div className="border-t border-gray-200 pt-6">
            <p className="text-gray-700 mb-6">
              {product.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Premium quality materials</li>
                  <li>Designed for durability and comfort</li>
                  <li>Easy to maintain and clean</li>
                  <li>Multi-functional design</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Specifications</h3>
                <div className="space-y-2">
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Category:</span>
                    <span className="text-gray-700">{product.categoryId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Subcategory:</span>
                    <span className="text-gray-700">{product.subcategoryId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Rating:</span>
                    <span className="text-gray-700">{product.rating} / 5</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-32 text-gray-600">Stock:</span>
                    <span className="text-gray-700">{product.stock} units</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
