import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { Check, Calendar, Mail, ArrowRight, Home, CheckCircle2, Clock, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { useBooking } from "@/context/BookingContext";

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { refreshBookings } = useBooking();
  const sessionId = searchParams.get('session_id');
  const paymentIntentId = location.state?.paymentIntentId;
  const [showConfetti, setShowConfetti] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const hasShownToast = useRef(false); // Track if toast has been shown
  const hasRefreshed = useRef(false); // Track if bookings have been refreshed

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Hide confetti animation after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000);

    // Refresh bookings immediately to show the new booking (only once)
    if (!hasRefreshed.current) {
      hasRefreshed.current = true;
      refreshBookings().then(() => {
        console.log('✅ Bookings refreshed after successful payment');
      }).catch(error => {
        console.error('❌ Failed to refresh bookings:', error);
      });
    }

    // Check if we have either session_id or paymentIntentId
    const hasValidSession = sessionId || paymentIntentId;
    
    // Only show toasts once
    if (!hasShownToast.current) {
      hasShownToast.current = true;
      
      if (!hasValidSession) {
        console.warn('⚠️ No session_id or paymentIntentId found');
        toast.error("No booking session found");
        setTimeout(() => navigate("/"), 5000);
      } else {
        // Show success message
        console.log('✅ Valid booking session:', sessionId || paymentIntentId);
        toast.success("Booking Confirmed!", {
          description: "Your payment was successful. Check your email for confirmation.",
          duration: 5000
        });
      }

      // Process any pending payments from localStorage
      const pendingPayments = localStorage.getItem('pendingBookingPayments');
      if (pendingPayments) {
        const payments = JSON.parse(pendingPayments);
        if (payments.length > 0) {
          toast.info("Multiple Bookings Pending", {
            description: `You have ${payments.length} more booking${payments.length !== 1 ? 's' : ''} to complete payment for.`
          });
        }
      }
    }

    return () => clearTimeout(timer);
  }, [sessionId, paymentIntentId, navigate]);
  // Removed refreshBookings from dependencies to prevent re-renders

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* Confetti animation */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="animate-bounce delay-100 absolute top-20 left-1/4 w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="animate-bounce delay-200 absolute top-32 left-1/3 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="animate-bounce delay-300 absolute top-24 right-1/4 w-3 h-3 bg-pink-400 rounded-full"></div>
            <div className="animate-bounce delay-150 absolute top-40 right-1/3 w-2 h-2 bg-green-400 rounded-full"></div>
            <div className="animate-bounce delay-75 absolute top-16 left-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
            <div className="animate-bounce delay-300 absolute top-28 right-1/2 w-3 h-3 bg-orange-400 rounded-full"></div>
          </div>
        )}

        <div className="max-w-4xl mx-auto relative z-10">
          {/* Success Icon and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg mb-6 animate-pulse">
              <Check className="h-10 w-10 text-white" strokeWidth={3} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-3">
              Booking Confirmed!
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              🎉 Thank you for your booking! Your payment was successful and your service appointment has been confirmed.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Booking Details Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Booking Details
                  </h3>
                </div>

                <div className="space-y-4">
                  {(sessionId || paymentIntentId) && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">{sessionId ? 'Session ID:' : 'Payment ID:'}</span>
                      <span className="text-sm font-mono text-gray-900 truncate ml-2 max-w-[200px]">
                        {(sessionId || paymentIntentId || '').slice(0, 20)}...
                      </span>
                    </div>
                  )}

                  <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-emerald-900 mb-1">Payment Confirmed</p>
                        <p className="text-sm text-emerald-700">
                          Your payment has been processed successfully
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-blue-900 mb-1">Confirmation Email Sent</p>
                        <p className="text-sm text-blue-700">
                          Check your email for booking details and instructions
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps Card */}
            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    What's Next?
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-sm">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Email Confirmation</p>
                      <p className="text-sm text-gray-600">
                        You'll receive a detailed confirmation email with your booking information
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-sm">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Service Preparation</p>
                      <p className="text-sm text-gray-600">
                        Our team will prepare for your appointment and contact you if needed
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-sm">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Service Delivery</p>
                      <p className="text-sm text-gray-600">
                        We'll arrive at your scheduled time to provide the service
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <Button
                  asChild
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Link to="/dashboard?tab=bookings" className="flex items-center justify-center gap-2">
                    <Calendar className="h-5 w-5" />
                    View My Bookings
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 border-2 hover:bg-gray-50"
                >
                  <Link to="/" className="flex items-center justify-center gap-2">
                    <Home className="h-5 w-5" />
                    Back to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              Need help? Contact us at{" "}
              <a href="mailto:support@georgina-services.com" className="text-emerald-600 hover:underline font-medium">
                support@georgina-services.com
              </a>
            </p>
            <p className="text-xs text-gray-500">
              Booking confirmation reference has been sent to your email
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingSuccess;
