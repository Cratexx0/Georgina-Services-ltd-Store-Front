import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { apiService } from './ApiService';
import { useAuth } from './AuthContext'; // Import useAuth

export interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  productName?: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed'| 'processing' | 'shipped' | 'delivered' | 'cancelled'| 'returned'| 'failed';
  paymentStatus: 'pending' | 'paid' | 'failed';
  shippingAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  orderedAt: Date;
  updatedAt: Date;
  customerNotes?: string;
  paymentMethod?: string;
}

interface OrderContextType {
  orders: Order[];
  isLoading: boolean;
  addOrder: (orderData: {
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    shippingAddress: string;
    totalAmount?: number;
    paymentMethod?: string;
    customerNotes?: string;
    paymentIntentId?: string;
  }) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  cancelOrder: (id: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  refreshOrders: () => Promise<void>;
  getRecentOrders: () => Order[];
  getPendingOrders: () => Order[];
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

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user } = useAuth(); // Get user from AuthContext

  // Load orders only when user is authenticated
  useEffect(() => {
    if (user && user.email) {
      refreshOrders();
    } else {
      // Clear orders when user logs out
      setOrders([]);
      setIsLoading(false);
    }
  }, [user]); // Depend on user state

  const refreshOrders = async () => {
    // Double-check user is authenticated
    if (!user || !user.email) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiService.getMyOrders();
      
      if (response && response.success) {
        let apiOrders: any[] = [];
        
        if (Array.isArray(response.data)) {
          apiOrders = response.data;
        } else if (Array.isArray(response.orders)) {
          apiOrders = response.orders;
        } else if (Array.isArray(response)) {
          apiOrders = response;
        } else if (response.data && Array.isArray((response.data as any).orders)) {
          apiOrders = (response.data as any).orders;
        } else if (response.data && typeof response.data === 'object') {
          const dataObj = response.data as Record<string, any>;
          const possibleArrayKeys = ['items', 'orders', 'data', 'results', 'list'];
          
          for (const key of possibleArrayKeys) {
            if (Array.isArray(dataObj[key])) {
              apiOrders = dataObj[key];
              break;
            }
          }
          
          if (apiOrders.length === 0 && dataObj && typeof dataObj === 'object') {
            for (const key in dataObj) {
              if (Array.isArray(dataObj[key])) {
                apiOrders = dataObj[key];
                break;
              }
            }
          }
        }
        
        const transformedOrders: Order[] = apiOrders.map((apiOrder: any) => ({
          id: apiOrder._id || apiOrder.id || Math.random().toString(),
          orderNumber: apiOrder.orderNumber || apiOrder.orderNo || `ORD-${apiOrder._id?.slice(-6) || 'XXXXX'}`,
          items: (apiOrder.items || []).map((item: any) => ({
            id: item._id || item.id || Math.random().toString(),
            productId: item.productId || item.product?._id,
            name: item.productName || item.name || item.product?.name || 'Unknown Product',
            productName: item.productName || item.name,
            quantity: item.quantity || 1,
            price: item.price || 0,
            image: item.image || item.product?.images?.[0] || item.product?.image
          })),
          totalAmount: apiOrder.totalAmount || apiOrder.total || 0,
          status: apiOrder.status || 'pending',
          paymentStatus: apiOrder.paymentStatus || apiOrder.payment?.status || 'pending',
          shippingAddress: 
            typeof apiOrder.shippingAddress === 'string' 
              ? apiOrder.shippingAddress 
              : apiOrder.shippingAddress?.fullAddress ||
                `${apiOrder.shippingAddress?.street || ''}, ${apiOrder.shippingAddress?.city || ''}, ${apiOrder.shippingAddress?.country || ''}`.trim() ||
                'No address provided',
          trackingNumber: apiOrder.trackingNumber || apiOrder.tracking?.number,
          estimatedDelivery: apiOrder.estimatedDelivery ? new Date(apiOrder.estimatedDelivery) : undefined,
          orderedAt: new Date(apiOrder.createdAt || apiOrder.orderedAt || new Date()),
          updatedAt: new Date(apiOrder.updatedAt || apiOrder.createdAt || new Date()),
          customerNotes: apiOrder.customerNotes || apiOrder.notes,
          paymentMethod: apiOrder.paymentMethod || apiOrder.payment?.method
        }));

        setOrders(transformedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
      // Only show error toast if user is still authenticated
      if (user && user.email) {
        toast.error('Failed to load orders');
      }
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const addOrder = async (orderData: {
    items: Array<{
      productId: string;
      name: string;
      quantity: number;
      price: number;
      image?: string;
    }>;
    shippingAddress: string;
    totalAmount?: number;
    paymentMethod?: string;
    customerNotes?: string;
    paymentIntentId?: string;
  }) => {
    try {
      setIsLoading(true);
      
      const total = orderData.totalAmount || 
        orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const response = await apiService.createOrder(
        orderData.items,
        orderData.shippingAddress,
        total,
        orderData.paymentMethod,
        orderData.customerNotes,
        orderData.paymentIntentId
      );

      if (response.success) {
        await refreshOrders();
        toast.success('Order placed successfully!');
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Order creation error:', error);
      toast.error(error.message || 'Failed to create order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === id 
          ? { ...order, status, updatedAt: new Date() } 
          : order
      )
    );
    toast.success('Order status updated');
  };

  const cancelOrder = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.cancelOrder(id);

      if (response.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === id 
              ? { ...order, status: 'cancelled', updatedAt: new Date() } 
              : order
          )
        );
        toast.success('Order cancelled successfully');
      } else {
        throw new Error(response.message || 'Failed to cancel order');
      }
    } catch (error: any) {
      console.error('Cancel order error:', error);
      toast.error(error.message || 'Failed to cancel order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await apiService.delete(id);

      if (response.success) {
        setOrders(prev => prev.filter(order => order.id !== id));
        toast.success('Order deleted successfully');
      } else {
        throw new Error(response.message || 'Failed to delete order');
      }
    } catch (error: any) {
      console.error('Delete order error:', error);
      toast.error(error.message || 'Failed to delete order');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getRecentOrders = (): Order[] => {
    return orders
      .sort((a, b) => new Date(b.orderedAt).getTime() - new Date(a.orderedAt).getTime())
      .slice(0, 5);
  };

  const getPendingOrders = (): Order[] => {
    return orders.filter(order => 
      order.status === 'pending' || order.status === 'processing'
    );
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        isLoading,
        addOrder,
        updateOrderStatus,
        cancelOrder,
        deleteOrder,
        refreshOrders,
        getRecentOrders,
        getPendingOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};