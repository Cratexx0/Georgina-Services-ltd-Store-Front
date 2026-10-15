import { Product } from "./type";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Interfaces
export interface Category {
	id: string;
	name: string;
	slug: string;
	level: number;
	parentId: string | null;
	description: string;
	sortOrder: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	// Make image optional since your API might not return it
	image?: string;
	// Keep subcategories optional for hierarchical display
	subcategories?: SubCategory[];
}

export interface SubCategory {
	id: string;
	name: string;
	slug: string;
	parentId: string;
	description?: string;
	level?: number;
	sortOrder?: number;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}
// src/types/product.ts
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
		this.token = localStorage.getItem("auth_token");
	}

	setToken(token: string) {
		this.token = token;
		localStorage.setItem("auth_token", token);
	}

	clearToken() {
		this.token = null;
		localStorage.removeItem("auth_token");
	}

	private async request<T>(
		endpoint: string,
		options: RequestInit = {},
	): Promise<T> {
		const url = `${this.baseUrl}${endpoint}`;
		const headers: HeadersInit = {
			"Content-Type": "application/json",
			...options.headers,
		};

		// Add auth token if available
		if (this.token) {
			headers["Authorization"] = `Bearer ${this.token}`;
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

			const contentType = response.headers.get("content-type");
			if (!contentType || !contentType.includes("application/json")) {
				throw new Error("Response is not JSON");
			}

			return await response.json();
		} catch (error) {
			console.error("API request failed:", error);
			throw error;
		}
	}

	// Auth - Customer endpoints
	async login(email: string, password: string): Promise<AuthResponse> {
		const data = await this.request<AuthResponse>("/api/auth/customer/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});
		if (data.token) {
			this.setToken(data.token);
		}
		return data;
	}

	async register(
		name: string,
		email: string,
		password: string,
	): Promise<AuthResponse> {
		return this.request<AuthResponse>("/api/auth/customer/register", {
			method: "POST",
			body: JSON.stringify({ name, email, password }),
		});
	}

	async forgotPassword(email: string): Promise<{ message: string }> {
		return this.request<{ message: string }>("/api/auth/forgot-password", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	}

	async resetPassword(
		token: string,
		password: string,
	): Promise<{ message: string }> {
		return this.request<{ message: string }>("/api/auth/resetpassword", {
			method: "POST",
			body: JSON.stringify({ token, password }),
		});
	}

	async getUserInfo(userId: string): Promise<User> {
		return this.request<User>(`/api/auth/userinfo/${userId}`);
	}

	// Categories
	async getCategories(): Promise<Category[]> {
		return this.request<Category[]>("/api/categories");
	}

	async getCategoryById(id: string): Promise<Category> {
		return this.request<Category>(`/api/categories/${id}`);
	}

	// Subcategories
	async getSubCategories(): Promise<SubCategory[]> {
		return this.request<SubCategory[]>("/api/subcategories");
	}

	async getSubCategoriesByParent(parentId: string): Promise<SubCategory[]> {
		return this.request<SubCategory[]>(`/api/subcategories/parent/${parentId}`);
	}

	async getSubCategoryById(id: string): Promise<SubCategory> {
		return this.request<SubCategory>(`/api/subcategories/${id}`);
	}

	async getTrendingProducts(
		page = 1,
		limit = 10,
	): Promise<{
		products: Product[];
		total: number;
		page: number;
		limit: number;
	}> {
		const response = await this.getProducts(1, 1000);
		const flagged = response.products.filter((product) => product.isTrending);
		const products = flagged.slice((page - 1) * limit, page * limit);
		return { products, total: flagged.length, page, limit };
	}

	async getNewArrivalProducts(
		page = 1,
		limit = 10,
	): Promise<{
		products: Product[];
		total: number;
		page: number;
		limit: number;
	}> {
		const response = await this.getProducts(1, 1000);
		const flagged = response.products.filter(
			(product) => product.isNewArrival,
		);
		const products = flagged.slice((page - 1) * limit, page * limit);
		return { products, total: flagged.length, page, limit };
	}

	async getFeaturedProducts(
		page = 1,
		limit = 10,
	): Promise<{
		products: Product[];
		total: number;
		page: number;
		limit: number;
	}> {
		const response = await this.getProducts(1, 1000);
		const flagged = response.products.filter((product) => product.isFeatured);
		const products = flagged.slice((page - 1) * limit, page * limit);
		return { products, total: flagged.length, page, limit };
	}

	async rateProduct(
		productId: string,
		rating: number,
		comment: string,
	): Promise<Product> {
		return this.request<Product>(`/api/products/${productId}/rate`, {
			method: "POST",
			body: JSON.stringify({ rating, comment }),
		});
	}

	// Orders
	async createOrder(
		items: { productId: string; quantity: number }[],
		shippingAddress: Address,
	): Promise<Order> {
		return this.request<Order>("/api/orders", {
			method: "POST",
			body: JSON.stringify({ items, shippingAddress }),
		});
	}

	async getOrders(): Promise<Order[]> {
		return this.request<Order[]>("/api/orders");
	}

	async getOrderById(id: string): Promise<Order> {
		return this.request<Order>(`/api/orders/${id}`);
	}

	// Cleaning Services
	async bookCleaningService(
		booking: Omit<CleaningBooking, "id" | "userId" | "status">,
	): Promise<CleaningBooking> {
		return this.request<CleaningBooking>("/api/cleaning/book", {
			method: "POST",
			body: JSON.stringify(booking),
		});
	}

	async getCleaningBookings(): Promise<CleaningBooking[]> {
		return this.request<CleaningBooking[]>("/api/cleaning/bookings");
	}

	// Payments
	async initiatePayment(orderId: string): Promise<{ paymentUrl: string }> {
		return this.request<{ paymentUrl: string }>("/api/payments/initiate", {
			method: "POST",
			body: JSON.stringify({ orderId }),
		});
	}

	// PaymentIntent for embedded forms
	async createPaymentIntent(data: {
		productId: string;
		userId: string;
		quantity: number;
		countryCode: string;
		paymentIntentMode?: boolean;
	}): Promise<{ clientSecret: string; orderId?: string }> {
		return this.request<{ clientSecret: string; orderId?: string }>(
			"/api/payment",
			{
				method: "POST",
				body: JSON.stringify(data),
			},
		);
	}

	async verifyPayment(
		reference: string,
	): Promise<{ success: boolean; order?: Order }> {
		return this.request<{ success: boolean; order?: Order }>(
			`/api/payments/verify/${reference}`,
		);
	}

	// In your ApiService class, add these methods:

	// Products
	async getProducts(
		page = 1,
		limit = 10,
		category?: string,
		subcategory?: string,
		search?: string,
	): Promise<{ products: Product[]; total: number }> {
		let endpoint = `/api/products?page=${page}&limit=${limit}`;
		if (category) endpoint += `&category=${encodeURIComponent(category)}`;
		if (subcategory)
			endpoint += `&subcategory=${encodeURIComponent(subcategory)}`;
		if (search) endpoint += `&search=${encodeURIComponent(search)}`;
		return this.request<{ products: Product[]; total: number }>(endpoint);
	}

	// Add these new methods:
	async getProductBySlug(slug: string): Promise<Product> {
		const response = await this.request<{ product: Product }>(
			`/api/products/slug/${slug}`,
		);
		return response.product;
	}

	async getProductsByCategory(category: string): Promise<Product[]> {
		const response = await this.request<{ products: Product[] }>(
			`/api/products/category/${category}`,
		);
		return response.products;
	}

	async getProductById(id: string): Promise<Product> {
		const response = await this.request<{ product: Product }>(
			`/api/products/${id}`,
		);
		return response.product;
	}
}

export const apiService = new ApiService(API_BASE_URL);
