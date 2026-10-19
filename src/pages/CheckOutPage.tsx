import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart, CartItem } from "@/context/CartContext";
import { useAuth, User } from "@/context/AuthContext";
import { useOrder } from "@/context/OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import StripeProvider from "@/providers/CheckoutProvider";
import CheckoutForm from "@/components/stripe/CheckoutForm";
import type { PaymentIntent } from "@stripe/stripe-js";
import { apiService } from "@/context/ApiService";

const CheckoutPage: React.FC = () => {
	const { cart, getTotalPrice, clearCart } = useCart();
	const { user } = useAuth();
	const { addOrder, refreshOrders } = useOrder();
	const navigate = useNavigate();
	const [countryCode, setCountryCode] = useState<string>("GB"); // Default to GB (United Kingdom)
	const [clientSecret, setClientSecret] = useState<string>("");
	const [isLoadingPayment, setIsLoadingPayment] = useState(false);
	const [orderProcessed, setOrderProcessed] = useState(false); // Track if order has been processed
	const [createdOrderId, setCreatedOrderId] = useState<string | null>(null); // Store orderId for payment linking
	const [cartHash, setCartHash] = useState<string>(""); // Track cart changes

	const shippingCost = 10;
	const taxRate = 0.15; // 15% tax
	const subtotal = getTotalPrice();
	const tax = subtotal * taxRate;
	const total = subtotal + shippingCost + tax;

	// Helper function to generate a hash of the cart for comparison
	const generateCartHash = (cartItems: CartItem[]): string => {
		const cartData = cartItems
			.map((item) => `${item.product.id}-${item.quantity}-${item.size}`)
			.sort()
			.join("|");
		return btoa(cartData); // Simple base64 encoding as hash
	};

	// Helper functions to manage pending order in sessionStorage
	const getPendingOrder = (): {
		orderId: string;
		cartHash: string;
		clientSecret: string;
	} | null => {
		const pending = sessionStorage.getItem("pendingOrder");
		if (pending) {
			try {
				return JSON.parse(pending);
			} catch {
				return null;
			}
		}
		return null;
	};

	const setPendingOrder = (
		orderId: string,
		cartHash: string,
		clientSecret: string,
	) => {
		sessionStorage.setItem(
			"pendingOrder",
			JSON.stringify({ orderId, cartHash, clientSecret }),
		);
	};

	const clearPendingOrder = () => {
		sessionStorage.removeItem("pendingOrder");
	};

	useEffect(() => {
		if (cart.length === 0) {
			navigate("/cart");
		}
	}, [cart, navigate]);

	// Monitor cart changes - if cart changes after a pending order exists, clear it
	useEffect(() => {
		const currentCartHash = generateCartHash(cart);
		const pendingOrder = getPendingOrder();

		// If we have a pending order and cart has changed, clear it
		if (
			pendingOrder &&
			pendingOrder.cartHash !== currentCartHash &&
			cart.length > 0
		) {
			clearPendingOrder();
			setClientSecret("");
			setCreatedOrderId(null);
			setOrderProcessed(false);
		}
	}, [cart]);

	// Detect user's country for currency and payment processing
	useEffect(() => {
		const detectCountry = async () => {
			try {
				// Try to get country from browser's timezone
				const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

				// Simple mapping of common timezones to countries
				if (timezone.includes("Europe/London")) {
					setCountryCode("GB");
				} else if (
					timezone.includes("America/New_York") ||
					timezone.includes("America/Chicago") ||
					timezone.includes("America/Denver") ||
					timezone.includes("America/Los_Angeles")
				) {
					setCountryCode("US");
				} else if (timezone.includes("Europe/")) {
					setCountryCode("GB"); // Default EU country to GB
				} else if (timezone.includes("Africa/Accra")) {
					setCountryCode("GH");
				} else if (navigator.geolocation) {
					// Fallback to geolocation API if available
					setCountryCode("GB"); // Default to GB
				} else {
					setCountryCode("GB"); // Final fallback to GB
				}
			} catch (error) {
				// Country detection failed, log error and use default
				setCountryCode("GB");
			}
		};

		void detectCountry();
	}, []);

	// Enhanced product and user data handling
	const firstCartItem = cart[0]; // For single product checkout
	const productId = firstCartItem?.product.id?.toString() || "";
	const userId = user?.id?.toString() || user?.email?.toString() || "";

	// Calculate total quantity of all items in cart
	const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

	// For single product checkout, use first item's quantity
	const quantity = firstCartItem?.quantity || 1;

	// Validation checks
	const isValidCheckout = !!(
		productId &&
		userId &&
		firstCartItem &&
		user &&
		totalQuantity > 0
	);

	// Create currency helper function
	const getCurrency = (code: string): string => {
		if (code === "GB") return "gbp";
		if (code === "GH") return "ghs";
		if (code === "US") return "usd";
		return "gbp"; // Default to GBP
	};

	// Helper function for error messages
	const getCheckoutErrorMessage = (
		user: User | null,
		firstCartItem: CartItem,
	): string => {
		if (user === null) return "Please log in to continue with payment";
		if (firstCartItem === null) return "No items in cart";
		return "Unable to process checkout. Please try again.";
	};

	// Create order first, then PaymentIntent when component mounts and user/cart is ready
	// FLOW: Create Order → Get OrderId → Create PaymentIntent with OrderId → Payment Success → Update Order
	useEffect(() => {
		const createOrderAndPaymentIntent = async () => {
			if (!isValidCheckout) return;

			try {
				setIsLoadingPayment(true);

				// Generate current cart hash
				const currentCartHash = generateCartHash(cart);

				// Check if we have a pending order
				const pendingOrder = getPendingOrder();

				// If we have a pending order and cart hasn't changed, reuse it
				if (
					pendingOrder?.cartHash === currentCartHash &&
					pendingOrder.clientSecret &&
					pendingOrder.orderId
				) {
					setCreatedOrderId(pendingOrder.orderId);
					setClientSecret(pendingOrder.clientSecret);
					setCartHash(currentCartHash);
					setIsLoadingPayment(false);
					return;
				}

				// If cart changed or no pending order, clear old pending order
				if (pendingOrder) {
					clearPendingOrder();
				}

				// STEP 1: Create the order first
				const orderItems = cart.map((item) => ({
					productId: item.product.id.toString(),
					name: item.product.name,
					price: Number.parseFloat(item.product.discount || item.product.price),
					quantity: item.quantity,
					image: item.product.images[0],
				}));

				// Create order with temporary shipping address (will be updated after payment)
				const orderResponse = await apiService.createOrder(
					orderItems,
					user?.email || "To be confirmed", // Temporary address
					total,
					"stripe",
					"Order created for payment processing",
					undefined, // No paymentIntentId yet
				);

				if (!orderResponse.success || !orderResponse.data) {
					throw new Error("Failed to create order");
				}

				const orderId = orderResponse.data.id || orderResponse.data._id;
				if (!orderId) {
					throw new Error("Order created but no ID returned");
				}

				setCreatedOrderId(orderId);

				// STEP 2: Create PaymentIntent with orderId
				const response = await fetch(
					`${import.meta.env.VITE_API_URL}/api/payment`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
						},
						body: JSON.stringify({
							orderId, // Pass orderId to backend
							productId,
							userId,
							quantity,
							countryCode,
							paymentIntentMode: true,
							amount: Math.round(total * 100), // Amount in cents
							currency: getCurrency(countryCode),
							items: orderItems,
							subtotal: subtotal,
							shipping: shippingCost,
							tax: tax,
							total: total,
						}),
					},
				);

				if (!response.ok) {
					let errorMessage = `PaymentIntent creation failed: ${response.status} ${response.statusText}`;
					try {
						const errorData = await response.json();
						errorMessage = errorData.message || errorData.error || errorMessage;
					} catch {
						// If JSON parsing fails, use default error message
					}

					// Handle specific error cases
					if (response.status === 500) {
						throw new Error(`Backend error: ${response.status}`);
					}

					if (response.status === 404) {
						toast.error("Payment service not found. Please contact support.");
						throw new Error(`Endpoint not found: ${response.status}`);
					}

					throw new Error(errorMessage);
				}

				const responseData = await response.json();

				const { clientSecret: secret, paymentIntentId } = responseData;

				if (!secret) {
					throw new Error("No client secret received from PaymentIntent API");
				}

				// Check if this is a CheckoutSession secret instead of PaymentIntent
				if (secret.startsWith("cs_")) {
					throw new Error(
						"Backend returned CheckoutSession instead of PaymentIntent. Please ensure backend creates PaymentIntent when paymentIntentMode=true",
					);
				}

				// Validate PaymentIntent client secret format
				const isValidPaymentIntentSecret = secret.match(
					/^pi_[a-zA-Z0-9]+_secret_[a-zA-Z0-9]+$/,
				);

				if (!isValidPaymentIntentSecret) {
					throw new Error(
						"Invalid PaymentIntent client secret format received from server",
					);
				}

				setClientSecret(secret);
				setCartHash(currentCartHash);

				// Save pending order to sessionStorage
				setPendingOrder(orderId, currentCartHash, secret);
			} catch (error) {
				toast.error("Failed to initialize payment. Please try again.");
				setClientSecret(""); // Reset on error
				setCreatedOrderId(null); // Reset orderId on error
				clearPendingOrder(); // Clear pending order on error
			} finally {
				setIsLoadingPayment(false);
			}
		};

		void createOrderAndPaymentIntent();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // Empty dependency array - only create PaymentIntent once on mount

	const handlePaymentSuccess = async (paymentIntent: PaymentIntent) => {
		// Prevent duplicate order processing
		if (orderProcessed) {
			return;
		}

		try {
			setOrderProcessed(true); // Mark order as processed immediately

			// Extract billing address from paymentIntent
			const billingAddress = (paymentIntent as any).billingAddress;
			let shippingAddressString = user?.email || "To be confirmed";

			if (billingAddress) {
				// Format the address properly
				const addressParts = [
					billingAddress.line1,
					billingAddress.line2,
					billingAddress.city,
					billingAddress.state,
					billingAddress.postal_code,
					billingAddress.country,
				].filter(Boolean);

				if (addressParts.length > 0) {
					shippingAddressString = addressParts.join(", ");
				}
			}

			// Order already exists (created before payment), just refresh orders to get updated status
			// Backend should have updated the order with paymentIntentId

			// Create order items for success page
			const orderItems = cart.map((item) => ({
				productId: item.product.id.toString(),
				name: item.product.name,
				price: Number.parseFloat(item.product.discount || item.product.price),
				quantity: item.quantity,
				image: item.product.images[0],
			}));

			// TODO: Optionally update the order with the billing address if backend supports it
			// await apiService.updateOrder(createdOrderId, { shippingAddress: shippingAddressString });

			// Refresh orders to get latest status
			await refreshOrders();

			// Clear the cart after successful payment
			clearCart();

			// Clear pending order from sessionStorage
			clearPendingOrder();

			toast.success("Payment completed successfully!");

			// Navigate to success page with payment details
			navigate("/payment/success", {
				state: {
					paymentIntentId: paymentIntent.id,
					amount: total,
					currency: getCurrency(countryCode),
					orderItems,
					paymentMethod: "PaymentIntent",
				},
			});
		} catch (error) {
			setOrderProcessed(false); // Reset if there was an error
			toast.error(
				"Payment succeeded but there was an error processing your order. Please contact support.",
			);
		}
	};

	const handlePaymentError = (error: string) => {
		toast.error(`Payment failed: ${error}`);

		// Reset loading state in case user wants to retry
		setIsLoadingPayment(false);
	};

	if (cart.length === 0) {
		return null;
	}

	return (
		<Layout>
			<div className="container mx-auto px-4 py-8 md:py-12">
				<div className="max-w-7xl mx-auto">
					<Button
						variant="ghost"
						onClick={() => navigate("/cart")}
						className="mb-4 md:mb-6"
					>
						<ArrowLeft className="h-4 w-4 mr-2" />
						Back to Cart
					</Button>

					<h1 className="text-2xl md:text-3xl font-bold mb-2">
						Secure Checkout
					</h1>
					<p className="text-sm md:text-base text-muted-foreground mb-6 md:mb-8">
						Complete your purchase with our secure payment system
					</p>

					<div className="flex flex-col md:flex-row gap-6 xl:gap-8">
						{/* Right Column - Payment Form */}
						<div className="w-full xl:w-[500px]">
							{isValidCheckout ? (
								<>
									{isLoadingPayment && (
										<Card>
											<CardContent className="py-12 text-center">
												<p className="text-muted-foreground">
													Preparing payment...
												</p>
											</CardContent>
										</Card>
									)}
									{!isLoadingPayment && clientSecret && (
										<StripeProvider clientSecret={clientSecret}>
											<CheckoutForm
												clientSecret={clientSecret}
												amount={Math.round(total * 100)}
												currency={getCurrency(countryCode)}
												onSuccess={handlePaymentSuccess}
												onError={handlePaymentError}
											/>
										</StripeProvider>
									)}
									{!isLoadingPayment && !clientSecret && (
										<Card>
											<CardContent className="py-12 text-center">
												<p className="text-muted-foreground">
													Failed to initialize payment
												</p>
											</CardContent>
										</Card>
									)}
								</>
							) : (
								<Card>
									<CardContent className="py-12 text-center">
										<p className="text-muted-foreground mb-4">
											{getCheckoutErrorMessage(user, firstCartItem)}
										</p>
										{user === null && (
											<Button
												onClick={() => navigate("/auth")}
												variant="outline"
											>
												Login to Continue
											</Button>
										)}
									</CardContent>
								</Card>
							)}
						</div>

						{/* Left Column - Order Summary */}
						<div className="w-full xl:flex-1">
							<Card className="mb-6">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-lg md:text-xl">
										<ShoppingCart className="h-5 w-5" />
										Order Summary
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{/* Products List */}
									<div className="space-y-3 max-h-[400px] md:max-h-96 overflow-y-auto">
										{cart.map((item) => {
											const itemPrice = Number.parseFloat(
												item.product.discount || item.product.price,
											);
											const itemTotal = itemPrice * item.quantity;

											return (
												<div
													key={item.product.id}
													className="flex gap-3 md:gap-4 pb-3 border-b last:border-0"
												>
													<img
														src={item.product.images[0]}
														alt={item.product.name}
														className="w-16 h-16 md:w-20 md:h-20 object-cover rounded flex-shrink-0"
													/>
													<div className="flex-1 min-w-0">
														<p className="font-medium text-sm md:text-base truncate">
															{item.product.name}
														</p>
														<p className="text-xs md:text-sm text-muted-foreground">
															Qty: {item.quantity} × £{itemPrice.toFixed(2)}
														</p>
														<p className="text-sm md:text-base font-semibold mt-1">
															£{itemTotal.toFixed(2)}
														</p>
													</div>
												</div>
											);
										})}
									</div>

									{/* Price Breakdown */}
									<div className="pt-4 border-t space-y-3">
										<div className="flex justify-between text-sm md:text-base">
											<span className="text-muted-foreground">Subtotal</span>
											<span className="font-medium">
												£{subtotal.toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between text-sm md:text-base">
											<span className="text-muted-foreground">Shipping</span>
											<span className="font-medium">
												£{shippingCost.toFixed(2)}
											</span>
										</div>
										<div className="flex justify-between text-sm md:text-base">
											<span className="text-muted-foreground">Tax (15%)</span>
											<span className="font-medium">£{tax.toFixed(2)}</span>
										</div>
										<div className="flex justify-between text-lg md:text-xl font-bold pt-3 border-t">
											<span>Total</span>
											<span>£{total.toFixed(2)}</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>

					{/* Trust Badges */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs md:text-sm text-muted-foreground mt-8 pt-8 border-t">
						<div className="flex items-center gap-2">
							<svg
								className="h-5 w-5 text-green-600 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
									clipRule="evenodd"
								/>
							</svg>
							<span>Secure Checkout</span>
						</div>
						<div className="flex items-center gap-2">
							<svg
								className="h-5 w-5 text-green-600 flex-shrink-0"
								fill="currentColor"
								viewBox="0 0 20 20"
							>
								<path
									fillRule="evenodd"
									d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 0 1 6 0z"
									clipRule="evenodd"
								/>
							</svg>
							<span>SSL Encrypted</span>
						</div>
						<div className="flex items-center gap-2">
							<CreditCard className="h-5 w-5 text-green-600" />
							<span>PCI Compliant</span>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default CheckoutPage;
