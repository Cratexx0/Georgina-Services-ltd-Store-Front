import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { toast } from '@/components/ui/sonner';
import { Sparkles, Clock, CheckCircle } from 'lucide-react';
import { useBooking } from '@/context/BookingContext';
import { useNavigate } from 'react-router-dom';

const CleaningServicesPage: React.FC = () => {
  const { addBooking } = useBooking();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
  ];

  const services = [
    {
      id: '1',
      name: 'Office Cleaning',
      description: 'Professional office cleaning services',
      price: 120,
      duration: '2-3 hours',
    },
    {
      id: '2',
      name: 'Kitchen Deep Cleaning',
      description: 'Thorough kitchen sanitization',
      price: 85,
      duration: '1-2 hours',
    },
    {
      id: '3',
      name: 'Bathroom Cleaning',
      description: 'Complete bathroom cleaning',
      price: 60,
      duration: '1 hour',
    },
  ];

  const handleBooking = () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot) {
      toast.error('Please select a service, date, and time slot');
      return;
    }
    
    const service = services.find(s => s.id === selectedService);
    if (!service) return;

    addBooking({
      service: service.name,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      price: service.price,
      address: 'Your Address (To be confirmed)',
    });

    // Reset form
    setSelectedService('');
    setSelectedDate(undefined);
    setSelectedTimeSlot('');
    
    // Navigate to dashboard
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Professional Cleaning Services</h1>
            <p className="text-muted-foreground text-lg">
              Book our professional cleaning services for your home or office
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Service Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Select Service</h2>
              <div className="space-y-4">
                {services.map((service) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedService === service.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {service.name}
                        {selectedService === service.id && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          {service.duration}
                        </div>
                        <p className="text-xl font-bold text-primary">${service.price}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div>
              <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    disabled={(date) => date < new Date()}
                  />
                </CardContent>
              </Card>

              <h3 className="font-semibold mb-3">Available Time Slots</h3>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? 'default' : 'outline'}
                    onClick={() => setSelectedTimeSlot(slot)}
                    className="w-full"
                  >
                    {slot}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Why Choose Us?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Professional Team</h4>
                  <p className="text-sm text-muted-foreground">Experienced cleaners</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Eco-Friendly</h4>
                  <p className="text-sm text-muted-foreground">Safe products</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Satisfaction Guaranteed</h4>
                  <p className="text-sm text-muted-foreground">100% guarantee</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            size="lg"
            className="w-full"
            onClick={handleBooking}
            disabled={!selectedService || !selectedDate || !selectedTimeSlot}
          >
            Book Service
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CleaningServicesPage;
