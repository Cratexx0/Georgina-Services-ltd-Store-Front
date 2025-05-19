
import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { toast } from '@/components/ui/sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="product-card group bg-white rounded-lg overflow-hidden shadow">
      <Link to={`/product/${product.slug}`} className="block h-full">
        <div className="relative h-64 overflow-hidden">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm">
            <Heart className="h-4 w-4 text-gray-500" />
            <span className="sr-only">Likes: {product.likes}</span>
          </div>
          {product.discountPrice && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              SALE
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-medium text-gray-900 line-clamp-1">{product.name}</h3>
            <div className="flex items-center">
              <span className="text-amber-500">★</span>
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {product.discountPrice ? (
                <>
                  <span className="text-lg font-semibold text-gray-900">${product.discountPrice.toFixed(2)}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">${product.price.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-lg font-semibold text-gray-900">${product.price.toFixed(2)}</span>
              )}
            </div>
            <Button 
              size="sm" 
              onClick={handleAddToCart}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Add to cart
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
