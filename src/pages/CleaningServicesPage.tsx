


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Clock, CheckCircle, SlidersHorizontal, ChevronDown, ChevronUp, Home, Wind, Droplets, Briefcase, Armchair, Zap, Brush, Building } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { toast } from '@/components/ui/sonner';
import { apiService } from '@/context/ApiService';
import BookingModal from '@/components/modals/BookingModal';
import { ServiceCardSkeleton } from '@/components/Loader/SkeletonLoader';

// Use the same interface structure as BookingModal
interface Service {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  icon?: string;
  category?: string;
  status?: string;
  subcategory?: string;
  packageIncludes?: string[];
}

interface SelectedService {
  serviceId: string;
  features: string[];
  serviceData: Service;
}



const CleaningServicesPage = () => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [activeSubcategory, setActiveSubcategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>('name');
  const [expandedServices, setExpandedServices] = useState<Record<string, boolean>>({});
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<SelectedService[]>([]);
  const [loading, setLoading] = useState(true);

  // Load services from API
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoading(true);
        const response = await apiService.getActiveServices();
        
        console.log('API Response:', response); // Debug log
        
        if (response.success && Array.isArray(response.data)) {
          // Transform API data to match our Service interface
          const transformedServices = response.data.map((service: any) => ({
            id: service.id?.toString(), // Convert to string
            name: service.name,
            displayName: service.displayName,
            description: service.description,
            price: service.price,
            duration: service.duration,
            features: service.features || [],
            icon: service.icon,
            category: service.category,
            subcategory: service.category // Use category as subcategory for filtering
          }));
          console.log('Transformed Services:', transformedServices); // Debug log
          setServices(transformedServices);
        } else {
          console.warn('Unexpected response format:', response);
          toast.error('Failed to load services - unexpected data format');
          setServices([]);
        }
      } catch (error) {
        console.error('Error loading services:', error);
        toast.error('Failed to load services');
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    loadServices();
  }, []);

  const subcategories = [
    { id: 'all', name: 'All Services' },
    { id: 'residential', name: 'Residential Services' },
    { id: 'commercial', name: 'Commercial Services' },
  ];

  const getFilteredAndSortedServices = () => {
    let filtered = services;

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
          return a.displayName.localeCompare(b.displayName);
      }
    });

    return sorted;
  };

  const filteredServices = getFilteredAndSortedServices();

  const toggleServiceExpansion = (serviceId: string) => {
    setExpandedServices(prev => ({
      ...prev,
      [serviceId]: !prev[serviceId]
    }));
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    
    // Add service to selected services for BookingModal
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedServices([{
        serviceId,
        features: service.features || [],
        serviceData: service
      }]);
      setShowBookingModal(true);
    }
  };

  const handleCloseBooking = () => {
    setShowBookingModal(false);
    setSelectedServices([]);
    setSelectedService('');
  };

  const getSelectedServiceDetails = (): Service | undefined => {
    return services.find(s => s.id === selectedService);
  };

  const ServiceIcon = ({ iconName }: { iconName: string }) => {
    const iconMap: { [key: string]: any } = {
      'droplets': Droplets,
      'wind': Wind,
      'home': Home,
      'building': Building,
      'brush': Brush,
      'zap': Zap,
      'briefcase': Briefcase,
      'armchair': Armchair,
    };
    
    const IconComponent = iconMap[iconName] || Sparkles;
    return <IconComponent className="h-6 w-6 text-teal-600" />;
  };

  const formatDuration = (duration: number) => {
    if (duration === 1) return "1 hour";
    return `${duration} hours`;
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner - Why Choose Us */}
        <div className="relative h-[400px] mb-12">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1200&h=400&fit=crop" 
              alt="Cleaning Service"
              className="w-full h-full object-cover"
            />
            {/* <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 to-teal-700/70"></div> */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60"></div>
          </div>
          
          <div className="relative container mx-auto px-4 h-full flex items-center">
            <div className="max-w-4xl text-white">
              <h1 className="text-5xl font-bold mb-4">Professional Cleaning Services</h1>
              <p className="text-xl mb-8 text-teal-50">
                Experience the difference with our expert cleaning team
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Professional Team</h3>
                    <p className="text-sm text-teal-50">Experienced and trained professionals</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">Eco-Friendly</h3>
                    <p className="text-sm text-teal-50">Safe and green cleaning solutions</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">100% Satisfaction</h3>
                    <p className="text-sm text-teal-50">Guaranteed quality service</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-7xl mx-auto">
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

            {services.length === 0 && !loading ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Services Available</h3>
                <p className="text-gray-500">Please check back later for our cleaning services.</p>
              </div>
            ) : filteredServices.length === 0 && !loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No services found in this category</p>
                <Button 
                  onClick={() => setActiveSubcategory('all')}
                  variant="outline"
                  className="mt-4"
                >
                  View All Services
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  // Show skeleton loaders while loading
                  Array.from({ length: 6 }).map((_, index) => (
                    <ServiceCardSkeleton key={index} />
                  ))
                ) : (
                  // Show actual services when loaded
                  filteredServices.map((service) => (
                    <Card
                      key={service.id}
                      className="transition-all hover:shadow-lg"
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-teal-50 rounded-lg">
                              <ServiceIcon iconName={service.icon || 'sparkles'} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{service.displayName}</CardTitle>
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
                            {formatDuration(service.duration)}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-semibold text-sm mb-2">Package Includes:</h4>
                          <div className="space-y-1">
                            {service.features.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                            {expandedServices[service.id] && service.features.slice(3).map((item, index) => (
                              <div key={index + 3} className="flex items-start gap-2 text-sm text-gray-600">
                                <CheckCircle className="h-4 w-4 text-teal-600 flex-shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                          {service.features.length > 3 && (
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
                                  +{service.features.length - 3} More Features
                                </>
                              )}
                            </button>
                          )}
                        </div>

                        <Button
                          className="w-full"
                          onClick={() => handleSelectService(service.id)}
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Booking Modal */}
        <BookingModal
          isOpen={showBookingModal}
          onClose={handleCloseBooking}
          selectedServices={selectedServices}
          services={services}
        />
      </div>
    </Layout>
  );
};

export default CleaningServicesPage;