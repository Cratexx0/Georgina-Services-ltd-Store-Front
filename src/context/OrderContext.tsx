import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  orderedAt: Date;
  updatedAt: Date;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'orderNumber' | 'orderedAt' | 'updatedAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  cancelOrder: (id: string) => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: ReactNode;
}

// Dummy data for initial orders
const initialOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    items: [
      {
        id: '1',
        name: 'African Print Dress',
        quantity: 2,
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
      },
      {
        id: '2',
        name: 'Palm Nut Soup Base',
        quantity: 1,
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
      },
    ],
    totalAmount: 104.97,
    status: 'delivered',
    paymentStatus: 'paid',
    shippingAddress: '123 Main St, Apt 4B, Accra, Ghana',
    trackingNumber: 'TRK123456789',
    estimatedDelivery: new Date(2024, 2, 10),
    orderedAt: new Date(2024, 2, 1),
    updatedAt: new Date(2024, 2, 10),
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    items: [
      {
        id: '3',
        name: 'Ankara Fabric',
        quantity: 3,
        price: 25.00,
        image: 'https://images.unsplash.com/photo-1509319117443-49c7d5d89319?w=400',
      },
    ],
    totalAmount: 75.00,
    status: 'shipped',
    paymentStatus: 'paid',
    shippingAddress: '456 Oak Ave, Lagos, Nigeria',
    trackingNumber: 'TRK987654321',
    estimatedDelivery: new Date(2024, 2, 28),
    orderedAt: new Date(2024, 2, 15),
    updatedAt: new Date(2024, 2, 20),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    items: [
      {
        id: '4',
        name: 'Gari (1kg)',
        quantity: 2,
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      },
      {
        id: '5',
        name: 'Fufu Mix',
        quantity: 1,
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400',
      },
    ],
    totalAmount: 33.97,
    status: 'processing',
    paymentStatus: 'paid',
    shippingAddress: '789 Elm St, Kumasi, Ghana',
    estimatedDelivery: new Date(2024, 2, 30),
    orderedAt: new Date(2024, 2, 22),
    updatedAt: new Date(2024, 2, 23),
  },
];

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const addOrder = (order: Omit<Order, 'id' | 'orderNumber' | 'orderedAt' | 'updatedAt'>) => {
    const newOrder: Order = {
      ...order,
      id: Date.now().toString(),
      orderNumber: `ORD-2024-${String(orders.length + 1).padStart(3, '0')}`,
      orderedAt: new Date(),
      updatedAt: new Date(),
    };
    setOrders(prev => [...prev, newOrder]);
    toast.success('Order placed successfully!');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status, updatedAt: new Date() } : order
      )
    );
    toast.success('Order status updated');
  };

  const cancelOrder = (id: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id ? { ...order, status: 'cancelled', updatedAt: new Date() } : order
      )
    );
    toast.success('Order cancelled');
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};