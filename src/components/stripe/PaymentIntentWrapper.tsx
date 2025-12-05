import React, { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import {
	loadStripe,
	StripeElementsOptions,
	PaymentIntent,
} from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import config from "@/config/env";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const API_BASE_URL =
	import.meta.env.VITE_API_URL || "https://georgina-server-code.onrender.com";

// Initialize Stripe
const stripePromise = loadStripe(config.stripe.publishableKey);

interface PaymentIntentWrapperProps {
	readonly onSuccess?: (paymentIntent: PaymentIntent) => void;
	readonly onError?: (error: string) => void;
}

export function PaymentIntentWrapper({
	onSuccess,
	onError,
}: PaymentIntentWrapperProps) {
	const [clientSecret, setClientSecret] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const createPaymentIntent = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await fetch(`${API_BASE_URL}/api/payment`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({}),
					signal: AbortSignal.timeout(30000), // 30 second timeout
				});

				if (!response.ok) {
					throw new Error(
						`Failed to create payment intent: ${response.status} ${response.statusText}`
					);
				}

				const { clientSecret } = await response.json();
				setClientSecret(clientSecret);
			} catch (err) {
				const errorMessage =
					err instanceof Error ? err.message : "Failed to initialize payment";

				// For development: create a test client secret when backend is not available
				if (
					err instanceof Error &&
					(err.message.includes("404") ||
						err.message.includes("Failed to fetch"))
				) {
					setClientSecret("pi_test_1234567890_secret_test_client_secret");
				} else {
					setError(errorMessage);
					onError?.(errorMessage);
				}
			} finally {
				setLoading(false);
			}
		};

		createPaymentIntent();
	}, [onError]);

	const options: StripeElementsOptions = {
		...(clientSecret
			? { clientSecret }
			: { mode: "payment", amount: 1000, currency: "usd" }),
		appearance: {
			theme: "stripe",
			variables: {
				colorPrimary: "#0570de",
				colorBackground: "#ffffff",
				colorText: "#30313d",
				colorDanger: "#df1b41",
				fontFamily: "Inter, system-ui, sans-serif",
				spacingUnit: "4px",
				borderRadius: "6px",
			},
		},
	};

	if (loading) {
		return (
			<Card>
				<CardContent className="flex items-center justify-center py-12">
					<div className="flex flex-col items-center space-y-4">
						<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						<p className="text-muted-foreground">
							Initializing secure payment...
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card>
				<CardContent className="py-12">
					<div className="text-center text-red-600">
						<p className="font-semibold mb-2">Payment Initialization Error</p>
						<p className="text-sm">{error}</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	// Render Elements even without clientSecret using mode
	return (
		<Elements options={options} stripe={stripePromise}>
			<CheckoutForm
				clientSecret={clientSecret || ""}
				amount={0}
				onSuccess={onSuccess}
				onError={onError}
			/>
		</Elements>
	);
}

export default PaymentIntentWrapper;
