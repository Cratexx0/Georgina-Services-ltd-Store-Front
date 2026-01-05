

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, MapPin, User, Mail, Phone, Loader2, AlertCircle, CheckCircle2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { apiService } from "@/context/ApiService";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Service {
  id: string;
  name: string;
  displayName: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

interface SelectedService {
  serviceId: string;
  features: string[];
  serviceData: Service;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServices: SelectedService[];
  services: Service[];
}

const BookingModal = ({ isOpen, onClose, selectedServices, services }: BookingModalProps) => {
  const { user, isAuthenticated } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(false);

  const [formData, setFormData] = useState({
    customerName: user?.name || "",
    customerEmail: user?.email || "",
    customerPhone: user?.phoneNumber || "",
    address: "",
    specialInstructions: ""
  });

  useEffect(() => {
    if (user && isOpen) {
      setFormData(prev => ({
        ...prev,
        customerName: user.name || prev.customerName,
        customerEmail: user.email || prev.customerEmail,
        customerPhone: user.phoneNumber || prev.customerPhone
      }));
    }
  }, [user, isOpen]);

  const fetchAvailableTimeSlots = async (date: Date) => {
    if (!date) return;
    
    try {
      setFetchingSlots(true);
      const dateString = format(date, 'yyyy-MM-dd');
      console.log('📅 Fetching time slots for date:', dateString);
      
      const response = await apiService.getAvailableTimeSlots(dateString);
      
      console.log('🕒 Time slots response:', response);
      console.log('🕒 Response data:', response.data);
      
      if (response.success) {
        let slotsArray: string[] = [];
        
        if (response.data && typeof response.data === 'object' && 'availableTimeSlots' in response.data) {
          slotsArray = Array.isArray(response.data.availableTimeSlots) ? response.data.availableTimeSlots : [];
        }
        else if (Array.isArray(response.data)) {
          slotsArray = response.data;
        }
        else if (Array.isArray(response.availableSlots)) {
          slotsArray = response.availableSlots;
        }
        else if (Array.isArray(response.timeSlots)) {
          slotsArray = response.timeSlots;
        }
        
        console.log('🕒 Extracted slots array:', slotsArray);
        setAvailableTimeSlots(slotsArray);
        
        if (slotsArray.length === 0) {
          toast.info("No available time slots for selected date");
        } else {
          toast.success(`Found ${slotsArray.length} available time slot${slotsArray.length !== 1 ? 's' : ''}`);
        }
      } else {
        setAvailableTimeSlots([]);
        toast.error("Failed to fetch available time slots");
      }
    } catch (error: any) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
      toast.error("Error fetching available time slots");
    } finally {
      setFetchingSlots(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setSelectedTime("");
    if (date) {
      fetchAvailableTimeSlots(date);
    } else {
      setAvailableTimeSlots([]);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, selectedService) => {
      return total + selectedService.serviceData.price;
    }, 0);
  };

  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, selectedService) => {
      return total + selectedService.serviceData.duration;
    }, 0);
  };

  const validateForm = () => {
    const errors: string[] = [];
    
    if (!formData.customerName.trim()) {
      errors.push("Full name is required");
    } else if (formData.customerName.trim().length < 2) {
      errors.push("Name must be at least 2 characters");
    }
    
    if (!formData.customerEmail.trim()) {
      errors.push("Email address is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      errors.push("Please enter a valid email address");
    }
    
    if (!formData.customerPhone.trim()) {
      errors.push("Phone number is required");
    } else if (formData.customerPhone.trim().length < 10) {
      errors.push("Please enter a valid phone number");
    }
    
    if (!formData.address.trim()) {
      errors.push("Address is required");
    } else if (formData.address.trim().length < 10) {
      errors.push("Please provide a complete address");
    }
    
    if (!selectedDate) {
      errors.push("Please select a booking date");
    }
    
    if (!selectedTime) {
      errors.push("Please select a time slot");
    }
    
    if (!isAuthenticated || !user) {
      errors.push("You must be logged in to book a service");
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      toast.error("Please fix the following errors:", {
        description: validationErrors.join(". ")
      });
      return;
    }

    if (!isAuthenticated || !user) {
      toast.error("Authentication required", {
        description: "Please log in to book a service"
      });
      return;
    }

    setLoading(true);
    
    // Show immediate feedback
    const loadingToast = toast.loading('Processing your booking...', {
      description: 'Please wait while we confirm your appointment'
    });

    try {
      const bookingPromises = selectedServices.map(selectedService => {
        const bookingData = {
          customerName: formData.customerName.trim(),
          customerEmail: formData.customerEmail.trim(),
          customerPhone: formData.customerPhone.trim(),
          serviceType: selectedService.serviceData.displayName,
          selectedFeatures: selectedService.features,
          address: formData.address.trim(),
          date: format(selectedDate!, 'yyyy-MM-dd'),
          time: selectedTime,
          duration: selectedService.serviceData.duration,
          price: selectedService.serviceData.price,
          specialInstructions: formData.specialInstructions.trim(),
          userId: user.id
        };

        console.log('Sending booking data:', bookingData);
        return apiService.createBooking(bookingData);
      });

      const results = await Promise.all(bookingPromises);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        toast.success(`Booking Confirmed! 🎉`, {
          description: `Successfully booked ${selectedServices.length} service${selectedServices.length !== 1 ? 's' : ''}. You'll receive a confirmation email shortly.`,
          duration: 5000
        });
        
        // Close modal immediately after success
        handleClose();
      } else {
        const failedCount = results.filter(r => !r.success).length;
        toast.error("Booking Failed", {
          description: `${failedCount} of ${selectedServices.length} booking${failedCount !== 1 ? 's' : ''} failed. Please try again.`
        });
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.dismiss(loadingToast);
      toast.error("Booking Error", {
        description: error.message || "Unable to complete your booking. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDate(undefined);
    setSelectedTime("");
    setAvailableTimeSlots([]);
    setFormData({
      customerName: user?.name || "",
      customerEmail: user?.email || "",
      customerPhone: user?.phoneNumber || "",
      address: "",
      specialInstructions: ""
    });
    onClose();
  };

  const formatTimeSlot = (slot: string) => {
    return slot.replace(/([AP]M)/, ' $1');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Book Your Services
          </DialogTitle>
        </DialogHeader>

        {!isAuthenticated && (
          <Alert variant="destructive" className="mx-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              You need to be logged in to book services. Please log in or create an account.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-5 gap-6 overflow-y-auto px-6 pb-6">
          <div className="md:col-span-2 space-y-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-4 border border-primary/20">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-base">Selected Services</h3>
              </div>
              
              <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2">
                {selectedServices.map((selectedService, index) => (
                  <div key={selectedService.serviceId} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-start gap-2">
                        <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm leading-tight">{selectedService.serviceData.displayName}</h4>
                          <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {selectedService.serviceData.duration}h duration
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold">
                        £{selectedService.serviceData.price}
                      </Badge>
                    </div>
                    
                    {selectedService.features.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5">Included Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {selectedService.features.map((feature, fIndex) => (
                            <Badge key={fIndex} variant="secondary" className="text-xs py-0 px-2 h-5">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-base mb-3">Order Summary</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Services:</span>
                  <span className="font-semibold">{selectedServices.length}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Duration:</span>
                  <span className="font-semibold">{calculateTotalDuration()} hours</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Features:</span>
                  <span className="font-semibold">
                    {selectedServices.reduce((total, service) => total + service.features.length, 0)}
                  </span>
                </div>
                <div className="border-t border-gray-300 pt-2.5 mt-2.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-base">Total Amount:</span>
                    <span className="font-bold text-xl text-primary">£{calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="space-y-4" onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="customerName" className="text-xs font-medium">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="customerName"
                        placeholder="John Doe"
                        value={formData.customerName}
                        onChange={(e) => handleInputChange('customerName', e.target.value)}
                        className="pl-10 h-9 text-sm"
                        required
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="customerPhone" className="text-xs font-medium">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="customerPhone"
                        placeholder="+233 24 123 4567"
                        value={formData.customerPhone}
                        onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                        className="pl-10 h-9 text-sm"
                        required
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="customerEmail" className="text-xs font-medium">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="customerEmail"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.customerEmail}
                        onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                        className="pl-10 h-9 text-sm"
                        required
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor="address" className="text-xs font-medium">Service Address *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Enter your complete address (Street, Area, City)"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="pl-10 min-h-[70px] text-sm resize-none"
                        required
                        disabled={!isAuthenticated}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Schedule Appointment
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Preferred Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal h-9 text-sm",
                            !selectedDate && "text-muted-foreground"
                          )}
                          disabled={!isAuthenticated}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={handleDateSelect}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs font-medium">Preferred Time *</Label>
                    
                    {!selectedDate ? (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-gray-50">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="font-medium">Please select a date first</p>
                        <p className="text-xs mt-1">Available time slots will appear here</p>
                      </div>
                    ) : fetchingSlots ? (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-blue-50">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                        <p className="font-medium">Loading available time slots...</p>
                        <p className="text-xs mt-1">Please wait a moment</p>
                      </div>
                    ) : !Array.isArray(availableTimeSlots) || availableTimeSlots.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground text-sm border-2 border-dashed rounded-lg bg-orange-50">
                        <AlertCircle className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                        <p className="font-medium">No available time slots</p>
                        <p className="text-xs mt-1">Please try a different date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto p-2 border rounded-lg bg-gray-50">
                        {availableTimeSlots.map((timeSlot) => (
                          <Button
                            key={timeSlot}
                            type="button"
                            variant={selectedTime === timeSlot ? "default" : "outline"}
                            onClick={() => setSelectedTime(timeSlot)}
                            className={cn(
                              "flex items-center justify-center gap-1.5 h-10 text-xs font-medium transition-all",
                              selectedTime === timeSlot && "shadow-md scale-105"
                            )}
                            disabled={!isAuthenticated}
                          >
                            <Clock className="h-3.5 w-3.5" />
                            {formatTimeSlot(timeSlot)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <Label htmlFor="specialInstructions" className="text-xs font-medium mb-2 block">
                  Special Instructions (Optional)
                </Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special requirements, access instructions, or preferences..."
                  value={formData.specialInstructions}
                  onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                  className="min-h-[70px] text-sm resize-none"
                  disabled={!isAuthenticated}
                />
              </div>

              <Button 
                type="submit" 
                onClick={handleSubmit}
                className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all" 
                size="lg"
                disabled={loading || !selectedDate || !selectedTime || fetchingSlots || !isAuthenticated}
              >
                {!isAuthenticated ? (
                  <>
                    <AlertCircle className="h-5 w-5 mr-2" />
                    Please Log In to Book
                  </>
                ) : loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-5 w-5 mr-2" />
                    Confirm Booking - £{calculateTotalPrice()}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;