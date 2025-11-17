import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Sparkles, Clock, CheckCircle, SlidersHorizontal, ChevronDown, ChevronUp, Home, Wind, Droplets, Briefcase, Armchair, X } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const CleaningServicesPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '1:00 PM - 3:00 PM',
    '3:00 PM - 5:00 PM',
    '5:00 PM - 7:00 PM',
  ];

  const allServices = [
    {
      id: '1',
      name: 'Bathroom Cleaning',
      description: 'Complete bathroom sanitization and deep cleaning',
      price: 100,
      duration: '2 hours',
      subcategory: 'cleaning',
      icon: Droplets,
      packageIncludes: [
        'Toilet cleaning and sanitizing',
        'Shower and tub scrubbing',
        'Mirror and glass polishing',
        'Floor mopping and disinfection',
        'Sink and faucet cleaning'
      ]
    },
    {
      id: '2',
      name: 'Dusting Service',
      description: 'Comprehensive dusting for all surfaces and hard-to-reach areas',
      price: 80,
      duration: '2 hours',
      subcategory: 'cleaning',
      icon: Wind,
      packageIncludes: [
        'Furniture dusting',
        'Ceiling fan cleaning',
        'Baseboards and moldings',
        'Window sill cleaning',
        'Light fixture dusting'
      ]
    },
    {
      id: '3',
      name: 'Kitchen Cleaning',
      description: 'Thorough kitchen deep cleaning and degreasing service',
      price: 200,
      duration: '4 hours',
      subcategory: 'cleaning',
      icon: Home,
      packageIncludes: [
        'Appliance deep cleaning',
        'Cabinet and drawer wiping',
        'Countertop sanitizing',
        'Sink and faucet scrubbing',
        'Floor mopping and degreasing'
      ]
    },
    {
      id: '4',
      name: 'Mopping Service',
      description: 'Professional floor mopping and cleaning service',
      price: 90,
      duration: '2 hours',
      subcategory: 'cleaning',
      icon: Droplets,
      packageIncludes: [
        'All hard floor surfaces',
        'Grout cleaning',
        'Stain removal',
        'Floor polishing',
        'Baseboard wiping'
      ]
    },
    {
      id: '5',
      name: 'Office Cleaning',
      description: 'Professional office space cleaning and maintenance for workspaces',
      price: 150,
      duration: '3 hours',
      subcategory: 'specialized',
      icon: Briefcase,
      packageIncludes: [
        'Desk and workspace cleaning',
        'Floor mopping and vacuuming',
        'Trash and recycling removal',
        'Kitchen/break room cleaning',
        'Window and glass cleaning'
      ]
    },
    {
      id: '6',
      name: 'Vacuuming Service',
      description: 'Deep vacuuming for carpets, rugs, and upholstery',
      price: 85,
      duration: '2 hours',
      subcategory: 'specialized',
      icon: Armchair,
      packageIncludes: [
        'Carpet deep cleaning',
        'Upholstery vacuuming',
        'Rug cleaning',
        'Edge and corner cleaning',
        'Furniture moving (if needed)'
      ]
    },
  ];

  const subcategories = [
    { id: 'all', name: 'All Services' },
    { id: 'cleaning', name: 'Cleaning Services' },
    { id: 'specialized', name: 'Specialized Services' },
  ];

  const getFilteredAndSortedServices = () => {
    let filtered = allServices;

    if (activeSubcategory !== 'all') {
      filtered = filtered.filter(service => service.subcategory === activeSubcategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return sorted;
  };

  const services = getFilteredAndSortedServices();

  const toggleServiceExpansion = (serviceId) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleBooking = () => {
    setShowConfirmModal(true);
  };

  const confirmBooking = () => {
    setShowConfirmModal(false);
    setSelectedService('');
    setSelectedDate(undefined);
    setSelectedTimeSlot('');
  };

  const getSelectedServiceDetails = () => {
    return allServices.find(s => s.id === selectedService);
  };

  const ServiceIcon = ({ icon: Icon }) => <Icon className="h-6 w-6 text-teal-600" />;

  return (
    <Layout>

   
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">Services</h1>
            <p className="text-gray-600 text-lg">
              Professional cleaning services for your home and office
            </p>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {subcategories.map((subcategory) => (
                <Button
                  key={subcategory.id}
                  variant={activeSubcategory === subcategory.id ? 'default' : 'outline'}
                  onClick={() => setActiveSubcategory(subcategory.id)}
                  className="rounded-full"
                >
                  {subcategory.name}
                </Button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={sortBy === 'name' ? 'secondary' : 'ghost'}
                  onClick={() => setSortBy('name')}
                >
                  Name
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'price-asc' ? 'secondary' : 'ghost'}
                  onClick={() => setSortBy('price-asc')}
                >
                  Price: Low to High
                </Button>
                <Button
                  size="sm"
                  variant={sortBy === 'price-desc' ? 'secondary' : 'ghost'}
                  onClick={() => setSortBy('price-desc')}
                >
                  Price: High to Low
                </Button>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">All Services</h2>

          {services.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No services found</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {services.map((service) => (
                <Card
                  key={service.id}
                  className={`transition-all hover:shadow-lg ${
                    selectedService === service.id ? 'ring-2 ring-teal-600' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-teal-50 rounded-lg">
                          <ServiceIcon icon={service.icon} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{service.name}</CardTitle>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="mt-2">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-teal-600">
                        GH₵{service.price}
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                        <Clock className="h-4 w-4" />
                        {service.duration}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Package Includes:</h4>
                      <div className="space-y-1">
                        {service.packageIncludes.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                        {expandedServices[service.id] && service.packageIncludes.slice(3).map((item, index) => (
                          <div key={index + 3} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                      {service.packageIncludes.length > 3 && (
                        <button
                          onClick={() => toggleServiceExpansion(service.id)}
                          className="flex items-center gap-1 text-sm text-teal-600 mt-2 hover:text-teal-700"
                        >
                          {expandedServices[service.id] ? (
                            <>
                              <ChevronUp className="h-4 w-4" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4" />
                              +{service.packageIncludes.length - 3} More Features
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      variant={selectedService === service.id ? 'default' : 'outline'}
                      onClick={() => setSelectedService(service.id)}
                    >
                      {selectedService === service.id ? 'Selected' : 'Select Package'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {selectedService && (
            <div className="grid md:grid-cols-2 gap-8 mb-8 mt-12">
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

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-teal-600" />
                      Why Choose Us?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Professional Team</h4>
                          <p className="text-sm text-gray-600">
                            Experienced and trained cleaning professionals
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Eco-Friendly Products</h4>
                          <p className="text-sm text-gray-600">
                            Safe and environmentally friendly cleaning solutions
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-semibold mb-1">Satisfaction Guaranteed</h4>
                          <p className="text-sm text-gray-600">
                            100% satisfaction guarantee on all services
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  size="lg"
                  className="w-full mt-6"
                  onClick={handleBooking}
                  disabled={!selectedService || !selectedDate || !selectedTimeSlot}
                >
                  Book Service Now
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription>
              Your cleaning service has been successfully booked.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="border-l-4 border-teal-600 pl-4">
              <p className="text-sm font-semibold text-gray-600">Service</p>
              <p className="text-base font-bold">{getSelectedServiceDetails()?.name}</p>
            </div>
            
            <div className="border-l-4 border-teal-600 pl-4">
              <p className="text-sm font-semibold text-gray-600">Date</p>
              <p className="text-base font-bold">
                {selectedDate?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            
            <div className="border-l-4 border-teal-600 pl-4">
              <p className="text-sm font-semibold text-gray-600">Time Slot</p>
              <p className="text-base font-bold">{selectedTimeSlot}</p>
            </div>
            
            <div className="border-l-4 border-teal-600 pl-4">
              <p className="text-sm font-semibold text-gray-600">Total Price</p>
              <p className="text-2xl font-bold text-teal-600">
                GH₵{getSelectedServiceDetails()?.price}
              </p>
            </div>
          </div>

          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
            >
              View Booking
            </Button>
            <Button
              type="button"
              onClick={confirmBooking}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
     </Layout>
  );
};

export default CleaningServicesPage;