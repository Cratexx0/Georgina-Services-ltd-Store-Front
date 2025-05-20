import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';

const CheckoutPage = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // In a real implementation, you would call your backend to create a Stripe PaymentIntent
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    // Simulate fetching client secret from backend
    const fetchClientSecret = async () => {
      try {
        setLoading(true);
        // In a real app, you would call your backend API here:
        // const response = await fetch('/api/create-payment-intent', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     items: cart.map(item => ({
        //       id: item.product.id,
        //       quantity: item.quantity
        //     })),
        //     currency: 'usd'
        //   })
        // });
        // const data = await response.json();

        // For demo purposes, we'll just simulate this
        setTimeout(() => {
          setClientSecret('pi_mock_123456789');
          setLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [cart]);

  const handlePayment = async () => {
    try {
      setLoading(true);

      // In a real implementation, you would:
      // 1. Redirect to Stripe Checkout
      // 2. Or use Stripe Elements to confirm the payment

      // Simulate payment processing
      setTimeout(() => {
        setPaymentSuccess(true);
        clearCart();
        setLoading(false);

        toast({
          title: "Payment successful!",
          description: "Your order has been placed.",
        });
      }, 2000);

    } catch (error) {
      toast({
        title: "Payment failed",
        description: "Please try again or use a different payment method.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  if (cart.length === 0 && !paymentSuccess) {
    
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <h1 className="text-2xl font-bold mb-4">No items in cart</h1>
              <p className="text-gray-600 mb-6">
                Your cart is empty. Please add items before checking out.
              </p>
              <Button asChild>
                <Link to="/">Continue Shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (paymentSuccess) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Order Confirmed!</h1>
              <p className="text-gray-600 mb-6">
                Thank you for your purchase. A confirmation email has been sent to your email address.
              </p>
              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link to="/orders">View Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6">Payment Information</h2>

            {/* In a real implementation, you would use Stripe Elements here */}
            <div className="space-y-4">
              <div className="mx-auto w-full max-w-lg">
                <form action="" className="mt-10 flex flex-col space-y-4">
                  <div><label className="text-xs font-semibold text-gray-500">Email</label><input type="email" id="email" name="email" placeholder="john.capler@fang.com" className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500" /></div>
                  <div className="relative"><label className="text-xs font-semibold text-gray-500">Card number</label><input type="text" id="card-number" name="card-number" placeholder="1234-5678-XXXX-XXXX" className="block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 pr-10 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500" /><img src="/images/uQUFIfCYVYcLK0qVJF5Yw.png" alt="" className="absolute bottom-3 right-3 max-h-4" /></div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500">Expiration date</p>
                    <div className="mr-6 flex flex-wrap">
                      <div className="my-1">
                        <label className="sr-only">Select expiration month</label><select name="month" id="month" className="cursor-pointer rounded border-gray-300 bg-gray-50 py-3 px-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500">
                          <option value="">Month</option>
                        </select>
                      </div>
                      <div className="my-1 ml-3 mr-6">
                        <label className="sr-only">Select expiration year</label><select name="year" id="year" className="cursor-pointer rounded border-gray-300 bg-gray-50 py-3 px-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500">
                          <option value="">Year</option>
                        </select>
                      </div>
                      <div className="relative my-1"><label className="sr-only">Security code</label><input type="text" id="security-code" name="security-code" placeholder="Security code" className="block w-36 rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500" /></div>
                    </div>
                  </div>
                  <div><label className="sr-only">Card name</label><input type="text" id="card-name" name="card-name" placeholder="Name on the card" className="mt-1 block w-full rounded border-gray-300 bg-gray-50 py-3 px-4 text-sm placeholder-gray-300 shadow-sm outline-none transition focus:ring-2 focus:ring-blue-500" /></div>
                </form>
                <p className="mt-10 text-center text-sm font-semibold text-gray-500">By placing this order you agree to the <a href="#" className="whitespace-nowrap text-blue-400 underline hover:text-blue-600">Terms and Conditions</a></p>
                <button type="submit" className="mt-4 inline-flex w-full items-center justify-center rounded bg-blue-600 py-2.5 px-4 text-base font-semibold tracking-wide text-white text-opacity-80 outline-none ring-offset-2 transition hover:text-opacity-100 focus:ring-2 focus:ring-blue-500 sm:text-lg">Place Order</button>
              </div>
            </div>


          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {cart.map(item => (
                <div key={item.product.id} className="flex justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                    </div>
                  </div>
                  <div className="font-medium">
                    ${((item.product.discountPrice || item.product.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2">
                <span>Total</span>
                <span>${getTotalPrice().toFixed(2)}</span>
              </div>
            </div>

            <Button
              onClick={handlePayment}
              disabled={loading || !clientSecret}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                `Pay $${getTotalPrice().toFixed(2)}`
              )}
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              By completing your purchase, you agree to our Terms of Service.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;