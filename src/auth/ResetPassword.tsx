import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams } from "react-router-dom"; // or use next/navigation for Next.js

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    // Get token from URL query parameters
    const token = searchParams.get("token");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords don't match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 8) {
            toast({
                title: "Error",
                description: "Password must be at least 8 characters",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        // Simulate API call to reset password
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            toast({
                title: "Password reset successful",
                description: "You can now login with your new password",
            });
        }, 1500);
    };

    return (
        <div
            className="min-h-screen flex flex-col relative overflow-hidden"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
            <div className="flex-grow flex items-center justify-center px-4 relative z-10">
                <div className="w-full max-w-md">
                    <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg">
                        <div className="mb-6">
                            <Link to="/auth" className="flex items-center text-sm text-muted-foreground hover:text-primary">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to login
                            </Link>
                        </div>

                        {isSuccess ? (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                    Password Updated!
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Your password has been successfully reset.
                                </p>
                                <Button asChild className="w-full">
                                    <Link to="/auth">
                                        Return to Login
                                    </Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                        Reset Your Password
                                    </h2>
                                    <p className="text-sm text-muted-foreground text-center mb-6">
                                        Enter your new password below
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="animate-fade-in delay-200">
                                        <Label htmlFor="password">New Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            minLength={8}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="mt-1 py-4"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            Must be at least 8 characters
                                        </p>
                                    </div>
                                    
                                    <div className="animate-fade-in delay-300">
                                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="mt-1 py-4"
                                        />
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        className="w-full animate-fade-in delay-400"
                                        disabled={isLoading || !token}
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                                                Updating password...
                                            </div>
                                        ) : (
                                            <>
                                                <Lock className="mr-2 h-4 w-4" />
                                                Reset Password
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;