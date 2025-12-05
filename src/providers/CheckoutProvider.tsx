import React, { useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import config from "@/config/env";

// Initialize Stripe outside of component to avoid recreating the Stripe object on every render
const stripePromise = loadStripe(config.stripe.publishableKey);

interface StripeProviderProps {
	readonly children: React.ReactNode;
	readonly clientSecret?: string;
}

export function StripeProvider({
	children,
	clientSecret,
}: StripeProviderProps) {
	const options = useMemo(
		() => ({
			...(clientSecret && { clientSecret }), // Only include clientSecret if it exists
			// Appearance customization
			appearance: {
				theme: "stripe" as const,
				variables: {
					colorPrimary: "#0570de",
					colorBackground: "#ffffff",
					colorText: "#30313d",
					colorDanger: "#df1b41",
					fontFamily: "Inter, system-ui, sans-serif",
					spacingUnit: "4px",
					borderRadius: "6px",
				},
				rules: {
					".Input": {
						border: "1px solid #e3e8ee",
						boxShadow: "none",
					},
					".Input:focus": {
						border: "1px solid #0570de",
						boxShadow: "0 0 0 2px rgba(5, 112, 222, 0.1)",
					},
					".Label": {
						fontWeight: "500",
						marginBottom: "8px",
					},
				},
			},
		}),
		[clientSecret]
	);

	// Don't render Elements if clientSecret is invalid
	if (!clientSecret || clientSecret.trim() === "") {
		return <>{children}</>;
	}

	return (
		<Elements stripe={stripePromise} options={options}>
			{children}
		</Elements>
	);
}

export default StripeProvider;
