import React from 'react';
import Layout from '@/components/layout/Layout';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Trash2, ShoppingCart, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';

const WishlistPage: React.FC = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  // Helper function to safely format price
  const formatPrice = (price: any): string => {
    if (!price) return '0.00';
    
    // Convert to number if it's a string
    const priceNumber = typeof price === 'string' ? parseFloat(price) : price;
    
    // Check if it's a valid number
    if (isNaN(priceNumber)) {
      console.error('Invalid price:', price);
      return '0.00';
    }
    
    return priceNumber.toFixed(2);
  };

  // Helper function to get the display price
  const getDisplayPrice = (product: any): string => {
    const price = product.discountPrice || product.price;
    return formatPrice(price);
  };

  // Helper function to get the original price (for showing discount)
  const getOriginalPrice = (product: any): string | null => {
    if (product.discountPrice && product.price) {
      return formatPrice(product.price);
    }
    return null;
  };

  // Helper function to get the first image URL
  const getFirstImage = (product: any): string => {
    if (!product.images && !product.image) {
      return '/api/placeholder/300/300';
    }
    
    // Handle images array
    if (product.images && Array.isArray(product.images) && product.images.length > 0) {
      const firstImage = product.images[0];
      return typeof firstImage === 'string' ? firstImage : '/api/placeholder/300/300';
    }
    
    // Handle single image string
    if (product.image && typeof product.image === 'string') {
      return product.image;
    }
    
    // Fallback
    return '/api/placeholder/300/300';
  };

  if (wishlist.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Heart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your Wishlist is Empty</h1>
            <p className="text-muted-foreground mb-8">
              Start adding products you love to your wishlist!
            </p>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
            <p className="text-muted-foreground">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <Button variant="outline" onClick={clearWishlist}>
              Clear All
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <Link to={`/product/${product.slug}`}>
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={getFirstImage(product)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.src = '/api/placeholder/300/300';
                      }}
                    />
                  </div>
                </Link>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-semibold mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold text-primary">
                    ${getDisplayPrice(product)}
                  </p>
                  {product.discountPrice && product.price && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${getOriginalPrice(product)}
                    </span>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 p-4 pt-0">
                <Button
                  className="flex-1"
                  onClick={() => handleAddToCart(product)}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default WishlistPage;