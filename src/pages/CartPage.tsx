import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, AlertCircle, User } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
const stripe_url =" 'https://buy.stripe.com/test_4gM5kF1NAd2vfF83KU4Rq00'"
  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please log in to continue', {
        description: 'You need to be logged in to proceed to checkout',
      });
      navigate('/auth');
      return;
    }

    toast.success('Redirecting to checkout...', {
      description: 'This would normally connect to Stripe',
    });
    navigate("/checkout");
  };
  
  if (cart.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="flex justify-center mb-4">
                <ShoppingCart className="h-12 w-12 text-gray-400" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-6">
                Looks like you haven't added any products to your cart yet.
              </p>
              <Button asChild>
                <Link to="/">Start Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Shopping Cart ({cart.length} items)</h2>
                  <Button variant="outline" size="sm" onClick={clearCart} className="flex items-center space-x-1">
                    <Trash2 className="h-4 w-4" />
                    <span>Clear Cart</span>
                  </Button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <div key={item.product.id} className="p-6 flex flex-col sm:flex-row items-start">
                    <Link to={`/product/${item.product.slug}`} className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        className="w-20 h-20 object-cover rounded-md"
                      />
                    </Link>
                    
                    <div className="flex-grow">
                      <div className="flex justify-between mb-1">
                        <Link to={`/product/${item.product.slug}`} className="font-semibold text-gray-900 hover:text-primary transition-colors">
                          {item.product.name}
                        </Link>
                        <div className="font-semibold">
                          ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 mb-4">
                        ${(item.product.discountPrice || item.product.price).toFixed(2)} each
                      </p>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2 py-1 border-r border-gray-300"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="px-3 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2 py-1 border-l border-gray-300"
                          >
                            +
                          </button>
                        </div>
                        
                        <button 
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getTotalPrice().toFixed(2)}</span>
                </div>
              </div>
              
              {!isAuthenticated && (
                <div className="bg-amber-50 p-3 rounded-md flex items-start space-x-3 mb-4">
                  <User className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    You need to log in to proceed to checkout
                  </p>
                </div>
              )}
              
              <Button onClick={handleCheckout} className="w-full mb-4">
                {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
              </Button>
              
              <div className="bg-blue-50 p-3 rounded-md flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Shipping and taxes will be calculated at checkout. This is a demo application.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
