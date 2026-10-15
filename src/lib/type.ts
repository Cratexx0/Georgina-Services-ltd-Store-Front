// src/types/product.ts
export interface Product {
	// Core identifiers
	id: number;
	name: string;
	slug: string;
	description: string | null;

	// Pricing
	// Prisma Decimal values are commonly serialized as strings in JSON.
	price: string;
	discount: string;

	// Categories
	categoryLevel1: string;
	categoryLevel2: string | null;
	categoryLevel3: string | null;

	// Product details
	unit: string;
	weight: string | null;

	// Inventory
	stock: number;
	images: string[] | null;

	// Ratings
	averageRating: string;
	totalReviews: number;

	// Status
	isActive: boolean;

	// Metadata
	tags: string[] | null;
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

	// Product sizes and variants
	size: ProductSize | null;

	// Timestamps
	createdAt: string;
	updatedAt: string;
}

/**
 * Adapt this interface to the JSON structure stored in
 * the Prisma Product.size field.
 */
export interface ProductSize {
	sizes?: string[];
	colors?: string[];
	[key: string]: unknown;
}

export interface Order {
	id: string;
	customerName: string;
	customerEmail: string;
	status: "pending" | "processing" | "completed" | "cancelled";
	paymentStatus: "paid" | "unpaid" | "refunded";
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
	type: "order" | "product" | "system";
	read: boolean;
	createdAt: string;
}

export interface Booking {
	id: string;
	customerName: string;
	customerEmail: string;
	customerPhone: string;
	serviceType: "basic" | "deep" | "office" | "post-construction";
	address: string;
	date: string;
	time: string;
	duration: number;
	price: number;
	status: "pending" | "confirmed" | "in-progress" | "completed" | "cancelled";
	notes?: string;
	createdAt: string;
	updatedAt: string;
}
