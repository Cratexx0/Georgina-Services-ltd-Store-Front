import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, ExternalLink } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "https://georgina-server-code.onrender.com";

interface CheckoutSessionWrapperProps {
	productId: string;
	userId: string;
	quantity: number;
	countryCode?: string;
	onSuccess?: (orderId: string, sessionId: string) => void;
	onError?: (error: string) => void;
	productName?: string;
	totalAmount?: number;
	currency?: string;
}

export function CheckoutSessionWrapper({
	productId,
	userId,
	quantity,
	countryCode = "GB",
	onSuccess,
	onError,
	productName = "Product",
	totalAmount = 0,
	currency = "GBP",
}: CheckoutSessionWrapperProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleCheckout = async () => {
		try {
			setIsLoading(true);
			setError(null);

			const response = await fetch(`${API_BASE_URL}/api/payment`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({
					productId,
					userId,
					quantity,
					countryCode,
				}),
				signal: AbortSignal.timeout(30000),
			});

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(
					`Failed to create checkout session: ${response.status} ${response.statusText}`
				);
			}

			const { url, orderId, sessionId } = await response.json();

			if (url) {
				// Redirect to Stripe Checkout
				toast.success("Redirecting to secure payment...");

				// Call success callback before redirect
				onSuccess?.(orderId, sessionId);

				// Redirect to Stripe's hosted checkout page
				window.location.href = url;
			} else {
				throw new Error("No checkout URL received from server");
			}
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to initialize checkout";
			setError(errorMessage);
			onError?.(errorMessage);
			toast.error("Failed to initialize payment. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<CreditCard className="h-5 w-5" />
					Secure Payment
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{error && (
					<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
						{error}
					</div>
				)}

				<div className="space-y-2 text-sm text-gray-600">
					<p>
						<strong>Product:</strong> {productName}
					</p>
					<p>
						<strong>Quantity:</strong> {quantity}
					</p>
					<p>
						<strong>Total:</strong>{" "}
						{new Intl.NumberFormat("en-US", {
							style: "currency",
							currency: currency,
						}).format(totalAmount)}
					</p>
				</div>

				<Button
					onClick={handleCheckout}
					disabled={isLoading}
					className="w-full"
					size="lg"
				>
					{isLoading ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Preparing checkout...
						</>
					) : (
						<>
							<ExternalLink className="h-4 w-4 mr-2" />
							Pay with Stripe
						</>
					)}
				</Button>

				<p className="text-xs text-gray-500 text-center">
					You'll be redirected to Stripe's secure payment page
				</p>
			</CardContent>
		</Card>
	);
}

export default CheckoutSessionWrapper;
