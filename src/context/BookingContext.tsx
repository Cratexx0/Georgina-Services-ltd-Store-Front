import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

export interface Booking {
  id: string;
  service: string;
  date: Date;
  timeSlot: string;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  address: string;
  createdAt: Date;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => void;
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  cancelBooking: (id: string) => void;
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

// Dummy data for initial bookings
const initialBookings: Booking[] = [
  {
    id: '1',
    service: 'Office Cleaning',
    date: new Date(2024, 2, 15),
    timeSlot: '9:00 AM - 11:00 AM',
    status: 'completed',
    price: 120,
    address: '123 Business St, Suite 100',
    createdAt: new Date(2024, 2, 10),
  },
  {
    id: '2',
    service: 'Kitchen Deep Cleaning',
    date: new Date(2024, 2, 20),
    timeSlot: '2:00 PM - 4:00 PM',
    status: 'confirmed',
    price: 85,
    address: '456 Home Ave, Apt 5B',
    createdAt: new Date(2024, 2, 15),
  },
  {
    id: '3',
    service: 'Bathroom Cleaning',
    date: new Date(2024, 2, 25),
    timeSlot: '10:00 AM - 12:00 PM',
    status: 'pending',
    price: 60,
    address: '789 Residential Rd',
    createdAt: new Date(2024, 2, 20),
  },
];

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date(),
    };
    setBookings(prev => [...prev, newBooking]);
    toast.success('Booking created successfully!');
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, status } : booking
      )
    );
    toast.success('Booking status updated');
  };

  const cancelBooking = (id: string) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === id ? { ...booking, status: 'cancelled' } : booking
      )
    );
    toast.success('Booking cancelled');
  };

  return (
    <BookingContext.Provider
      value={{
        bookings,
        addBooking,
        updateBookingStatus,
        cancelBooking,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};