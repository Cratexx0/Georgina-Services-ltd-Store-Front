import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom"; // or use next/link if using Next.js

const ForgotPassword = () => {
    const [email, setEmail] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const { toast } = useToast();
const navigate =useNavigate();
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setEmailSent(true);
            toast({
                title: "Password reset email sent",
                description: "Check your inbox for further instructions.",
            });
            navigate('/forgot/password');
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
                        
                        {!emailSent ? (
                            <>
                                <div className="animate-fade-in">
                                    <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                        Forgot your password?
                                    </h2>
                                    <p className="text-sm text-muted-foreground text-center mb-6">
                                        Enter your email and we'll send you a link to reset your password.
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
                                    We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>.
                                </p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Didn't receive the email? Check your spam folder or <button 
                                        onClick={() => setEmailSent(false)}
                                        className="text-primary hover:underline"
                                    >
                                        try again
                                    </button>.
                                </p>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/auth">
                                        Return to login
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;