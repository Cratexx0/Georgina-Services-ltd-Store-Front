import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
	Check,
	Package,
	Mail,
	ArrowRight,
	Home,
	ShoppingBag,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

interface OrderItem {
	productId: string;
	name: string;
	price: number;
	quantity: number;
	image?: string;
}

const Success = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const {
		paymentIntentId,
		amount,
		orderItems,
		currency = "USD",
		paymentMethod,
	} = location.state || {};
	const [showConfetti, setShowConfetti] = useState(true);

	useEffect(() => {
		// Scroll to top when component mounts
		window.scrollTo(0, 0);

		// Hide confetti animation after 3 seconds
		const timer = setTimeout(() => setShowConfetti(false), 3000);

		// If no payment data, redirect to home after 5 seconds
		if (!paymentIntentId) {
			setTimeout(() => navigate("/"), 5000);
		}

		return () => clearTimeout(timer);
	}, [paymentIntentId, navigate]);

	return (
		<Layout>
			<div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 py-12 px-4 relative overflow-hidden">
				{/* Background decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full pointer-events-none">
					<div className="absolute top-10 left-10 w-32 h-32 bg-emerald-100 rounded-full opacity-20 blur-3xl"></div>
					<div className="absolute top-40 right-20 w-48 h-48 bg-blue-100 rounded-full opacity-20 blur-3xl"></div>
					<div className="absolute bottom-20 left-1/3 w-40 h-40 bg-green-100 rounded-full opacity-20 blur-3xl"></div>
				</div>

				{/* Confetti animation */}
				{showConfetti && (
					<div className="absolute inset-0 pointer-events-none">
						<div className="animate-bounce delay-100 absolute top-20 left-1/4 w-3 h-3 bg-yellow-400 rounded-full"></div>
						<div className="animate-bounce delay-200 absolute top-32 left-1/3 w-2 h-2 bg-blue-400 rounded-full"></div>
						<div className="animate-bounce delay-300 absolute top-24 right-1/4 w-3 h-3 bg-pink-400 rounded-full"></div>
						<div className="animate-bounce delay-150 absolute top-40 right-1/3 w-2 h-2 bg-green-400 rounded-full"></div>
						<div className="animate-bounce delay-75 absolute top-16 left-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
						<div className="animate-bounce delay-300 absolute top-28 right-1/2 w-3 h-3 bg-orange-400 rounded-full"></div>
					</div>
				)}

				<div className="max-w-4xl mx-auto relative z-10">
					{/* Success Icon and Title */}
					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-lg mb-6 animate-pulse">
							<Check className="h-10 w-10 text-white" strokeWidth={3} />
						</div>

						<h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent mb-3">
							Payment Successful!
						</h1>
						<p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
							🎉 Thank you for your purchase! Your order has been confirmed and
							will be processed shortly.
						</p>
					</div>

					<div className="grid md:grid-cols-2 gap-8 mb-8">
						{/* Order Summary Card */}
						<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<Package className="h-5 w-5 text-emerald-600" />
									<h3 className="text-xl font-semibold text-gray-900">
										Order Summary
									</h3>
								</div>

								<div className="space-y-3">
									{paymentIntentId && (
										<div className="flex justify-between items-center py-2 border-b border-gray-100">
											<span className="text-sm font-medium text-gray-600">
												Payment ID
											</span>
											<span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-800">
												...{paymentIntentId.slice(-8)}
											</span>
										</div>
									)}
									{amount && (
										<div className="flex justify-between items-center py-2 border-b border-gray-100">
											<span className="text-sm font-medium text-gray-600">
												Total Amount
											</span>
											<span className="text-lg font-bold text-emerald-600">
												${amount.toFixed(2)} {currency?.toUpperCase()}
											</span>
										</div>
									)}
									{orderItems && (
										<div className="flex justify-between items-center py-2 border-b border-gray-100">
											<span className="text-sm font-medium text-gray-600">
												Items
											</span>
											<span className="text-sm font-semibold text-gray-800">
												{orderItems.length} product
												{orderItems.length !== 1 ? "s" : ""}
											</span>
										</div>
									)}
									{paymentMethod && (
										<div className="flex justify-between items-center py-2 border-b border-gray-100">
											<span className="text-sm font-medium text-gray-600">
												Payment Method
											</span>
											<span className="text-sm font-semibold text-gray-800 capitalize">
												{paymentMethod}
											</span>
										</div>
									)}
									<div className="flex justify-between items-center py-2">
										<span className="text-sm font-medium text-gray-600">
											Date
										</span>
										<span className="text-sm font-semibold text-gray-800">
											{new Date().toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Next Steps Card */}
						<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
							<CardContent className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<Mail className="h-5 w-5 text-blue-600" />
									<h3 className="text-xl font-semibold text-gray-900">
										What's Next?
									</h3>
								</div>

								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
											<span className="text-xs font-bold text-blue-600">1</span>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-800">
												Confirmation Email
											</p>
											<p className="text-xs text-gray-600">
												You'll receive a confirmation email with order details
												shortly.
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
											<span className="text-xs font-bold text-blue-600">2</span>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-800">
												Order Processing
											</p>
											<p className="text-xs text-gray-600">
												Your order will be processed within 1-2 business days.
											</p>
										</div>
									</div>

									<div className="flex items-start gap-3">
										<div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
											<span className="text-xs font-bold text-blue-600">3</span>
										</div>
										<div>
											<p className="text-sm font-medium text-gray-800">
												Track Your Order
											</p>
											<p className="text-xs text-gray-600">
												You can track your order status in your account
												dashboard.
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Order Items (if available) */}
					{orderItems && orderItems.length > 0 && (
						<Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
							<CardContent className="p-6">
								<h3 className="text-xl font-semibold text-gray-900 mb-4">
									Your Items
								</h3>
								<div className="space-y-3">
									{orderItems.map((item: OrderItem, index: number) => (
										<div
											key={index}
											className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
										>
											{item.image && (
												<img
													src={item.image}
													alt={item.name}
													className="w-12 h-12 object-cover rounded-lg"
												/>
											)}
											<div className="flex-1">
												<p className="font-medium text-gray-900">{item.name}</p>
												<p className="text-sm text-gray-600">
													Quantity: {item.quantity} × ${item.price?.toFixed(2)}
												</p>
											</div>
											<p className="font-semibold text-emerald-600">
												${(item.quantity * item.price).toFixed(2)}
											</p>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Action Buttons */}
					<div className="flex flex-col sm:flex-row gap-4 justify-end">
						<Link to="/dashboard" className="flex-1 max-w-xs">
							<Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg">
								<Package className="h-4 w-4 mr-2" />
								View Order Details
								<ArrowRight className="h-4 w-4 ml-2" />
							</Button>
						</Link>

						<Link to="/" className="flex-1 max-w-xs">
							<Button
								variant="outline"
								className="w-full border-2 border-emerald-200 hover:bg-emerald-50 hover:border-emerald-300"
							>
								<ShoppingBag className="h-4 w-4 mr-2" />
								Continue Shopping
							</Button>
						</Link>
					</div>

					{/* Fallback message for missing data */}
					{!paymentIntentId && (
						<div className="text-center mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
							<p className="text-yellow-800">
								⚠️ No payment information found. Redirecting to home page...
							</p>
						</div>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default Success;
