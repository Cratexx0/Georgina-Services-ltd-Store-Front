import React, { useCallback, useState } from "react";
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
	onInitializePayment?: () => Promise<string>;
}

export function CheckoutForm({
	clientSecret,
	amount,
	currency,
	onSuccess,
	onError,
	className = "",
	onInitializePayment,
}: CheckoutFormProps) {
	const stripe = useStripe();
	const elements = useElements();
	const [isProcessing, setIsProcessing] = useState(false);
	const [message, setMessage] = useState<string | null>(null);
	const [isAddressComplete, setIsAddressComplete] = useState(false);
	const [paymentCompleted, setPaymentCompleted] = useState(false); // Add flag to prevent duplicate submissions
	const [billingAddress, setBillingAddress] = useState<any>(null); // Store billing address

	const confirmPayment = useCallback(async (paymentClientSecret = clientSecret) => {
		if (!stripe || !elements || paymentCompleted || !paymentClientSecret) {
			return;
		}

		setIsProcessing(true);
		setMessage(null);

		try {
			const { error, paymentIntent } = await stripe.confirmPayment({
				elements,
				clientSecret: paymentClientSecret,
				confirmParams: {
					return_url: `${globalThis.window.location.origin}/payment/success`,
				},
				redirect: "if_required",
			});

			if (error) {
				const errorMessage = error.message || "Payment failed. Please try again.";
				setMessage(errorMessage);
				onError?.(errorMessage);
				toast.error(errorMessage);
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
			const errorMessage =
				err instanceof Error ? err.message : "Unable to process payment";
			setMessage(errorMessage);
			onError?.(errorMessage);
			toast.error(errorMessage);
		} finally {
			setIsProcessing(false);
		}
	}, [clientSecret, elements, onError, paymentCompleted, stripe, billingAddress, onSuccess]);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!stripe || !elements || paymentCompleted || isProcessing) {
			return;
		}

		setIsProcessing(true);
		setMessage(null);

		try {
			if (!clientSecret) {
				const { error } = await elements.submit();
				if (error) {
					const errorMessage =
						error.message || "Please check your payment details.";
					setMessage(errorMessage);
					onError?.(errorMessage);
					toast.error(errorMessage);
					return;
				}

				const paymentClientSecret = await onInitializePayment?.();
				if (!paymentClientSecret) {
					throw new Error("Unable to initialize payment");
				}

				await confirmPayment(paymentClientSecret);
				return;
			}

			await confirmPayment();
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Unable to initialize payment";
			setMessage(errorMessage);
			onError?.(errorMessage);
			toast.error(errorMessage);
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
