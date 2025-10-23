const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://georgina-server-code.onrender.com';

// Interfaces
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  subCategoryId?: string;
  stock: number;
  rating?: number;
  reviews?: Review[];
}

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  shippingAddress: Address;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface CleaningBooking {
  id: string;
  userId: string;
  serviceType: string;
  date: string;
  time: string;
  address: Address;
  status: string;
  notes?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class ApiService {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Try to get token from localStorage
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add auth token if available
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await this.request<AuthResponse>('/api/auth/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.token) {
      this.setToken(data.token);
    }
    return data;
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/api/auth/user/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return this.request<{ message: string }>('/api/auth/resetpassword', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
    });
  }

  async getUserInfo(userId: string): Promise<User> {
    return this.request<User>(`/api/auth/userinfo/${userId}`);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return this.request<Category[]>('/api/categories');
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.request<Category>(`/api/categories/${id}`);
  }

  // Subcategories
  async getSubCategories(): Promise<SubCategory[]> {
    return this.request<SubCategory[]>('/api/subcategories');
  }

  async getSubCategoriesByParent(parentId: string): Promise<SubCategory[]> {
    return this.request<SubCategory[]>(`/api/subcategories/parent/${parentId}`);
  }

  async getSubCategoryById(id: string): Promise<SubCategory> {
    return this.request<SubCategory>(`/api/subcategories/${id}`);
  }

  // Products
  async getProducts(page = 1, limit = 10, category?: string, subcategory?: string): Promise<{ products: Product[], total: number }> {
    let endpoint = `/api/products?page=${page}&limit=${limit}`;
    if (category) endpoint += `&category=${category}`;
    if (subcategory) endpoint += `&subcategory=${subcategory}`;
    return this.request<{ products: Product[], total: number }>(endpoint);
  }

  async getProductById(id: string): Promise<Product> {
    return this.request<Product>(`/api/products/${id}`);
  }

  async rateProduct(productId: string, rating: number, comment: string): Promise<Product> {
    return this.request<Product>(`/api/products/${productId}/rate`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  // Orders
  async createOrder(items: { productId: string, quantity: number }[], shippingAddress: Address): Promise<Order> {
    return this.request<Order>('/api/orders', {
      method: 'POST',
      body: JSON.stringify({ items, shippingAddress }),
    });
  }

  async getOrders(): Promise<Order[]> {
    return this.request<Order[]>('/api/orders');
  }

  async getOrderById(id: string): Promise<Order> {
    return this.request<Order>(`/api/orders/${id}`);
  }

  // Cleaning Services
  async bookCleaningService(booking: Omit<CleaningBooking, 'id' | 'userId' | 'status'>): Promise<CleaningBooking> {
    return this.request<CleaningBooking>('/api/cleaning/book', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  }

  async getCleaningBookings(): Promise<CleaningBooking[]> {
    return this.request<CleaningBooking[]>('/api/cleaning/bookings');
  }

  // Payments
  async initiatePayment(orderId: string): Promise<{ paymentUrl: string }> {
    return this.request<{ paymentUrl: string }>('/api/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ orderId }),
    });
  }

  async verifyPayment(reference: string): Promise<{ success: boolean, order?: Order }> {
    return this.request<{ success: boolean, order?: Order }>(`/api/payments/verify/${reference}`);
  }
}

export const apiService = new ApiService(API_BASE_URL);
