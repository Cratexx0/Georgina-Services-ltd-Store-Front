import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { apiService } from "@/context/ApiService";

const ForgotPassword = () => {
	const [email, setEmail] = useState<string>("");
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [emailSent, setEmailSent] = useState<boolean>(false);
	const { toast } = useToast();
	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Basic email validation
		if (!email || !email.includes("@")) {
			toast({
				title: "Invalid email",
				description: "Please enter a valid email address.",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);

		try {
			// Check if the method exists
			if (!apiService.forgotPassword) {
				console.error("❌ forgotPassword method not found in apiService");
				throw new Error("API service configuration error");
			}

			const response = await apiService.forgotPassword(email);

			if (response.success) {
				setEmailSent(true);
				toast({
					title: "Password reset email sent",
					description:
						response.message || "Check your inbox for further instructions.",
				});
			} else {
				throw new Error(response.message || "Failed to send reset email");
			}
		} catch (error) {
			error();

			let errorMessage = "Failed to send reset email. Please try again.";

			// Handle specific error cases
			if (error.message?.includes("Network error")) {
				errorMessage =
					"Cannot connect to server. Please check your internet connection.";
			} else if (
				error.message?.includes("user") ||
				error.message?.includes("not found")
			) {
				errorMessage = "No account found with this email address.";
			} else if (error.message?.includes("API service configuration")) {
				errorMessage = "System error. Please refresh the page and try again.";
			} else if (error.message) {
				errorMessage = error.message;
			}

			toast({
				title: "Failed to send reset email",
				description: errorMessage,
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};
	const handleResendEmail = async () => {
		if (!email) {
			toast({
				title: "Email required",
				description: "Please enter your email address again.",
				variant: "destructive",
			});
			setEmailSent(false);
			return;
		}

		setIsLoading(true);
		try {
			const response = await apiService.forgotPassword(email);

			if (response.success) {
				toast({
					title: "Reset email sent again",
					description: "We've sent another password reset link to your email.",
				});
			} else {
				throw new Error(response.message || "Failed to resend email");
			}
		} catch (error) {
			error();
			toast({
				title: "Failed to resend email",
				description: "Please try again in a few minutes.",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div
			className="min-h-screen flex flex-col relative overflow-hidden"
			style={{
				backgroundImage:
					"url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
				backgroundSize: "cover",
				backgroundPosition: "center",
			}}
		>
			{/* Overlay */}
			<div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>

			{/* Top Navigation */}
			<div className="relative z-10 p-6">
				<Button
					variant="ghost"
					onClick={() => navigate("/auth")}
					className="hover:bg-accent animate-fade-in"
					disabled={isLoading}
				>
					<ArrowLeft className="mr-2 h-4 w-4" />
					Back to login
				</Button>
			</div>

			<div className="flex-grow flex items-center justify-center px-4 relative z-10">
				<div className="w-full max-w-md">
					<div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg">
						{!emailSent ? (
							<>
								<div className="animate-fade-in">
									<h2 className="text-2xl font-bold tracking-tight text-center mb-4">
										Forgot your password?
									</h2>
									<p className="text-sm text-muted-foreground text-center mb-6">
										Enter your email and we'll send you a link to reset your
										password.
									</p>
								</div>

								<form onSubmit={handleSubmit} className="space-y-4">
									<div className="animate-fade-in mb-4 delay-200">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											placeholder="name@example.com"
											required
											className="mt-1 py-4"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											disabled={isLoading}
										/>
									</div>
									<Button
										type="submit"
										className="w-full animate-fade-in delay-400"
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
												Sending reset link...
											</div>
										) : (
											<>
												<Mail className="mr-2 h-4 w-4" />
												Send reset link
											</>
										)}
									</Button>
								</form>
							</>
						) : (
							<div className="animate-fade-in text-center">
								<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
									<Mail className="h-6 w-6 text-green-600" />
								</div>
								<h2 className="text-2xl font-bold tracking-tight text-center mb-4">
									Check your email
								</h2>
								<p className="text-muted-foreground mb-6">
									We've sent a password reset link to{" "}
									<span className="font-medium text-foreground">{email}</span>.
								</p>
								<p className="text-sm text-muted-foreground mb-6">
									The reset link will expire in 1 hour for security reasons.
								</p>
								<p className="text-sm text-muted-foreground mb-6">
									Didn't receive the email? Check your spam folder or{" "}
									<button
										onClick={handleResendEmail}
										className="text-primary hover:underline font-medium"
										disabled={isLoading}
									>
										{isLoading ? "Sending..." : "send again"}
									</button>
									.
								</p>
								<div className="space-y-3">
									<Button
										onClick={handleResendEmail}
										variant="outline"
										className="w-full"
										disabled={isLoading}
									>
										{isLoading ? (
											<div className="flex items-center gap-2">
												<div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-opacity-20 border-t-primary"></div>
												Resending...
											</div>
										) : (
											"Resend reset link"
										)}
									</Button>
									<Button asChild variant="outline" className="w-full">
										<Link to="/auth">Return to login</Link>
									</Button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Footer */}
			<footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
				<p>© 2025 Georgina Services Limited. All rights reserved.</p>
			</footer>
		</div>
	);
};

export default ForgotPassword;
