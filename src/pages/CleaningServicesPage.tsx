import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Clock, CheckCircle, Star, MapPin } from 'lucide-react';

const CleaningServicesPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');

  const timeSlots = [
    '09:00 - 11:00',
    '11:00 - 13:00',
    '13:00 - 15:00',
    '15:00 - 17:00',
    '17:00 - 19:00'
  ];

  const services = [
    {
      id: 'home-deep-cleaning',
      name: 'Home Deep Cleaning',
      price: 149.99,
      duration: '3-4 hours',
      description: 'Comprehensive deep cleaning of your entire home including all rooms, kitchen, and bathrooms.',
      features: ['All rooms cleaned', 'Kitchen deep clean', 'Bathroom sanitization', 'Vacuum & mop', 'Dusting']
    },
    {
      id: 'office-cleaning',
      name: 'Office Cleaning',
      price: 99.99,
      duration: '2-3 hours',
      description: 'Professional office cleaning with flexible scheduling to suit your business needs.',
      features: ['Desk cleaning', 'Floor cleaning', 'Trash removal', 'Restroom cleaning', 'Window cleaning']
    },
    {
      id: 'carpet-cleaning',
      name: 'Carpet Steam Cleaning',
      price: 79.99,
      duration: '1-2 hours',
      description: 'Professional carpet cleaning using eco-friendly steam methods for deep sanitization.',
      features: ['Steam cleaning', 'Stain removal', 'Eco-friendly', 'Fast drying', 'Sanitization']
    }
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTimeSlot && selectedService) {
      alert(`Booking confirmed for ${selectedService} on ${selectedDate.toDateString()} at ${selectedTimeSlot}`);
    } else {
      alert('Please select a service, date, and time slot.');
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Professional Cleaning Services</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Book professional cleaning services with flexible scheduling. Our experienced team ensures your space is spotless and sanitized.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Service Selection */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Choose Your Service</h2>
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
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{service.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Clock className="h-4 w-4" />
                          {service.duration}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">${service.price}</div>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">4.8</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Select Date & Time</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Choose Date</h3>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-md border w-fit"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-3">Available Time Slots</h3>
              <div className="grid grid-cols-1 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    variant={selectedTimeSlot === slot ? "default" : "outline"}
                    className="justify-start"
                    onClick={() => setSelectedTimeSlot(slot)}
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span className="font-medium">Service Area</span>
              </div>
              <p className="text-sm text-gray-600">
                We serve the entire metropolitan area. Additional charges may apply for locations outside the city center.
              </p>
            </div>

            <Button 
              onClick={handleBooking}
              className="w-full mt-6"
              size="lg"
              disabled={!selectedDate || !selectedTimeSlot || !selectedService}
            >
              Book Service
            </Button>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Professional cleaning you can trust
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Certified Professionals</h3>
              <p className="text-muted-foreground">Trained and background-checked cleaners</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">100% satisfaction or your money back</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Flexible Scheduling</h3>
              <p className="text-muted-foreground">Book at your convenience, 7 days a week</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default CleaningServicesPage;