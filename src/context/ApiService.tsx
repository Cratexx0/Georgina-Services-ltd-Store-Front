
import { Product } from "@/lib/type";

const API_BASE_URL = import.meta.env.VITE_API_URL ;

interface RequestOptions extends RequestInit {
	requiresAuth?: boolean;
}

// =============================================
// 📝 REVIEW INTERFACES
// =============================================

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  isApproved: boolean;
  reply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    images?: string[];
  };
}

export interface CreateReviewRequest {
  userId: string;
  userName: string;
  userEmail: string;
  rating: number;
  title?: string;
  comment: string;
  verifiedPurchase?: boolean;
}

export interface ReviewStats {
  averageRating: string;
  ratingDistribution: Record<number, number>;
  totalReviews: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ProductReviewsResponse {
  reviews: Review[];
  pagination: PaginationInfo;
  stats: ReviewStats;
  message: string;
}

export interface UserReviewsResponse {
  reviews: Review[];
  pagination: PaginationInfo;
  message: string;
}

export interface AllReviewsResponse {
  reviews: Review[];
  pagination: PaginationInfo;
  stats: {
    totalReviews: number;
    approvedReviews: number;
    pendingReviews: number;
    averageRating: { average: number | null };
  };
  message: string;
}

// =============================================
// 🤖 CHATBOT TYPES
// =============================================

export interface ChatMessage {
	id: string;
	sessionId: string;
	message: string;
	sender: "user" | "bot";
	messageType: "text" | "quick_reply" | "suggestion";
	metadata?: any;
	isRead: boolean;
	timestamp: string;
	createdAt: string;
	updatedAt: string;
}

export interface ChatSession {
	sessionId?: string;
	messages?: ChatMessage[];
	total?: number;
	data?: {
		sessionId?: string;
		messages?: ChatMessage[];
		total?: number;
	};
}

export interface SendMessageData {
	sessionId: string;
	message: string;
	metadata?: any;
}

export interface SendMessageResponse {
	success: boolean;
	message?: string;
	data?: {
		userMessage?: ChatMessage;
		botMessage?: ChatMessage;
		messages?: ChatMessage[];
	};
	userMessage?: ChatMessage;
	botMessage?: ChatMessage;
	messages?: ChatMessage[];
}

// =============================================
// 🔐 SOCIAL LOGIN INTERFACES
// =============================================

export interface SocialLoginRequest {
	accessToken?: string;
	idToken?: string; // Google uses idToken
}

export interface SocialLoginResponse {
	success: boolean;
	token?: string;
	user?: any;
	data?: {
		token?: string;
		user?: any;
	};
	message?: string;
}

class ApiService {
	private baseUrl: string;

	constructor(baseUrl: string) {
		this.baseUrl = baseUrl;
	}

	// Get token from both localStorage and sessionStorage
	private getToken(): string | null {
		return sessionStorage.getItem("token") || localStorage.getItem("token");
	}

	// Get user email - Check both sessionStorage and localStorage
	private getUserEmail(): string | null {
		try {
			// Check sessionStorage first (current session)
			const sessionUserString = sessionStorage.getItem("user");
			if (sessionUserString) {
				const userData = JSON.parse(sessionUserString);
				if (userData?.email) {
					console.log("✅ Found email in sessionStorage:", userData.email);
					return userData.email;
				}
			}

			// Fallback to localStorage
			const localUserString = localStorage.getItem("user");
			if (localUserString) {
				const userData = JSON.parse(localUserString);
				if (userData?.email) {
					console.log("✅ Found email in localStorage:", userData.email);
					return userData.email;
				}
			}
		} catch (error) {
			console.error("❌ Error reading user from storage:", error);
		}

		console.log("❌ No email found in storage");
		return null;
	}

	// Get user data from cookies
	private getUserFromCookies(): any {
		try {
			const cookieValue = document.cookie
				.split("; ")
				.find((row) => row.startsWith("user="))
				?.split("=")[1];

			if (cookieValue) {
				const decoded = decodeURIComponent(cookieValue);
				return JSON.parse(decoded);
			}
		} catch (error) {
			console.error("Error reading user cookie:", error);
		}
		return null;
	}

	// Clear auth data from storage
	private clearAuthData() {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		sessionStorage.removeItem("token");
		sessionStorage.removeItem("user");
	}

	// Request method
	private async request(
		endpoint: string,
		options: RequestOptions = {}
	): Promise<any> {
		try {
			const { requiresAuth = true, ...fetchOptions } = options;

			// Debug token retrieval
			let token: string | null = null;
			if (requiresAuth) {
				token =
					sessionStorage.getItem("token") || localStorage.getItem("token");
			}

			// Create headers object properly
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			// Merge additional headers if provided
			if (fetchOptions.headers) {
				if (Array.isArray(fetchOptions.headers)) {
					// Handle headers as [string, string][]
					fetchOptions.headers.forEach(([key, value]) => {
						headers[key] = value;
					});
				} else if (typeof fetchOptions.headers === "object") {
					// Handle headers as Record<string, string>
					Object.assign(headers, fetchOptions.headers);
				}
			}

			// Add Authorization header if required and token is valid
			if (requiresAuth && token) {
				// Validate token before using it
				if (token === "null" || token === "undefined" || token.length < 50) {
					throw new Error("Invalid authentication token");
				}
				headers["Authorization"] = `Bearer ${token}`;
			}

			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				...fetchOptions,
				headers,
			});

