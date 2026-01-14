// src/types/product.ts
export interface Product {
  // Core identifiers
  id: number;
  name: string;
  slug: string;
  description: string | null;
  
  // Pricing
  price: string;
  discountPrice?: string; // Optional since it's not in your data
  
  // Categories
  categoryLevel1: string;
  categoryLevel2: string | null;
  categoryLevel3: string | null;
  
  // Product type
  serviceType: 'physical' | 'service';
  serviceDuration: string | null;
  unit: string;
  
  // Inventory
  stock: number;
  images: string[];
  isActive: boolean;
  
  // Metadata
  tags: string[];
  brand: string | null;
  
  // Special categories
  isFeatured: boolean;
  isTrending: boolean;
  isNewArrival: boolean;
  featuredOrder: number;
  trendingOrder: number;
  newArrivalOrder: number;
  
  // Wishlist
  wishList: boolean;
  
  // Size
  size:string[];
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  
}
export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  paymentStatus: 'paid' | 'unpaid' | 'refunded';
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'product' | 'system';
  read: boolean;
  createdAt: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: 'basic' | 'deep' | 'office' | 'post-construction';
  address: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
