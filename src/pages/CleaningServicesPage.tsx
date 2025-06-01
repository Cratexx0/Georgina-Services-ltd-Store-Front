import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Star, CheckCircle, ArrowLeft, History } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

interface Booking {
  id: string;
  serviceName: string;
  date: string;
  time: string;
  address: string;
  price: number;
  status: 'confirmed' | 'completed' | 'cancelled';
}

const CleaningServicesPage = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingHistory, setBookingHistory] = useState<Booking[]>([]);
  const { toast } = useToast();

  // Mock booking history - in real app this would come from backend
  useEffect(() => {
    if (isAuthenticated) {
      setBookingHistory([
        {
          id: '1',
          serviceName: 'Home Deep Cleaning',
          date: '2024-01-15',
          time: '10:00 AM',
          address: '123 Main St, City',
          price: 89.99,
          status: 'completed'
        },
        {
          id: '2',
          serviceName: 'Office Cleaning',
          date: '2024-01-22',
          time: '2:00 PM',
          address: '456 Business Ave, City',
          price: 129.99,
          status: 'confirmed'
        }
      ]);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to book cleaning services.",
        variant: "destructive"
      });
      navigate('/auth');
    }
  }, [isAuthenticated, navigate, toast]);

  const cleaningServices = [
    {
      id: 'home-cleaning',
      name: 'Home Deep Cleaning',
      description: 'Complete deep cleaning of your home including all rooms, kitchen, and bathrooms',
      price: 89.99,
      duration: '3-4 hours',
      rating: 4.8,
      reviews: 124,
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400'
    },
    {
      id: 'office-cleaning',
      name: 'Office Cleaning',
      description: 'Professional office cleaning service for workspaces and commercial areas',
      price: 129.99,
      duration: '2-3 hours',
      rating: 4.9,
      reviews: 89,
      image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    },
    {
      id: 'carpet-cleaning',
      name: 'Carpet & Upholstery Cleaning',
      description: 'Deep carpet and furniture cleaning using professional equipment',
      price: 69.99,
      duration: '2-3 hours',
      rating: 4.7,
      reviews: 156,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
    },
    {
      id: 'window-cleaning',
      name: 'Window Cleaning',
      description: 'Interior and exterior window cleaning for crystal clear views',
      price: 45.99,
      duration: '1-2 hours',
      rating: 4.6,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=400'
    }
  ];

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', 
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !address) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsBooking(true);
    
    // Simulate booking process
    setTimeout(() => {
      const selectedServiceData = cleaningServices.find(service => service.id === selectedService);
      if (selectedServiceData) {
        const newBooking: Booking = {
          id: Date.now().toString(),
          serviceName: selectedServiceData.name,
          date: selectedDate,
          time: selectedTime,
          address: address,
          price: selectedServiceData.price,
          status: 'confirmed'
        };
        setBookingHistory(prev => [newBooking, ...prev]);
      }
      
      setIsBooking(false);
      toast({
        title: "Booking Confirmed!",
        description: "Your cleaning service has been booked successfully. You'll receive a confirmation email shortly.",
      });
      
      // Reset form
      setSelectedService('');
      setSelectedDate('');
      setSelectedTime('');
      setAddress('');
      setNotes('');
    }, 2000);
  };

  const selectedServiceData = cleaningServices.find(service => service.id === selectedService);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          asChild
          className="mb-6 flex items-center"
        >
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Professional Cleaning Services</h1>
          <p className="text-gray-600">Book reliable and professional cleaning services for your home or office</p>
        </div>

        <Tabs defaultValue="booking" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="booking">Book Service</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              {t('bookingHistory')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Services Selection */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose Your Service</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {cleaningServices.map((service) => (
                      <Card 
                        key={service.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedService === service.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedService(service.id)}
                      >
                        <CardHeader className="pb-2">
                          <img 
                            src={service.image} 
                            alt={service.name}
                            className="w-full h-32 object-cover rounded-md mb-2"
                          />
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                          <CardDescription className="text-sm">{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl font-bold text-primary">${service.price}</span>
                            <Badge variant="secondary" className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {service.duration}
                            </Badge>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400 mr-1" />
                            <span>{service.rating} ({service.reviews} reviews)</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Date and Time Selection */}
                {selectedService && (
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Select Date & Time</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Date</label>
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTime === time ? "default" : "outline"}
                              size="sm"
                              onClick={() => setSelectedTime(time)}
                              className="text-xs"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Service Address *</label>
                      <Input
                        placeholder="Enter your full address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                      <Textarea
                        placeholder="Any special instructions or areas of focus..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Booking Summary */}
              <div>
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {selectedServiceData ? (
                      <>
                        <div className="border-b pb-4">
                          <h3 className="font-medium">{selectedServiceData.name}</h3>
                          <p className="text-sm text-gray-600">{selectedServiceData.description}</p>
                        </div>
                        
                        {selectedDate && selectedTime && (
                          <div className="border-b pb-4">
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{new Date(selectedDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm mt-1">
                              <Clock className="w-4 h-4 mr-2 text-gray-500" />
                              <span>{selectedTime}</span>
                            </div>
                          </div>
                        )}
                        
                        {address && (
                          <div className="border-b pb-4">
                            <div className="flex items-start text-sm">
                              <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                              <span>{address}</span>
                            </div>
                          </div>
                        )}
                        
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Service Fee</span>
                            <span>${selectedServiceData.price}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax</span>
                            <span>$0.00</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                            <span>Total</span>
                            <span>${selectedServiceData.price}</span>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handleBooking}
                          disabled={!selectedDate || !selectedTime || !address || isBooking}
                          className="w-full"
                        >
                          {isBooking ? (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4 animate-spin" />
                              Booking...
                            </>
                          ) : (
                            'Confirm Booking'
                          )}
                        </Button>

                        <div className="text-xs text-gray-500 text-center">
                          You'll receive a confirmation email and SMS after booking
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-500 text-center">Select a service to see booking details</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{t('bookingHistory')}</h2>
              {bookingHistory.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">No bookings found</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {bookingHistory.map((booking) => (
                    <Card key={booking.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{booking.serviceName}</CardTitle>
                            <CardDescription>
                              {new Date(booking.date).toLocaleDateString()} at {booking.time}
                            </CardDescription>
                          </div>
                          <Badge variant={booking.status === 'completed' ? 'default' : booking.status === 'confirmed' ? 'secondary' : 'destructive'}>
                            {booking.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-start text-sm">
                            <MapPin className="w-4 h-4 mr-2 text-gray-500 mt-0.5" />
                            <span>{booking.address}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Total Paid</span>
                            <span className="font-semibold">${booking.price}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default CleaningServicesPage;
