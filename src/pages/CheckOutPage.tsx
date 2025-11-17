
import React, { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle, ArrowLeft, CreditCard, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';


const CheckoutPage = () => {
  const { cart, clearCart, getTotalPrice } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'US'
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [mobileMoneyInfo, setMobileMoneyInfo] = useState({
    phoneNumber: '',
    provider: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  

  // Simulate fetching client secret from backend
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
      return;
    }

    const fetchClientSecret = async () => {
      try {
        setLoading(true);
        // In a real app, you would call your backend API here
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
  }, [cart, navigate, toast]);

  const handlePayment = async () => {
    // Validate billing information
    if (!billingInfo.email || !billingInfo.firstName || !billingInfo.lastName || 
        !billingInfo.address || !billingInfo.city || !billingInfo.zipCode) {
      toast({
        title: "Missing Information",
        description: "Please fill in all billing information fields",
        variant: "destructive"
      });
      return;
    }

    // Validate payment method specific info
    if (paymentMethod === 'card') {
      if (!cardInfo.cardNumber || !cardInfo.expiryDate || !cardInfo.cvv || !cardInfo.cardName) {
        toast({
          title: "Missing Card Information",
          description: "Please fill in all card details",
          variant: "destructive"
        });
        return;
      }
    } else if (paymentMethod === 'mobile_money') {
      if (!mobileMoneyInfo.phoneNumber || !mobileMoneyInfo.provider) {
        toast({
          title: "Missing Mobile Money Information",
          description: "Please fill in mobile money details",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setLoading(true);

      // Simulate payment processing
      setTimeout(() => {
        setPaymentSuccess(true);
        clearCart();
        setLoading(false);

        toast({
          title: "Payment successful!",
          description: "Your order has been placed and you'll receive a confirmation email shortly.",
        });
      }, 3000);

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
            <h2 className="text-xl font-bold mb-6">Checkout</h2>

            {/* Billing Information */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold">Billing Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                    placeholder="john@example.com"
                  />
                </div>
                <div></div>
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={billingInfo.firstName}
                    onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={billingInfo.lastName}
                    onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                    placeholder="Doe"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={billingInfo.city}
                    onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                    placeholder="New York"
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code *</Label>
                  <Input
                    id="zipCode"
                    value={billingInfo.zipCode}
                    onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                    placeholder="10001"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Payment Method</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Credit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('mobile_money')}
                  className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${
                    paymentMethod === 'mobile_money' ? 'border-primary bg-primary/5' : 'border-gray-200'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Mobile Money
                </button>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={cardInfo.cardNumber}
                      onChange={(e) => setCardInfo({...cardInfo, cardNumber: e.target.value})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={cardInfo.expiryDate}
                        onChange={(e) => setCardInfo({...cardInfo, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={cardInfo.cvv}
                        onChange={(e) => setCardInfo({...cardInfo, cvv: e.target.value})}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      value={cardInfo.cardName}
                      onChange={(e) => setCardInfo({...cardInfo, cardName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {/* Mobile Money Form */}
              {paymentMethod === 'mobile_money' && (
                <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
                  <div>
                    <Label htmlFor="provider">Mobile Money Provider *</Label>
                    <Select onValueChange={(value) => setMobileMoneyInfo({...mobileMoneyInfo, provider: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                        <SelectItem value="airtel">Airtel Money</SelectItem>
                        <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                        <SelectItem value="tigo">Tigo Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      value={mobileMoneyInfo.phoneNumber}
                      onChange={(e) => setMobileMoneyInfo({...mobileMoneyInfo, phoneNumber: e.target.value})}
                      placeholder="+233 XX XXX XXXX"
                    />
                  </div>
                </div>
              )}
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
              Your payment is secured with Stripe. We never store your payment information.
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
