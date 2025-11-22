import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { apiService } from './ApiService';

export interface Booking {
  id: string;
  service: string;
  date: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  address: string;
  createdAt: Date;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  serviceType?: string;
  duration?: number;
  selectedFeatures?: string[];
  specialInstructions?: string;
}

interface BookingContextType {
  bookings: Booking[];
  isLoading: boolean;
  addBooking: (bookingData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    address: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    selectedFeatures?: string[];
    specialInstructions?: string;
  }) => Promise<void>;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string, cancellationReason?: string) => Promise<void>;
  refreshBookings: () => Promise<void>;
  getUpcomingBookings: () => Booking[];
  getRecentBookings: () => Booking[];
  getAvailableBookingSlots: (date: string) => Promise<{
    success: boolean;
    data?: string[];
    availableSlots?: string[];
    timeSlots?: string[];
  }>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load bookings on component mount
  useEffect(() => {
    refreshBookings();
  }, []);

const refreshBookings = async () => {
  try {
    setIsLoading(true);
    const response = await apiService.getMyBookings();
    
    console.log('📅 Bookings API Response:', response); // Debug log
    
    if (response.success) {
      // Handle different response structures for bookings
      let apiBookings: any[] = [];
      
      if (Array.isArray(response.data)) {
        // Structure: { data: [] }
        apiBookings = response.data;
      } else if (Array.isArray(response.bookings)) {
        // Structure: { bookings: [] }
        apiBookings = response.bookings;
      } else if (Array.isArray(response)) {
        // Structure: direct array response
        apiBookings = response;
      } else if (response.data && Array.isArray(response.data.bookings)) {
        // Structure: { data: { bookings: [] } }
        apiBookings = response.data.bookings;
      } else if (response.data && typeof response.data === 'object') {
        // Structure: { data: { items: [] } } or similar
        // Try to find any array property in data
        for (const key in response.data) {
          if (Array.isArray(response.data[key])) {
            apiBookings = response.data[key];
            break;
          }
        }
      }
      
      console.log('📅 Extracted bookings array:', apiBookings); // Debug log
      
      // Transform API bookings to local Booking type
      const transformedBookings: Booking[] = apiBookings.map((apiBooking: any) => ({
        id: apiBooking._id || apiBooking.id || Math.random().toString(),
        service: apiBooking.serviceType || apiBooking.service || 'Cleaning Service',
        date: new Date(apiBooking.date || apiBooking.bookingDate || new Date()),
        timeSlot: apiBooking.time || apiBooking.timeSlot || '00:00',
        status: apiBooking.status || 'pending',
        price: apiBooking.price || 0,
        address: apiBooking.address || '',
        createdAt: new Date(apiBooking.createdAt || apiBooking.bookingDate || new Date()),
        customerName: apiBooking.customerName,
        customerEmail: apiBooking.customerEmail,
        customerPhone: apiBooking.customerPhone,
        serviceType: apiBooking.serviceType,
        duration: apiBooking.duration,
        selectedFeatures: apiBooking.selectedFeatures,
        specialInstructions: apiBooking.specialInstructions
      }));

      setBookings(transformedBookings);
    } else {
      console.warn('Bookings API returned success: false', response);
      setBookings([]);
    }
  } catch (error) {
    console.error('Failed to load bookings:', error);
    toast.error('Failed to load bookings');
    setBookings([]);
  } finally {
    setIsLoading(false);
  }
};

  const addBooking = async (bookingData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    address: string;
    date: string;
    time: string;
    duration: number;
    price: number;
    selectedFeatures?: string[];
    specialInstructions?: string;
  }) => {
    try {
      setIsLoading(true);
      const response = await apiService.createBooking(bookingData);

      if (response.success) {
        // Refresh bookings to get the latest data
        await refreshBookings();
        toast.success('Booking created successfully!');
      } else {
        throw new Error(response.message || 'Failed to create booking');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to create booking');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
    toast.success('Booking status updated');
  };

  const cancelBooking = async (id: string, cancellationReason?: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.cancelBooking(id, cancellationReason);

      if (response.success) {
        setBookings(prev =>
          prev.map(booking =>
            booking.id === id ? { ...booking, status: 'cancelled' } : booking
          )
        );
        toast.success('Booking cancelled successfully');
      } else {
        throw new Error(response.message || 'Failed to cancel booking');
      }
    } catch (error: any) {
      console.error('Cancel booking error:', error);
      toast.error(error.message || 'Failed to cancel booking');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

const getAvailableBookingSlots = async (date: string): Promise<{
  success: boolean;
  data?: string[];
  availableSlots?: string[];
  timeSlots?: string[];
}> => {
  try {
    console.log('📅 Fetching available slots for date:', date);
    const response = await apiService.getAvailableTimeSlots(date);
    
    console.log('🕒 Available slots response:', response);
    
    if (response.success) {
      // Handle different response structures
      let availableTimeSlots: string[] = [];
      
      if (response.data && typeof response.data === 'object' && 'availableTimeSlots' in response.data) {
        // Structure: { data: { availableTimeSlots: string[] } }
        availableTimeSlots = (response.data as any).availableTimeSlots || [];
      } else if (Array.isArray(response.data)) {
        // Structure: { data: string[] }
        availableTimeSlots = response.data;
      } else if (Array.isArray(response.availableSlots)) {
        // Structure: { availableSlots: string[] }
        availableTimeSlots = response.availableSlots;
      } else if (Array.isArray(response.timeSlots)) {
        // Structure: { timeSlots: string[] }
        availableTimeSlots = response.timeSlots;
      }
      
      console.log('🕒 Extracted available slots:', availableTimeSlots);
      
      return {
        success: true,
        data: availableTimeSlots,
        availableSlots: availableTimeSlots,
        timeSlots: availableTimeSlots
      };
    } else {
      console.warn('Failed to fetch available slots:', response.timeSlots);
      return {
        success: false,
        data: [],
        availableSlots: [],
        timeSlots: []
      };
    }
  } catch (error: any) {
    console.error('Error fetching available slots:', error);
    toast.error('Failed to load available time slots');
    return {
      success: false,
      data: [],
      availableSlots: [],
      timeSlots: []
    };
  }
};

  const getUpcomingBookings = (): Booking[] => {
    const today = new Date();
    return bookings
      .filter(booking => new Date(booking.date) >= today && booking.status !== 'cancelled')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getRecentBookings = (): Booking[] => {
    return bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        isLoading,
        addBooking,
        updateBookingStatus,
        cancelBooking,
        refreshBookings,
        getUpcomingBookings,
        getRecentBookings,
        getAvailableBookingSlots
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};