import React, { useState } from "react";
import {
	useStripe,
	useElements,
	PaymentElement,
	AddressElement,
} from "@stripe/react-stripe-js";
import { PaymentIntent } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CreditCard } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface CheckoutFormProps {
	clientSecret: string;
	onSuccess?: (paymentIntent: PaymentIntent) => void;
	onError?: (error: string) => void;
	className?: string;
	amount: number;
	currency?: string;
}

export function CheckoutForm({
	clientSecret,
	amount,
	currency,
	onSuccess,
	onError,
	className = "",
}: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [isAddressComplete, setIsAddressComplete] = useState(false);
	const [paymentCompleted, setPaymentCompleted] = useState(false); // Add flag to prevent duplicate submissions
	const [billingAddress, setBillingAddress] = useState<any>(null); // Store billing address

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!stripe || !elements || paymentCompleted) {
			return;
		}

		setIsProcessing(true);
		setMessage(null);

		try {
			// Confirm the payment with Elements (clientSecret is provided by Elements)
			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${globalThis.window.location.origin}/payment/success`,
				},
				redirect: "if_required",
			});

			if (error) {
				if (error.type === "card_error" || error.type === "validation_error") {
					setMessage(error.message || "Payment failed. Please try again.");
					onError?.(error.message || "Payment failed");
				} else {
					setMessage("An unexpected error occurred. Please try again.");
					onError?.("An unexpected error occurred");
				}
				toast.error(error.message || "Payment failed");
			} else if (paymentIntent) {
				if (paymentIntent.status === "succeeded") {
					setPaymentCompleted(true); // Mark payment as completed to prevent duplicate submissions
					setMessage("Payment succeeded!");
					toast.success("Payment completed successfully!");
					// Pass paymentIntent with billing address attached
					(paymentIntent as any).billingAddress = billingAddress;
					onSuccess?.(paymentIntent);
				} else {
					setMessage(`Payment ${paymentIntent.status}`);
					toast.info(`Payment ${paymentIntent.status}`);
				}
			}
		} catch (err) {
			setMessage("An unexpected error occurred.");
			toast.error("An unexpected error occurred");
		} finally {
			setIsProcessing(false);
		}
	};

	const isSubmitDisabled = !stripe || !elements || isProcessing || paymentCompleted;

	return (
		<form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<CreditCard className="h-5 w-5" />
						Payment Details
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<PaymentElement
						options={{
							layout: "tabs",
							wallets: {
								applePay: "auto",
								googlePay: "auto",
							},
						}}
					/>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Billing Address</CardTitle>
				</CardHeader>
				<CardContent>
					<AddressElement
						options={{
							mode: "billing",
							allowedCountries: ["GB", "US", "CA", "AU"],
						}}
						onChange={(event) => {
							setIsAddressComplete(event.complete);
							if (event.complete && event.value.address) {
								// Store the billing address when complete
								setBillingAddress(event.value.address);
							}
						}}
					/>
				</CardContent>
			</Card>

			{message && (
				<Alert
					variant={message.includes("succeeded") ? "default" : "destructive"}
				>
					<AlertDescription>{message}</AlertDescription>
				</Alert>
			)}

			<div className="flex justify-between items-center pt-4 border-t">
				<div className="text-lg font-semibold">
					Total:{" "}
					{new Intl.NumberFormat("en-GB", {
						style: "currency",
						currency: currency?.toUpperCase() || "GBP",
					}).format(amount / 100)}
				</div>

				<Button
					type="submit"
					disabled={isSubmitDisabled}
					className="min-w-[140px]"
					size="lg"
				>
					{isProcessing ? (
						<>
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							Processing...
						</>
					) : (
						"Pay Now"
					)}
				</Button>
			</div>
		</form>
	);
}

export default CheckoutForm;
