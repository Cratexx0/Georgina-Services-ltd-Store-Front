// Configuration for environment variables and API settings
export const config = {
	stripe: {
		publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
	},
	api: {
		baseUrl: import.meta.env.VITE_API_URL || "http://localhost:3001/api",
	},
	app: {
		url: import.meta.env.VITE_APP_URL || "http://localhost:5173",
	},
} as const;

// Validate required environment variables
if (!config.stripe.publishableKey) {
	// console.warn(
	// 	"VITE_STRIPE_PUBLISHABLE_KEY is not set. Stripe functionality will be disabled."
	// );
}

export default config;
