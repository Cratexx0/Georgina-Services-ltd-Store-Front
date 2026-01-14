import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, Calendar, Clock, MapPin, Package } from "lucide-react";
import { toast } from "sonner";
import StripeProvider from "@/providers/CheckoutProvider";
import CheckoutForm from "@/components/stripe/CheckoutForm";
import type { PaymentIntent } from "@stripe/stripe-js";
import { Badge } from "@/components/ui/badge";

interface BookingService {
  serviceId: string;
  serviceName: string;
  features: string[];
  price: number;
  duration: number;
}

interface BookingCheckoutData {
  selectedServices: BookingService[];
  customerInfo: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    address: string;
    specialInstructions: string;
  };
  appointment: {
    date: string;
    time: string;
  };
  userId: string | number;
}

const BookingCheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState<string>("GB");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isLoadingPayment, setIsLoadingPayment] = useState(false);
  const [bookingData, setBookingData] = useState<BookingCheckoutData | null>(null);
  const [bookingProcessed, setBookingProcessed] = useState(false);

  // Add a global flag to prevent any duplicate processing across re-renders
  const isProcessingRef = React.useRef(false);

  // Load booking data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem('pendingBookingCheckout');
    if (!storedData) {
      toast.error("No booking data found");
      navigate("/cleaning-services");
      return;
    }

    try {
      const data = JSON.parse(storedData) as BookingCheckoutData;
      setBookingData(data);
    } catch (error) {
      toast.error("Invalid booking data");
      navigate("/cleaning-services");
    }
  }, [navigate]);

  // Detect user's country for currency
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (timezone.includes("Europe/London")) {
          setCountryCode("GB");
        } else if (timezone.includes("America/")) {
          setCountryCode("US");
        } else if (timezone.includes("Africa/Accra")) {
          setCountryCode("GH");
        } else {
          setCountryCode("GB");
        }
      } catch (error) {
        setCountryCode("GB");
      }
    };

    detectCountry();
  }, []);

  // Calculate total price
  const totalPrice = bookingData?.selectedServices.reduce(
    (total, service) => total + service.price,
    0
  ) || 0;

  const getCurrency = (code: string): string => {
    if (code === "GB") return "gbp";
    if (code === "GH") return "ghs";
    if (code === "US") return "usd";
    return "gbp";
  };

  // Create PaymentIntent for booking
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!bookingData || !user || clientSecret) return;

      try {
        setIsLoadingPayment(true);

        const paymentData = {
          userId: user.id,
          countryCode,
          amount: Math.round(totalPrice * 100), // Amount in cents
          currency: getCurrency(countryCode),
          services: bookingData.selectedServices,
          customerInfo: bookingData.customerInfo,
          appointment: bookingData.appointment,
          createBookingOnSuccess: false, // Don't create booking until payment succeeds
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://georgina-server-code.onrender.com"}/api/bookings/payment-intent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(paymentData),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Payment Intent API Error:', errorText);
          
          // If endpoint doesn't exist, show helpful message
          if (response.status === 404) {
            throw new Error("Payment endpoint not available. Please add the createBookingPaymentIntent endpoint to your backend.");
          }
          
          throw new Error(`Failed to create payment intent: ${response.status}`);
        }

        const responseData = await response.json();
        const { clientSecret: secret } = responseData;

        if (!secret) {
          throw new Error("No client secret received from server");
        }

        setClientSecret(secret);
      } catch (error: any) {
        console.error("Payment Intent creation error:", error);
        toast.error("Failed to initialize payment", {
          description: error.message || "Please try again"
        });
        setTimeout(() => navigate("/cleaning-services"), 3000);
      } finally {
        setIsLoadingPayment(false);
      }
    };

    createPaymentIntent();
  }, [bookingData, user, countryCode, totalPrice, clientSecret, navigate]);

  // Handle successful payment
  const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
    // ABSOLUTE guard against duplicate processing using ref
    if (isProcessingRef.current) {
      return;
    }

    // Prevent duplicate processing
    if (bookingProcessed || !bookingData) {
      return;
    }

    // Set both guards immediately
    isProcessingRef.current = true;
    setBookingProcessed(true);

    try {
      // Verify payment was actually successful
      if (paymentIntent.status !== 'succeeded') {
        throw new Error(`Payment status is ${paymentIntent.status}, not succeeded`);
      }

      // Create bookings after successful payment
      const bookingPromises = bookingData.selectedServices.map(async (service, index) => {
        const bookingPayload = {
          ...bookingData.customerInfo,
          serviceType: service.serviceName,
          selectedFeatures: service.features,
          date: bookingData.appointment.date,
          time: bookingData.appointment.time,
          duration: service.duration,
          price: service.price,
          userId: bookingData.userId,
          paymentIntentId: paymentIntent.id, // Use paymentIntentId instead of sessionId
          paymentStatus: paymentIntent.status, // Include payment status
          requirePayment: false, // Payment is already completed!
        };

        const response = await fetch(
          `${import.meta.env.VITE_API_URL || "https://georgina-server-code.onrender.com"}/api/bookings`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(bookingPayload),
          }
        );

        const responseData = await response.json();

        if (!response.ok) {
          console.error(`Booking ${index + 1} creation failed:`, responseData);
          throw new Error(responseData.message || `Failed to create booking: ${response.status}`);
        }

        return responseData;
      });

      const results = await Promise.all(bookingPromises);
      
      // Clear session storage
      sessionStorage.removeItem('pendingBookingCheckout');

      // Navigate to success page with replace to prevent back navigation
      navigate("/booking-success", {
        replace: true, // Prevent going back to payment page
        state: {
          bookings: results,
          paymentIntentId: paymentIntent.id,
          amount: totalPrice,
          services: bookingData.selectedServices,
        },
      });

      toast.success("Booking confirmed!", {
        description: `Successfully booked ${bookingData.selectedServices.length} service${bookingData.selectedServices.length !== 1 ? 's' : ''}`
      });
    } catch (error: any) {
      console.error("Booking creation error:", error);
      // Reset flags to allow retry if booking creation failed
      isProcessingRef.current = false;
      setBookingProcessed(false);
      toast.error("Booking creation failed", {
        description: error.message || "Payment was successful but booking failed. Please contact support."
      });
    }
  };

  const handlePaymentError = (error: string) => {
    // Reset flags on payment error to allow retry
    isProcessingRef.current = false;
    setBookingProcessed(false);
    toast.error("Payment failed", {
      description: error
    });
  };

  if (!bookingData) {
    return (
      <Layout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading booking data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cleaning-services")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
          <h1 className="text-3xl font-bold">Complete Your Booking</h1>
          <p className="text-gray-600 mt-2">
            Review your booking details and complete payment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Summary */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {bookingData.selectedServices.map((service, index) => (
                  <div key={index} className="border-b pb-3 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{service.serviceName}</h4>
                      <span className="font-bold text-primary">£{service.price}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      <Clock className="h-3 w-3 inline mr-1" />
                      {service.duration}h duration
                    </p>
                    {service.features.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {service.features.map((feature, fIdx) => (
                          <Badge key={fIdx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-primary">£{totalPrice}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{bookingData.appointment.date}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{bookingData.appointment.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    Service Address
                  </p>
                  <p className="font-medium text-sm">{bookingData.customerInfo.address}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            {isLoadingPayment ? (
              <Card>
                <CardContent className="py-12">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-gray-600">Initializing secure payment...</p>
                  </div>
                </CardContent>
              </Card>
            ) : clientSecret ? (
              <StripeProvider clientSecret={clientSecret}>
                <CheckoutForm
                  clientSecret={clientSecret}
                  amount={Math.round(totalPrice * 100)}
                  currency={getCurrency(countryCode)}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </StripeProvider>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center text-gray-600">
                    <p>Unable to initialize payment. Please try again.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingCheckoutPage;
