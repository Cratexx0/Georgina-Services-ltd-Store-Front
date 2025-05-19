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
      <div className="container mx-auto px-4 py-8"> {/* Reduced padding from py-12 to py-8 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8"> {/* Reduced gap from gap-12 to gap-8 */}
          {/* Product Images - Updated section */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-50 flex items-center justify-center p-4"> {/* Changed bg-gray-100 to bg-gray-50 and added p-4 */}
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className="w-full h-auto max-h-[400px] object-contain object-center" 
                // Removed fixed height and padding, added max-height
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto py-2"> {/* Added overflow and padding */}
                {product.images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    } rounded-md overflow-hidden h-16 w-16`} // Reduced thumbnail size from h-20 w-20
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
          <div className="space-y-4"> {/* Added space-y-4 for consistent spacing */}
            <h1 className="text-2xl font-bold"> {/* Reduced from text-3xl */}
              {product.name}
            </h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`w-4 h-4 ${ // Reduced star size from w-5 h-5
                      index < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.likes} reviews)
              </span>
            </div>
            
            <div className="py-2"> {/* Added padding */}
              {product.discountPrice ? (
                <div className="flex items-center">
                  <span className="text-xl font-bold text-gray-900"> {/* Reduced from text-2xl */}
                    ${product.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-base text-gray-500 line-through ml-2"> {/* Reduced from text-lg */}
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="ml-2 text-xs font-medium text-red-500"> {/* Reduced from text-sm */}
                    {Math.round((1 - product.discountPrice / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-xl font-bold text-gray-900"> {/* Reduced from text-2xl */}
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            
            <p className="text-gray-700 text-sm"> {/* Added text-sm */}
              {product.description}
            </p>
            
            {/* Stock and quantity selector */}
            <div className="border-t border-gray-200 pt-4"> {/* Reduced padding from pt-6 */}
              <p className="flex items-center text-xs mb-2"> {/* Reduced text size */}
                <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                <span>{product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}</span>
              </p>
              
              <div className="flex items-center space-x-3"> {/* Reduced space-x-4 to space-x-3 */}
                <div className="flex items-center border border-gray-300 rounded-md text-sm"> {/* Added text-sm */}
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-2 py-1 border-r border-gray-300" // Reduced padding
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-3 py-1">{quantity}</span> {/* Reduced padding */}
                  <button 
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-2 py-1 border-l border-gray-300" // Reduced padding
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <Button 
                  onClick={handleAddToCart} 
                  className="flex-1 py-2" // Added py-2
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-4"> {/* Reduced space-x-4 to space-x-3 and added pt-4 */}
              <Button variant="outline" size="sm" className="flex items-center space-x-1"> {/* Added size="sm" */}
                <Heart className="h-4 w-4" /> {/* Reduced icon size */}
                <span>Wishlist</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-1"> {/* Added size="sm" */}
                <Share2 className="h-4 w-4" /> {/* Reduced icon size */}
                <span>Share</span>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product details - Compact version */}
        <div className="mt-8"> {/* Reduced from mt-12 */}
          <h2 className="text-xl font-bold mb-4"> {/* Reduced from text-2xl */}
            Product Details
          </h2>
          <div className="border-t border-gray-200 pt-4"> {/* Reduced from pt-6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm"> {/* Added text-sm */}
                  Features
                </h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-700"> {/* Added text-sm */}
                  <li>Premium quality materials</li>
                  <li>Designed for durability and comfort</li>
                  <li>Easy to maintain and clean</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm"> {/* Added text-sm */}
                  Specifications
                </h3>
                <div className="space-y-1 text-sm"> {/* Added text-sm */}
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Category:</span> {/* Reduced width */}
                    <span className="text-gray-700">{product.categoryId}</span>
                  </div>
                  <div className="flex">
                    <span className="font-medium w-24 text-gray-600">Subcategory:</span> {/* Reduced width */}
                    <span className="text-gray-700">{product.subcategoryId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12"> {/* Kept this spacing as is */}
            <h2 className="text-xl font-bold mb-4"> {/* Reduced from text-2xl */}
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