			// Handle response
			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ message: "Unknown error" }));
				throw new Error(
					errorData.message || `Request failed with status ${response.status}`
				);
			}

			return await response.json();
		} catch (error) {
			console.error(`❌ [REQUEST] API call failed for ${endpoint}:`, error);
			throw error;
		}
	}

	async verifyToken(): Promise<{ success: boolean; data?: any }> {
		try {
			const token =
				sessionStorage.getItem("token") || localStorage.getItem("token");

			if (!token) {
				return {
					success: true,
					data: { message: "No token available" },
				};
			}

			const response = await fetch(`${this.baseUrl}/api/auth/verify-token`, {
				method: "POST", // Your backend expects POST, not GET
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			// Handle 404 specifically
			if (response.status === 404) {
				return {
					success: true,
					data: { message: "Verify token endpoint not available" },
				};
			}

			// Handle 401 - token is invalid/expired
			if (response.status === 401) {
				throw new Error("Token invalid or expired");
			}

			// Handle other non-200 responses
			if (!response.ok) {
				throw new Error(
					`Token verification failed with status ${response.status}`
				);
			}

			const data = await response.json();

			return data;
		} catch (error: any) {
			// Re-throw 401 errors so AuthContext can handle them properly
			if (
				error.message.includes("401") ||
				error.message.includes("Token invalid")
			) {
				throw error;
			}

			// For network errors or other issues, return success: true
			return {
				success: true,
				data: { message: error.message },
			};
		}
	}

	// =============================================
	// 📝 REVIEW ENDPOINTS
	// =============================================

	/**
	 * Get reviews for a specific product
	 */
	async getProductReviews(
		productId: string,
		options: {
			page?: number;
			limit?: number;
			sort?: 'newest' | 'helpful' | 'rating_high' | 'rating_low';
			rating?: number;
			verified?: boolean;
		} = {}
	): Promise<ProductReviewsResponse> {
		const {
			page = 1,
			limit = 10,
			sort = 'newest',
			rating,
			verified
		} = options;

		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			sort,
			...(rating !== undefined && { rating: rating.toString() }),
			...(verified !== undefined && { verified: verified.toString() })
		});

		return this.request(`/api/products/${productId}/reviews?${queryParams}`, {
			method: 'GET',
			requiresAuth: false, // Public endpoint
		});
	}

	/**
	 * Create a new review for a product
	 */
	async createReview(
		productId: string,
		reviewData: CreateReviewRequest
	): Promise<{
		success: boolean;
		message: string;
		review?: Review;
		productStats?: {
			averageRating: number;
			totalReviews: number;
		};
	}> {
		return this.request(`/api/products/${productId}/reviews`, {
			method: 'POST',
			body: JSON.stringify(reviewData),
			requiresAuth: true,
		});
	}

	/**
	 * Mark a review as helpful
	 */
	async markReviewHelpful(reviewId: string): Promise<{
		success: boolean;
		message: string;
		helpfulCount?: number;
	}> {
		return this.request(`/api/reviews/${reviewId}/helpful`, {
			method: 'POST',
			requiresAuth: true,
		});
	}

	/**
	 * Get user's own reviews
	 */
	async getUserReviews(
		userId: string,
		options: {
			page?: number;
			limit?: number;
		} = {}
	): Promise<UserReviewsResponse> {
		const { page = 1, limit = 10 } = options;

		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString()
		});

		return this.request(`/api/users/${userId}/reviews?${queryParams}`, {
			method: 'GET',
			requiresAuth: true,
		});
	}

	/**
	 * Reply to a review (Admin/Store Owner only)
	 */
	async replyToReview(
		reviewId: string,
		reply: string
	): Promise<{
		success: boolean;
		message: string;
		review?: Review;
	}> {
		return this.request(`/api/reviews/${reviewId}/reply`, {
			method: 'POST',
			body: JSON.stringify({ reply }),
			requiresAuth: true,
		});
	}

	/**
	 * Get all reviews with filtering (Admin only)
	 */
	async getAllReviews(
		filters: {
			page?: number;
			limit?: number;
			productId?: string;
			userId?: string;
			rating?: number;
			isApproved?: boolean;
			verifiedPurchase?: boolean;
			search?: string;
		} = {}
	): Promise<AllReviewsResponse> {
		const {
			page = 1,
			limit = 20,
			productId,
			userId,
			rating,
			isApproved,
			verifiedPurchase,
			search
		} = filters;

		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...(productId && { productId }),
			...(userId && { userId }),
			...(rating !== undefined && { rating: rating.toString() }),
			...(isApproved !== undefined && { isApproved: isApproved.toString() }),
			...(verifiedPurchase !== undefined && { verifiedPurchase: verifiedPurchase.toString() }),
			...(search && { search })
		});

		return this.request(`/api/admin/reviews?${queryParams}`, {
			method: 'GET',
			requiresAuth: true,
		});
	}

	/**
	 * Update review approval status (Admin only)
	 */
	async updateReviewStatus(
		reviewId: string,
		isApproved: boolean
	): Promise<{
		success: boolean;
		message: string;
		review?: Review;
	}> {
		return this.request(`/api/admin/reviews/${reviewId}/status`, {
			method: 'PATCH',
			body: JSON.stringify({ isApproved }),
			requiresAuth: true,
		});
	}

	/**
	 * Delete a review (Admin or review owner)
	 */
	async deleteReview(reviewId: string): Promise<{
		success: boolean;
		message: string;
	}> {
		return this.request(`/api/reviews/${reviewId}`, {
			method: 'DELETE',
			requiresAuth: true,
		});
	}

	/**
	 * Check if user has already reviewed a product
	 */
	async checkUserReview(
		productId: string,
		userId: string
	): Promise<{
		success: boolean;
		hasReviewed: boolean;
		existingReview?: Review;
	}> {
		try {
			// First get user's reviews
			const userReviews = await this.getUserReviews(userId, { limit: 100 });
			
			// Check if any review is for this product
			const existingReview = userReviews.reviews.find(
				review => review.productId === productId
			);

			return {
				success: true,
				hasReviewed: !!existingReview,
				existingReview
			};
		} catch (error) {
			return {
				success: false,
				hasReviewed: false,
			};
		}
	}

	/**
	 * Get review statistics for a product
	 */
	async getProductReviewStats(productId: string): Promise<{
		success: boolean;
		stats?: ReviewStats;
		message?: string;
	}> {
		try {
			// Get first page of reviews which includes stats
			const response = await this.getProductReviews(productId, { limit: 1 });
			return {
				success: true,
				stats: response.stats
			};
		} catch (error) {
			return {
				success: false,
				message: error instanceof Error ? error.message : 'Failed to get review stats'
			};
		}
	}

	/**
	 * Helper method to calculate average rating for display
	 */
	calculateAverageRating(reviews: Review[]): number {
		if (!reviews || reviews.length === 0) return 0;
		
		const total = reviews.reduce((sum, review) => sum + review.rating, 0);
		return parseFloat((total / reviews.length).toFixed(1));
	}

	/**
	 * Helper method to get rating distribution
	 */
	getRatingDistribution(reviews: Review[]): Record<number, number> {
		const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
		
		reviews.forEach(review => {
			distribution[review.rating]++;
		});
		
		return distribution;
	}

	/**
	 * Helper method to format review date
	 */
	formatReviewDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return 'Today';
		} else if (diffDays === 1) {
			return 'Yesterday';
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else if (diffDays < 30) {
			const weeks = Math.floor(diffDays / 7);
			return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
		} else {
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric'
			});
		}
	}

	// =============================================
	// 🔐 SOCIAL LOGIN ENDPOINTS
	// =============================================

	/**
	 * Social login with Google
	 */
	async socialLoginGoogle(idToken: string): Promise<SocialLoginResponse> {
		return this.request('/api/auth/google', {
			method: 'POST',
			body: JSON.stringify({ idToken }),
			requiresAuth: false,
		});
	}

	/**
	 * Social login with Facebook
	 */
	async socialLoginFacebook(accessToken: string): Promise<SocialLoginResponse> {
		return this.request('/api/auth/facebook', {
			method: 'POST',
			body: JSON.stringify({ accessToken }),
			requiresAuth: false,
		});
	}

	// =============================================
	// 🛍️ PRODUCT ENDPOINTS
	// =============================================

	/**
	 * Get featured products - use correct endpoint
	 */
	async getFeaturedProducts(): Promise<Product[]> {
		const response = await this.request("/api/products/featured", {
			method: "GET",
			requiresAuth: false,
		});

		// Extract just the products array from the response
		if (response && response.products && Array.isArray(response.products)) {
			return this.normalizeProducts(response.products);
		}
		return [];
	}

	/**
	 * Get trending products - use correct endpoint
	 */
	async getTrendingProducts(): Promise<Product[]> {
		const response = await this.request("/api/products/trending", {
			method: "GET",
			requiresAuth: false,
		});

		// Extract just the products array from the response
		if (response && response.products && Array.isArray(response.products)) {
			return this.normalizeProducts(response.products);
		}

		return [];
	}

	/**
	 * Get new arrivals - use correct endpoint
	 */
	async getNewArrivals(): Promise<Product[]> {
		const response = await this.request("/api/products/new-arrivals", {
			method: "GET",
			requiresAuth: false,
		});

		// Extract just the products array from the response
		if (response && response.products && Array.isArray(response.products)) {
			return this.normalizeProducts(response.products);
		}

		return [];
	}

	/**
	 * Get all products
	 */
	async getProducts(params?: {
		page?: number;
		limit?: number;
		category?: string;
		search?: string;
		minPrice?: number;
		maxPrice?: number;
	}): Promise<Product[]> {
		try {
			const queryString = params
				? `?${new URLSearchParams(params as any).toString()}`
				: "";

			const response = await this.request(`/api/products${queryString}`, {
				method: "GET",
				requiresAuth: false,
			});

			// Extract just the products array from the response
			if (response && response.products && Array.isArray(response.products)) {
				return this.normalizeProducts(response.products);
			}

			// Fallback: if it's directly an array
			if (Array.isArray(response)) {
				return this.normalizeProducts(response);
			}

			return [];
		} catch (error) {
			console.error("📦 [GET_PRODUCTS] Error:", error);
			return [];
		}
	}

	async getProductsByCategory(
		categoryLevel1: string,
		categoryLevel2?: string,
		categoryLevel3?: string
	) {
		try {
			let endpoint = "";

			if (categoryLevel3) {
				endpoint = `/api/products/category/${categoryLevel1}/${categoryLevel2}/${categoryLevel3}`;
			} else if (categoryLevel2) {
				endpoint = `/api/products/category/${categoryLevel1}/${categoryLevel2}`;
			} else {
				endpoint = `/api/products/category/${categoryLevel1}`;
			}

			console.log("📦 [GET_PRODUCTS_BY_CATEGORY] Fetching from:", endpoint);

			const response = await this.request(endpoint, {
				method: "GET",
				requiresAuth: false,
			});

			console.log("📦 [GET_PRODUCTS_BY_CATEGORY] Raw response:", response);

			// Handle the response structure
			if (response && Array.isArray(response.products)) {
				return this.normalizeProducts(response.products);
			}
			if (Array.isArray(response)) {
				return this.normalizeProducts(response);
			}
			if (response && Array.isArray(response.data)) {
				return this.normalizeProducts(response.data);
			}

			console.warn(
				"📦 [GET_PRODUCTS_BY_CATEGORY] Unexpected response structure:",
				response
			);
			return [];
		} catch (error) {
			console.error("📦 [GET_PRODUCTS_BY_CATEGORY] Error:", error);
			return [];
		}
	}

	/**
	 * Get product by ID
	 */
	async getProductById(id: string) {
		try {
			console.log("📦 [GET_PRODUCT_BY_ID] Fetching product:", id);

			const response = await this.request(`/api/products/${id}`, {
				method: "GET",
				requiresAuth: false, // Product details are public
			});

			console.log("📦 [GET_PRODUCT_BY_ID] Raw response:", response);

			// Handle different response structures
			let productData = null;

			if (response && typeof response === "object") {
				// Case 1: Direct product object
				if (response.id || response.name) {
					productData = response;
				}
				// Case 2: Nested in data property
				else if (response.data && (response.data.id || response.data.name)) {
					productData = response.data;
				}
				// Case 3: Nested in product property
				else if (
					response.product &&
					(response.product.id || response.product.name)
				) {
					productData = response.product;
				}
				// Case 4: Array of products (take first)
				else if (
					Array.isArray(response.products) &&
					response.products.length > 0
				) {
					productData = response.products[0];
				}
				// Case 5: Array response (take first)
				else if (Array.isArray(response) && response.length > 0) {
					productData = response[0];
				}
			}

			if (!productData) {
				throw new Error(`Product with ID ${id} not found in response`);
			}

			// Normalize the product data
			const normalizedProduct = this.normalizeProducts([productData])[0];
			console.log(
				"📦 [GET_PRODUCT_BY_ID] Normalized product:",
				normalizedProduct
			);

			return normalizedProduct;
		} catch (error) {
			console.error(
				`📦 [GET_PRODUCT_BY_ID] Error fetching product ${id}:`,
				error
			);
			throw error;
		}
	}

	/**
	 * Get product by slug
	 */
	async getProductBySlug(slug: string) {
		try {
			const products = await this.getProducts();
			const product = products.find((product: any) => product.slug === slug);

			if (!product) {
				throw new Error(`Product with slug "${slug}" not found`);
			}

			return product || null;
		} catch (error) {
			return null;
		}
	}

	// =============================================
	// 📅 BOOKING ENDPOINTS
	// =============================================

	/**
	 * Initiate payment for booking (new Stripe checkout flow)
	 */
	async initiateBookingPayment(paymentData: {
		customerName: string;
		customerEmail: string;
		customerPhone: string;
		serviceType: string;
		selectedFeatures?: string[];
		address: string;
		date: string;
		time: string;
		duration: number;
		price: number;
		specialInstructions?: string;
		userId: string | number;
		countryCode?: string;
	}): Promise<{ sessionId: string; url: string; bookingReference: string }> {
		const response = await this.request("/api/bookings/initiate-payment", {
			method: "POST",
			body: JSON.stringify(paymentData),
			requiresAuth: true,
		});
		
		if (!response.sessionId || !response.url) {
			throw new Error(response.message || 'Failed to initiate payment');
		}
		
		return response;
	}

	/**
	 * Create a new booking
	 */
	async createBooking(bookingData: {
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
	}): Promise<{ success: boolean; data?: any; message?: string }> {
		return this.request("/api/bookings", {
			method: "POST",
			body: JSON.stringify(bookingData),
			requiresAuth: true,
		});
	}

	/**
	 * Get available time slots for a specific date
	 */
	async getAvailableTimeSlots(date: string): Promise<{
		success: boolean;
		data?: { availableTimeSlots?: string[] };
		availableSlots?: string[];
		timeSlots?: string[];
	}> {
		return this.request(`/api/bookings/available-slots/${date}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Get user's bookings for dashboard - AUTO email detection
	 * @deprecated Use getUserDashboardBookings instead for better typing
	 */
	async getMyBookings(page: number = 1, limit: number = 10, status?: string) {
		return this.getUserDashboardBookings(page, limit, status);
	}

	/**
	 * Get upcoming bookings - AUTO email detection
	 */
	async getUpcomingBookings() {
		const userEmail = this.getUserEmail();

		if (!userEmail) {
			throw new Error("No user email found. Please ensure you are logged in.");
		}

		return this.request(`/api/user/bookings/upcoming?email=${userEmail}`, {
			requiresAuth: true,
		});
	}

	/**
	 * Get recent bookings - AUTO email detection
	 */
	async getRecentBookings() {
		const userEmail = this.getUserEmail();

		if (!userEmail) {
			throw new Error("No user email found. Please ensure you are logged in.");
		}

		return this.request(`/api/user/bookings/recent?email=${userEmail}`, {
			requiresAuth: true,
		});
	}

	async cancelBooking(id: string, cancellationReason?: string) {
		return this.request(`/api/user/bookings/${id}/cancel`, {
			method: "PATCH",
			body: JSON.stringify({ cancellationReason }),
			requiresAuth: true,
		});
	}

	async getAllBookings(
		page: number = 1,
		limit: number = 10,
		filters: any = {}
	) {
		const queryParams = new URLSearchParams({
			page: page.toString(),
			limit: limit.toString(),
			...filters,
		});

		return this.request(`/api/admin/bookings?${queryParams}`, {
			requiresAuth: true,
		});
	}

	async updateBookingStatus(id: string, status: string, notes?: string) {
		return this.request(`/api/admin/bookings/${id}`, {
			method: "PUT",
			body: JSON.stringify({ status, notes }),
			requiresAuth: true,
		});
	}

	async deleteBooking(id: string) {
		return this.request(`/api/admin/bookings/${id}`, {
			method: "DELETE",
			requiresAuth: true,
		});
	}

	/**
	 * Create a new booking
	 */
	async createNewBooking(bookingData: {
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
	}): Promise<{ success: boolean; data?: any; message?: string }> {
		return this.request("/api/bookings", {
			method: "POST",
			body: JSON.stringify(bookingData),
			requiresAuth: true,
		});
	}

	/**
	 * Get available time slots for a specific date
	 */
	async getAvailableBookingSlots(date: string): Promise<{
		success: boolean;
		data?: string[];
		availableSlots?: string[];
		timeSlots?: string[];
	}> {
		return this.request(`/api/bookings/available-slots/${date}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Get user dashboard bookings with pagination
	 */
	async getUserDashboardBookings(
		page: number = 1,
		limit: number = 10,
		status?: string
	): Promise<{
		success: boolean;
		data?: any[];
		bookings?: any[];
		total?: number;
		page?: number;
		totalPages?: number;
		message?: string;
	}> {
		try {
			const userEmail = this.getUserEmail();

			if (!userEmail) {
				console.warn("⚠️ No user email found for bookings request");
				return {
					success: false,
					message: "No user email found. Please ensure you are logged in.",
					data: [],
					bookings: [],
					total: 0,
					page: 1,
					totalPages: 0,
				};
			}

			const queryParams = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				email: userEmail,
				...(status && { status }),
			});

			console.log(`📅 [getUserDashboardBookings] Fetching bookings for: ${userEmail}`);

			const response = await this.request(`/api/user/bookings?${queryParams}`, {
				method: "GET",
				requiresAuth: true,
			});

			console.log("📅 [getUserDashboardBookings] Response:", response);

			// Ensure consistent response structure
			return {
				success: response.success !== false,
				data: response.data || response.bookings || [],
				bookings: response.bookings || response.data || [],
				total: response.total || response.totalCount || 0,
				page: response.page || response.currentPage || page,
				totalPages: response.totalPages || Math.ceil((response.total || 0) / limit),
				message: response.message,
			};
		} catch (error) {
			console.error("❌ [getUserDashboardBookings] Error:", error);
			
			// Check if error is due to endpoint not implemented
			const errorMessage = error instanceof Error ? error.message : String(error);
			if (errorMessage.includes("not implemented") || errorMessage.includes("404")) {
				console.error("❌ Backend endpoint /api/user/bookings is not implemented!");
				return {
					success: false,
					message: "Booking endpoint is not yet implemented on the server. Please contact support.",
					data: [],
					bookings: [],
					total: 0,
					page: 1,
					totalPages: 0,
				};
			}

			return {
				success: false,
				message: errorMessage,
				data: [],
				bookings: [],
				total: 0,
				page: 1,
				totalPages: 0,
			};
		}
	}

	/**
	 * Get dashboard upcoming bookings
	 */
	async getDashboardUpcomingBookings(): Promise<{
		success: boolean;
		data?: any[];
		bookings?: any[];
	}> {
		const userEmail = this.getUserEmail();

		if (!userEmail) {
			throw new Error("No user email found. Please ensure you are logged in.");
		}

		return this.request(`/api/user/bookings/upcoming?email=${userEmail}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Get recent bookings for dashboard
	 */
	async getDashboardRecentBookings(): Promise<{
		success: boolean;
		data?: any[];
		bookings?: any[];
	}> {
		const userEmail = this.getUserEmail();

		if (!userEmail) {
			throw new Error("No user email found. Please ensure you are logged in.");
		}

		return this.request(`/api/user/bookings/recent?email=${userEmail}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Get specific booking by ID for authenticated user
	 */
	async getMyBookingById(id: string): Promise<{
		success: boolean;
		data?: any;
		booking?: any;
	}> {
		const userEmail = this.getUserEmail();

		if (!userEmail) {
			throw new Error("No user email found. Please ensure you are logged in.");
		}

		return this.request(`/api/user/bookings/${id}?email=${userEmail}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Cancel a booking
	 */
	async cancelUserBooking(
		id: string,
		cancellationReason?: string
	): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request(`/api/user/bookings/${id}/cancel`, {
			method: "PATCH",
			body: JSON.stringify({ cancellationReason }),
			requiresAuth: true,
		});
	}

	/**
	 * Get booking by ID (public access)
	 */
	async getPublicBookingById(id: string): Promise<{
		success: boolean;
		data?: any;
		booking?: any;
	}> {
		return this.request(`/api/bookings/${id}`, {
			method: "GET",
			requiresAuth: false, // Public access
		});
	}

	async getBookingById(id: string): Promise<{
		success: boolean;
		data?: any;
		booking?: any;
	}> {
		return this.request(`/api/bookings/${id}`, {
			method: "GET",
			requiresAuth: false, // Public access
		});
	}

	/**
	 * Get bookings by email (public access)
	 */
	async getBookingsByEmail(email: string): Promise<{
		success: boolean;
		data?: any[];
		bookings?: any[];
	}> {
		return this.request(`/api/bookings/email/${email}`, {
			method: "GET",
			requiresAuth: false, // Public access
		});
	}

	// =============================================
	// 🛒 ORDER ENDPOINTS
	// =============================================

	/**
	 * Create a new order
	 */
	async createNewOrder(orderData: {
		items: Array<{
			productId: string;
			name: string;
			quantity: number;
			price: number;
			image?: string;
		}>;
		totalAmount: number;
		shippingAddress: string;
		paymentMethod?: string;
		customerNotes?: string;
	}): Promise<{
		success: boolean;
		data?: any;
		order?: any;
		message?: string;
	}> {
		return this.request("/api/orders", {
			method: "POST",
			body: JSON.stringify(orderData),
			requiresAuth: true,
		});
	}

	/**
	 * Create a new order
	 */
	async createOrder(
		items: Array<{
			productId: string;
			productName?: string;
			name?: string;
			quantity: number;
			price: number;
			image?: string;
		}>,
		shippingAddress: any, // Address object or string
		totalAmount?: number,
		paymentMethod?: string,
		customerNotes?: string
	): Promise<{
		success: boolean;
		data?: any;
		order?: any;
		message?: string;
	}> {
		// Calculate total amount if not provided
		const calculatedTotal =
			totalAmount ||
			items.reduce((sum, item) => sum + item.price * item.quantity, 0);

		const orderData = {
			items: items.map((item) => ({
				productId: item.productId,
				productName: item.productName || item.name, // Map name to productName for backend
				quantity: item.quantity,
				price: item.price,
				// Note: image is not included as it's not in your backend model
			})),
			totalAmount: calculatedTotal,
			shippingAddress,
			paymentMethod: paymentMethod || "card",
			...(customerNotes && { customerNotes }),
		};

		return this.request("/api/orders", {
			method: "POST",
			body: JSON.stringify(orderData),
			requiresAuth: true,
		});
	}

	/**
	 * Get user's orders
	 */
	async getUserOrders(): Promise<{
		success: boolean;
		data?: any[];
		orders?: any[];
		message?: string;
	}> {
		return this.request("/api/orders/my-orders", {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Get user's orders with proper typing
	 */
	async getMyOrders(): Promise<{
		success: boolean;
		data?: any[];
		orders?: any[];
		message?: string;
	}> {
		try {
			const response = await this.request("/api/orders/my-orders", {
				method: "GET",
				requiresAuth: true,
			});

			// Ensure the response has the expected structure
			return {
				success: response.success !== false,
				data: response.data || response.orders || response,
				orders: response.orders || response.data || response,
				message: response.message,
			};
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to fetch orders",
			};
		}
	}

	async cancelUserOrder(orderId: string): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request(`/api/orders/${orderId}/cancel`, {
			method: "PUT",
			requiresAuth: true,
		});
	}

	/**
	 * Get order by order number
	 */
	async getOrderByNumber(orderNumber: string): Promise<{
		success: boolean;
		data?: any;
		order?: any;
		message?: string;
	}> {
		return this.request(`/api/orders/number/${orderNumber}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Get specific order by ID
	 */
	async getOrderById(orderId: string): Promise<{
		success: boolean;
		data?: any;
		order?: any;
		message?: string;
	}> {
		return this.request(`/api/orders/${orderId}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	/**
	 * Cancel an order
	 */
	async cancelOrder(orderId: string): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request(`/api/orders/${orderId}/cancel`, {
			method: "PUT",
			requiresAuth: true,
		});
	}

	/**
	 * Delete an order (for unpaid orders)
	 */
	async deleteOrder(orderId: string): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request(`/api/orders/${orderId}`, {
			method: "DELETE",
			requiresAuth: true,
		});
	}

	/**
	 * Update order status (admin functionality)
	 */
	async updateOrderStatus(
		orderId: string,
		status: string
	): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request(`/api/admin/orders/${orderId}/status`, {
			method: "PATCH",
			body: JSON.stringify({ status }),
			requiresAuth: true,
		});
	}

	// =============================================
	// 🤖 CHATBOT ENDPOINTS (PUBLIC)
	// =============================================

	async getChatSession(sessionId: string = "new"): Promise<ChatSession> {
		const response = await this.request(`/api/chat/session/${sessionId}`, {
			method: "GET",
			requiresAuth: true,
		});
		return response.data || response;
	}

	async sendChatMessage(
		messageData: SendMessageData
	): Promise<SendMessageResponse> {
		return this.request("/api/chat/send", {
			method: "POST",
			body: JSON.stringify(messageData),
			requiresAuth: true,
		});
	}

	async getChatHistory(sessionId: string): Promise<ChatSession> {
		const response = await this.request(`/api/chat/history/${sessionId}`, {
			method: "GET",
			requiresAuth: true,
		});
		return response.data || response;
	}

	async markChatAsRead(
		sessionId: string
	): Promise<{ success: boolean; message: string }> {
		return this.request(`/api/chat/read/${sessionId}`, {
			method: "PATCH",
			requiresAuth: true,
		});
	}

	async getUnreadChatCount(
		sessionId: string
	): Promise<{ unreadCount: number }> {
		const response = await this.request(`/api/chat/unread/${sessionId}`, {
			method: "GET",
			requiresAuth: true,
		});
		return response.data || response;
	}

	// =============================================
	// 🧹 SERVICE ENDPOINTS (PUBLIC)
	// =============================================

	async getActiveServices() {
		return this.request("/api/services/active", {
			method: "GET",
			requiresAuth: true,
		});
	}

	async getServiceById(id: string) {
		return this.request(`/api/services/${id}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	// =============================================
	// 🔐 AUTHENTICATION ENDPOINTS
	// =============================================

	async login(email: string, password: string) {
		const response = await this.request("/api/auth/user/login", {
			method: "POST",
			body: JSON.stringify({ email, password }),
		});

		// Store token if provided - check multiple possible locations
		const token = response.token || response.data?.token;
		if (token) {
			localStorage.setItem("token", token);
			sessionStorage.setItem("token", token);
		}

		return response;
	}

	async register(data: {
		email: string;
		password: string;
		name: string;
		phoneNumber?: string;
	}) {
		const response = await this.request("/api/auth/user/register", {
			method: "POST",
			body: JSON.stringify(data),
		});

		// Store token if provided - check multiple possible locations
		const token = response.token || response.data?.token;
		if (token) {
			localStorage.setItem("token", token);
			sessionStorage.setItem("token", token);
		}

		return response;
	}

	async forgotPassword(email: string) {
		return this.request("/api/auth/forgot-password", {
			method: "POST",
			body: JSON.stringify({ email }),
		});
	}

	async resetPassword(token: string, newPassword: string) {
		return this.request("/api/auth/resetpassword", {
			method: "POST",
			body: JSON.stringify({ token, newPassword }),
		});
	}

	// =============================================
	// 👤 USER ENDPOINTS
	// =============================================

	async getCurrentUser() {
		return this.request("/api/users/me", {
			method: "GET",
			requiresAuth: true,
		});
	}

	async updateProfile(data: any) {
		return this.request("/api/users/profile", {
			method: "PUT",
			body: JSON.stringify(data),
			requiresAuth: true,
		});
	}

	/**
	 * Change user password
	 */
	async changePassword(passwordData: {
		currentPassword: string;
		newPassword: string;
	}): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request("/api/auth/change-password", {
			method: "POST",
			body: JSON.stringify(passwordData),
			requiresAuth: true,
		});
	}

	/**
	 * Alternative method if your backend uses different endpoint
	 */
	async updatePassword(passwordData: {
		oldPassword: string;
		newPassword: string;
	}): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request("/api/users/change-password", {
			method: "PUT",
			body: JSON.stringify(passwordData),
			requiresAuth: true,
		});
	}

	debugAuth() {
		const cookieUser = this.getUserFromCookies();
		const token = this.getToken();
		const email = this.getUserEmail();

		return {
			cookieUser,
			hasToken: !!token,
			userEmail: email,
		};
	}

	// =============================================
	// 📁 CATEGORY ENDPOINTS
	// =============================================

	async getCategories() {
		const res = await this.request("/api/categories");

		if (Array.isArray(res)) return res;
		if (!res) return [];
		if (Array.isArray(res.data)) return res.data;
		if (Array.isArray(res.categories)) return res.categories;
		if (Array.isArray(res.items)) return res.items;
		if (Array.isArray(res.docs)) return res.docs;

		if (res.data && Array.isArray(res.data.categories))
			return res.data.categories;

		for (const key of Object.keys(res)) {
			if (Array.isArray((res as any)[key])) return (res as any)[key];
		}

		return [];
	}

	async getCategoryById(id: string) {
		return this.request(`/api/categories/${id}`);
	}

	async getCategoryTree() {
		const categories = await this.getCategories();
		return this.buildCategoryTree(categories);
	}

	async getCategoriesByLevel(level: number) {
		const categories = await this.getCategories();
		return categories.filter((cat: any) => cat.level === level);
	}

	async getCategoriesByParent(parentId: string) {
		const categories = await this.getCategories();
		return categories.filter((cat: any) => cat.parentId === parentId);
	}

	private buildCategoryTree(categories: any[]) {
		const level1: any[] = [];
		const level2: any[] = [];
		const level3: any[] = [];

		categories.forEach((category) => {
			switch (category.level) {
				case 1:
					level1.push(category);
					break;
				case 2:
					level2.push(category);
					break;
				case 3:
					level3.push(category);
					break;
			}
		});

		level2.forEach((level2Cat) => {
			const parent = level1.find(
				(level1Cat) => level1Cat.id === level2Cat.parentId
			);
			if (parent) {
				if (!parent.subcategories) parent.subcategories = [];
				parent.subcategories.push(level2Cat);
			}
		});

		level3.forEach((level3Cat) => {
			const parent = level2.find(
				(level2Cat) => level2Cat.id === level3Cat.parentId
			);
			if (parent) {
				if (!parent.subcategories) parent.subcategories = [];
				parent.subcategories.push(level3Cat);
			}
		});

		return { level1, level2, level3 };
	}

	// =============================================
	// 💳 PAYMENT ENDPOINTS
	// =============================================

	async initiatePayment(orderData: any) {
		return this.request("/api/payment", {
			method: "POST",
			body: JSON.stringify(orderData),
			requiresAuth: true,
		});
	}

	async verifyPayment(reference: string) {
		return this.request(`/api/payments/verify/${reference}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	// =============================================
	// 📧 CONTACT ENDPOINTS
	// =============================================

	async submitContactForm(contactData: {
		name: string;
		email: string;
		subject: string;
		message: string;
		phone?: string;
	}) {
		return this.request("/api/contact", {
			method: "POST",
			body: JSON.stringify(contactData),
			requiresAuth: true,
		});
	}

	// =============================================
	// 🛠️ ADMIN PRODUCT ENDPOINTS
	// =============================================

	async getAdminProducts() {
		return this.request("/api/admin/products", {
			method: "GET",
			requiresAuth: true,
		});
	}

	async getAdminProductById(productId: string) {
		return this.request(`/api/admin/products/${productId}`, {
			method: "GET",
			requiresAuth: true,
		});
	}

	async createAdminProduct(productData: any) {
		return this.requestWithFormData("/api/admin/products", productData, "POST");
	}

	async updateAdminProduct(productId: string, productData: any) {
		return this.requestWithFormData(
			`/api/admin/products/${productId}`,
			productData,
			"PUT"
		);
	}

	async toggleProductStatus(productId: string) {
		return this.request(`/api/admin/products/${productId}/toggle-status`, {
			method: "PATCH",
			requiresAuth: true,
		});
	}

	async deleteAdminProduct(productId: string) {
		return this.request(`/api/admin/products/${productId}`, {
			method: "DELETE",
			requiresAuth: true,
		});
	}

	/**
	 * Update product special categories - corrected endpoint
	 */
	async updateProductSpecialCategories(
		productId: string,
		categories: string[]
	) {
		return this.request(`/api/products/${productId}/special-categories`, {
			method: "PATCH",
			body: JSON.stringify({ categories }),
			requiresAuth: true,
		});
	}

	// =============================================
	// ❤️ WISHLIST ENDPOINTS
	// =============================================

	/**
	 * Add product to wishlist
	 */
	async addToWishlist(productId: string): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request("/api/wishlist/add", {
			method: "POST",
			body: JSON.stringify({ productId }),
			requiresAuth: true,
		});
	}

	/**
	 * Get user's wishlist
	 */
	async getWishlist(): Promise<{
		success: boolean;
		data?: any[];
		wishlist?: any[];
		message?: string;
	}> {
		try {
			const response = await this.request("/api/wishlist/my-wishlist", {
				method: "GET",
				requiresAuth: true,
			});

			return {
				success: response.success !== false,
				data: response.data || response.wishlist || response,
				wishlist: response.wishlist || response.data || response,
				message: response.message,
			};
		} catch (error) {
			return {
				success: false,
				message:
					error instanceof Error ? error.message : "Failed to fetch wishlist",
			};
		}
	}

	/**
	 * Check if product is in wishlist
	 */
	async checkWishlist(productId: string): Promise<{
		success: boolean;
		isInWishlist?: boolean;
		message?: string;
	}> {
		try {
			const response = await this.request(
				`/api/wishlist/check/${productId}`,
				{
					method: "GET",
					requiresAuth: true,
				}
			);

			return {
				success: response.success !== false,
				isInWishlist: response.isInWishlist || response.inWishlist || false,
				message: response.message,
			};
		} catch (error) {
			return {
				success: false,
				isInWishlist: false,
				message:
					error instanceof Error ? error.message : "Failed to check wishlist",
			};
		}
	}

	/**
	 * Remove product from wishlist
	 */
	async removeFromWishlist(productId: string): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request(`/api/wishlist/remove/${productId}`, {
			method: "DELETE",
			requiresAuth: true,
		});
	}

	/**
	 * Clear entire wishlist
	 */
	async clearWishlist(): Promise<{
		success: boolean;
		message?: string;
		data?: any;
	}> {
		return this.request("/api/wishlist/clear", {
			method: "DELETE",
			requiresAuth: true,
		});
	}

	// =============================================
	// 🛠️ UTILITY METHODS
	// =============================================

	private async requestWithFormData(
		endpoint: string,
		data: any,
		method: "POST" | "PUT" = "POST"
	) {
		const token = this.getToken();

		const formData = new FormData();

		Object.keys(data).forEach((key) => {
			if (data[key] !== null && data[key] !== undefined) {
				if (data[key] instanceof File) {
					formData.append(key, data[key]);
				} else if (typeof data[key] === "object") {
					formData.append(key, JSON.stringify(data[key]));
				} else {
					formData.append(key, data[key].toString());
				}
			}
		});

		try {
			const response = await fetch(`${this.baseUrl}${endpoint}`, {
				method,
				headers: {
					...(token && { Authorization: `Bearer ${token}` }),
				},
				body: formData,
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({
					message: `HTTP error! status: ${response.status}`,
				}));
				throw new Error(error.message || error.error || "Request failed");
			}

			return await response.json();
		} catch (error) {
			console.error("API request with FormData failed:", error);
			throw error;
		}
	}

	// In your ApiService - update the normalizeProducts method
	private normalizeProducts(products: any[]): Product[] {
		return products.map((product) => ({
			// Map all fields exactly as they come from the backend
			id: product.id,
			name: product.name || "",
			slug: product.slug || "",
			description: product.description || null,
			price: product.price?.toString() || "0",
			discountPrice: product.discountPrice?.toString() || undefined,
			categoryLevel1: product.categoryLevel1 || "",
			categoryLevel2: product.categoryLevel2 || null,
			categoryLevel3: product.categoryLevel3 || null,
			serviceType: product.serviceType || "physical",
			serviceDuration: product.serviceDuration || null,
			unit: product.unit || "piece",
			stock: typeof product.stock === "number" ? product.stock : 0,
			images: Array.isArray(product.images) ? product.images : [],
			isActive: product.isActive ?? true,
			tags: Array.isArray(product.tags) ? product.tags : [],
			brand: product.brand || null,
			isFeatured: product.isFeatured || false,
			isTrending: product.isTrending || false,
			isNewArrival: product.isNewArrival || false,
			featuredOrder: product.featuredOrder || 0,
			trendingOrder: product.trendingOrder || 0,
			newArrivalOrder: product.newArrivalOrder || 0,
			wishList: product.wishList || false,
			size: product.size || null,
			createdAt: product.createdAt || new Date().toISOString(),
			updatedAt: product.updatedAt || new Date().toISOString(),
		}));
	}
}

export const apiService = new ApiService(API_BASE_URL);