

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useOrder, Order } from '@/context/OrderContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const CheckoutPage: React.FC = () => {
  const { cart, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { addOrder } = useOrder();
  const navigate = useNavigate();
  
  const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/test_4gM5kF1NAd2vfF83KU4Rq00';

  const shippingCost = 10.00;
  const taxRate = 0.15; // 15% tax
  const subtotal = getTotalPrice();
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleProceedToStripe = () => {
    try {
      // Create order data for the API
      const orderItems = cart.map(item => ({
        productId: item.product.id.toString(),
        name: item.product.name,
        price: parseFloat(item.product.discountPrice || item.product.price),
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      addOrder({
        items: orderItems,
        shippingAddress: user?.email || 'To be confirmed',
        totalAmount: total,
        paymentMethod: 'stripe',
      });
      
      toast.success('Redirecting to Stripe for secure payment...');
      
      // Redirect to Stripe payment page (clean URL without parameters)
      setTimeout(() => {
        window.location.href = STRIPE_PAYMENT_LINK;
      }, 1000);
      
    } catch (error) {
      toast.error('Failed to process order. Please try again.');
      console.error(error);
    }
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/cart')}
            className="mb-4 md:mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Cart
          </Button>

          <h1 className="text-2xl md:text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
            Review your order and proceed to secure payment
          </p>

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Column - Order Summary */}
            <div className="w-full lg:flex-1">
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                    <ShoppingCart className="h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Products List */}
                  <div className="space-y-3 max-h-[400px] md:max-h-96 overflow-y-auto">
                    {cart.map((item) => {
                      const itemPrice = parseFloat(item.product.discountPrice || item.product.price);
                      const itemTotal = itemPrice * item.quantity;
                      
                      return (
                        <div key={item.product.id} className="flex gap-3 md:gap-4 pb-3 border-b last:border-0">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm md:text-base truncate">{item.product.name}</p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                              Qty: {item.quantity} × ${itemPrice.toFixed(2)}
                            </p>
                            <p className="text-sm md:text-base font-semibold mt-1">
                              ${itemTotal.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Payment Details */}
            <div className="w-full lg:w-[400px] space-y-6">
              {/* Price Breakdown Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">${shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Tax (15%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg md:text-xl font-bold pt-3 border-t">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="p-2 md:p-3 bg-blue-100 rounded-full flex-shrink-0">
                      <CreditCard className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm md:text-base mb-2">Secure Payment with Stripe</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-4">
                        You will be redirected to Stripe's secure payment page to complete your purchase. 
                        Stripe accepts all major credit and debit cards.
                      </p>
                      <div className="flex items-center gap-2">
                        <img 
                          src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" 
                          alt="Stripe" 
                          className="h-5 md:h-6"
                        />
                        <span className="text-xs text-muted-foreground">Powered by Stripe</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Button 
                onClick={handleProceedToStripe} 
                className="w-full h-12 md:h-14 text-base md:text-lg font-semibold"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                <span className="truncate">Proceed to Payment - ${total.toFixed(2)}</span>
              </Button>

              {/* Trust Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs md:text-sm text-muted-foreground pt-4">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;