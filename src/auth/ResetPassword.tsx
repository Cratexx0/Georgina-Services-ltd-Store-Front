// // import { useState } from "react";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Lock, CheckCircle, ArrowLeft } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";
// // import { Link, useSearchParams } from "react-router-dom"; // or use next/navigation for Next.js

// // const ResetPassword = () => {
// //     const [password, setPassword] = useState("");
// //     const [confirmPassword, setConfirmPassword] = useState("");
// //     const [isLoading, setIsLoading] = useState(false);
// //     const [isSuccess, setIsSuccess] = useState(false);
// //     const [searchParams] = useSearchParams();
// //     const { toast } = useToast();

// //     // Get token from URL query parameters
// //     const token = searchParams.get("token");

// //     const handleSubmit = (e: React.FormEvent) => {
// //         e.preventDefault();
        
// //         if (password !== confirmPassword) {
// //             toast({
// //                 title: "Error",
// //                 description: "Passwords don't match",
// //                 variant: "destructive",
// //             });
// //             return;
// //         }

// //         if (password.length < 8) {
// //             toast({
// //                 title: "Error",
// //                 description: "Password must be at least 8 characters",
// //                 variant: "destructive",
// //             });
// //             return;
// //         }

// //         setIsLoading(true);

// //         // Simulate API call to reset password
// //         setTimeout(() => {
// //             setIsLoading(false);
// //             setIsSuccess(true);
// //             toast({
// //                 title: "Password reset successful",
// //                 description: "You can now login with your new password",
// //             });
// //         }, 1500);
// //     };

// //     return (
// //         <div
// //             className="min-h-screen flex flex-col relative overflow-hidden"
// //             style={{
// //                 backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
// //                 backgroundSize: "cover",
// //                 backgroundPosition: "center"
// //             }}
// //         >
// //             {/* Overlay */}
// //             <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
// //             <div className="flex-grow flex items-center justify-center px-4 relative z-10">
// //                 <div className="w-full max-w-md">
// //                     <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg">
// //                         <div className="mb-6">
// //                             <Link to="/auth" className="flex items-center text-sm text-muted-foreground hover:text-primary">
// //                                 <ArrowLeft className="mr-2 h-4 w-4" />
// //                                 Back to login
// //                             </Link>
// //                         </div>

// //                         {isSuccess ? (
// //                             <div className="animate-fade-in text-center">
// //                                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
// //                                     <CheckCircle className="h-6 w-6 text-green-600" />
// //                                 </div>
// //                                 <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
// //                                     Password Updated!
// //                                 </h2>
// //                                 <p className="text-muted-foreground mb-6">
// //                                     Your password has been successfully reset.
// //                                 </p>
// //                                 <Button asChild className="w-full">
// //                                     <Link to="/auth">
// //                                         Return to Login
// //                                     </Link>
// //                                 </Button>
// //                             </div>
// //                         ) : (
// //                             <>
// //                                 <div className="animate-fade-in">
// //                                     <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
// //                                         Reset Your Password
// //                                     </h2>
// //                                     <p className="text-sm text-muted-foreground text-center mb-6">
// //                                         Enter your new password below
// //                                     </p>
// //                                 </div>

// //                                 <form onSubmit={handleSubmit} className="space-y-4">
// //                                     <div className="animate-fade-in delay-200">
// //                                         <Label htmlFor="password">New Password</Label>
// //                                         <Input
// //                                             id="password"
// //                                             type="password"
// //                                             placeholder="••••••••"
// //                                             required
// //                                             minLength={8}
// //                                             value={password}
// //                                             onChange={(e) => setPassword(e.target.value)}
// //                                             className="mt-1 py-4"
// //                                         />
// //                                         <p className="text-xs text-muted-foreground mt-2">
// //                                             Must be at least 8 characters
// //                                         </p>
// //                                     </div>
                                    
// //                                     <div className="animate-fade-in delay-300">
// //                                         <Label htmlFor="confirmPassword">Confirm Password</Label>
// //                                         <Input
// //                                             id="confirmPassword"
// //                                             type="password"
// //                                             placeholder="••••••••"
// //                                             required
// //                                             value={confirmPassword}
// //                                             onChange={(e) => setConfirmPassword(e.target.value)}
// //                                             className="mt-1 py-4"
// //                                         />
// //                                     </div>
                                    
// //                                     <Button
// //                                         type="submit"
// //                                         className="w-full animate-fade-in delay-400"
// //                                         disabled={isLoading || !token}
// //                                     >
// //                                         {isLoading ? (
// //                                             <div className="flex items-center gap-2">
// //                                                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
// //                                                 Updating password...
// //                                             </div>
// //                                         ) : (
// //                                             <>
// //                                                 <Lock className="mr-2 h-4 w-4" />
// //                                                 Reset Password
// //                                             </>
// //                                         )}
// //                                     </Button>
// //                                 </form>
// //                             </>
// //                         )}
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default ResetPassword;


// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { Link, useSearchParams, useNavigate } from "react-router-dom";
// import { apiService } from "@/context/ApiService";


// const ResetPassword = () => {
//     const [password, setPassword] = useState("");
//     const [confirmPassword, setConfirmPassword] = useState("");
//     const [isLoading, setIsLoading] = useState(false);
//     const [isSuccess, setIsSuccess] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//     const [tokenValid, setTokenValid] = useState<boolean | null>(null);
//     const [searchParams] = useSearchParams();
//     const { toast } = useToast();
//     const navigate = useNavigate();

//     // Get token from URL query parameters
//     const token = searchParams.get("token");

//     // Validate token on component mount
//     useEffect(() => {
//         if (!token) {
//             setTokenValid(false);
//             toast({
//                 title: "Invalid reset link",
//                 description: "The password reset link is invalid or has expired.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         // You might want to validate the token with your backend
//         // For now, we'll assume token is valid if it exists
//         setTokenValid(true);
//     }, [token, toast]);

//     const handleSubmit = async (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (!token) {
//             toast({
//                 title: "Invalid reset link",
//                 description: "The password reset link is invalid or has expired.",
//                 variant: "destructive",
//             });
//             return;
//         }

//         if (password !== confirmPassword) {
//             toast({
//                 title: "Error",
//                 description: "Passwords don't match",
//                 variant: "destructive",
//             });
//             return;
//         }

//         if (password.length < 6) {
//             toast({
//                 title: "Error",
//                 description: "Password must be at least 6 characters",
//                 variant: "destructive",
//             });
//             return;
//         }

//         setIsLoading(true);

//         try {
//             // Use the ApiService to reset password
//             const response = await apiService.resetPassword(token, password);
            
//             console.log('🔐 Reset password response:', response);

//             if (response.success) {
//                 setIsSuccess(true);
//                 toast({
//                     title: "Password reset successful",
//                     description: response.message || "You can now login with your new password",
//                 });
                
//                 // Auto-redirect to login after 3 seconds
//                 setTimeout(() => {
//                     navigate('/auth');
//                 }, 3000);
//             } else {
//                 throw new Error(response.message || "Failed to reset password");
//             }
//         } catch (error: any) {
//             console.error('🔐 Reset password error:', error);
            
//             let errorMessage = "Failed to reset password. Please try again.";
            
//             // Handle specific error cases
//             if (error.message?.includes('token') || error.message?.includes('expired')) {
//                 errorMessage = "The reset link has expired. Please request a new one.";
//                 setTokenValid(false);
//             } else if (error.message?.includes('invalid') || error.message?.includes('Invalid')) {
//                 errorMessage = "The reset link is invalid. Please request a new one.";
//                 setTokenValid(false);
//             } else if (error.message?.includes('network') || error.message?.includes('Network')) {
//                 errorMessage = "Network error. Please check your connection and try again.";
//             } else if (error.message) {
//                 errorMessage = error.message;
//             }
            
//             toast({
//                 title: "Password reset failed",
//                 description: errorMessage,
//                 variant: "destructive",
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     const handleRequestNewLink = () => {
//         navigate('/forgot-password');
//     };

//     if (!token) {
//         return (
//             <div className="min-h-screen flex flex-col relative overflow-hidden"
//                 style={{
//                     backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center"
//                 }}
//             >
//                 <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
//                 <div className="flex-grow flex items-center justify-center px-4 relative z-10">
//                     <div className="w-full max-w-md">
//                         <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg text-center">
//                             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
//                                 <Lock className="h-6 w-6 text-red-600" />
//                             </div>
//                             <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
//                                 Invalid Reset Link
//                             </h2>
//                             <p className="text-muted-foreground mb-6">
//                                 The password reset link is missing or invalid.
//                             </p>
//                             <div className="space-y-3">
//                                 <Button onClick={handleRequestNewLink} className="w-full">
//                                     Request New Reset Link
//                                 </Button>
//                                 <Button asChild variant="outline" className="w-full">
//                                     <Link to="/auth">
//                                         Return to Login
//                                     </Link>
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (tokenValid === false) {
//         return (
//             <div className="min-h-screen flex flex-col relative overflow-hidden"
//                 style={{
//                     backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
//                     backgroundSize: "cover",
//                     backgroundPosition: "center"
//                 }}
//             >
//                 <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
//                 <div className="flex-grow flex items-center justify-center px-4 relative z-10">
//                     <div className="w-full max-w-md">
//                         <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg text-center">
//                             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
//                                 <Lock className="h-6 w-6 text-orange-600" />
//                             </div>
//                             <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
//                                 Link Expired
//                             </h2>
//                             <p className="text-muted-foreground mb-6">
//                                 This password reset link has expired or is no longer valid.
//                             </p>
//                             <div className="space-y-3">
//                                 <Button onClick={handleRequestNewLink} className="w-full">
//                                     Get New Reset Link
//                                 </Button>
//                                 <Button asChild variant="outline" className="w-full">
//                                     <Link to="/auth">
//                                         Return to Login
//                                     </Link>
//                                 </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div
//             className="min-h-screen flex flex-col relative overflow-hidden"
//             style={{
//                 backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
//                 backgroundSize: "cover",
//                 backgroundPosition: "center"
//             }}
//         >
//             {/* Overlay */}
//             <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
            
//             {/* Top Navigation */}
//             <div className="relative z-10 p-6">
//                 <Button
//                     variant="ghost"
//                     onClick={() => navigate("/auth")}
//                     className="hover:bg-accent animate-fade-in"
//                     disabled={isLoading}
//                 >
//                     <ArrowLeft className="mr-2 h-4 w-4" />
//                     Back to login
//                 </Button>
//             </div>

//             <div className="flex-grow flex items-center justify-center px-4 relative z-10">
//                 <div className="w-full max-w-md">
//                     <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg">
//                         {isSuccess ? (
//                             <div className="animate-fade-in text-center">
//                                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
//                                     <CheckCircle className="h-6 w-6 text-green-600" />
//                                 </div>
//                                 <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
//                                     Password Updated!
//                                 </h2>
//                                 <p className="text-muted-foreground mb-6">
//                                     Your password has been successfully reset.
//                                 </p>
//                                 <p className="text-sm text-muted-foreground mb-6">
//                                     Redirecting you to login page...
//                                 </p>
//                                 <Button asChild className="w-full">
//                                     <Link to="/auth">
//                                         Return to Login Now
//                                     </Link>
//                                 </Button>
//                             </div>
//                         ) : (
//                             <>
//                                 <div className="animate-fade-in">
//                                     <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
//                                         Reset Your Password
//                                     </h2>
//                                     <p className="text-sm text-muted-foreground text-center mb-6">
//                                         Enter your new password below
//                                     </p>
//                                 </div>

//                                 <form onSubmit={handleSubmit} className="space-y-4">
//                                     <div className="animate-fade-in delay-200">
//                                         <Label htmlFor="password">New Password</Label>
//                                         <div className="relative">
//                                             <Input
//                                                 id="password"
//                                                 type={showPassword ? "text" : "password"}
//                                                 placeholder="••••••••"
//                                                 required
//                                                 minLength={6}
//                                                 value={password}
//                                                 onChange={(e) => setPassword(e.target.value)}
//                                                 className="mt-1 py-4 pr-10"
//                                                 disabled={isLoading}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowPassword(!showPassword)}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                                                 disabled={isLoading}
//                                             >
//                                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                             </button>
//                                         </div>
//                                         <p className="text-xs text-muted-foreground mt-2">
//                                             Must be at least 6 characters
//                                         </p>
//                                     </div>
                                    
//                                     <div className="animate-fade-in delay-300">
//                                         <Label htmlFor="confirmPassword">Confirm Password</Label>
//                                         <div className="relative">
//                                             <Input
//                                                 id="confirmPassword"
//                                                 type={showConfirmPassword ? "text" : "password"}
//                                                 placeholder="••••••••"
//                                                 required
//                                                 value={confirmPassword}
//                                                 onChange={(e) => setConfirmPassword(e.target.value)}
//                                                 className="mt-1 py-4 pr-10"
//                                                 disabled={isLoading}
//                                             />
//                                             <button
//                                                 type="button"
//                                                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                                                 disabled={isLoading}
//                                             >
//                                                 {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                                             </button>
//                                         </div>
//                                     </div>
                                    
//                                     <Button
//                                         type="submit"
//                                         className="w-full animate-fade-in delay-400"
//                                         disabled={isLoading || !tokenValid}
//                                     >
//                                         {isLoading ? (
//                                             <div className="flex items-center gap-2">
//                                                 <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
//                                                 Updating password...
//                                             </div>
//                                         ) : (
//                                             <>
//                                                 <Lock className="mr-2 h-4 w-4" />
//                                                 Reset Password
//                                             </>
//                                         )}
//                                     </Button>
//                                 </form>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
//                 <p>© 2025 ShopEase. All rights reserved.</p>
//             </footer>
//         </div>
//     );
// };

// export default ResetPassword;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle, ArrowLeft, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { apiService } from "@/context/ApiService";

const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isValidatingToken, setIsValidatingToken] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [tokenValid, setTokenValid] = useState<boolean | null>(null);
    const [tokenData, setTokenData] = useState<any>(null);
    const [searchParams] = useSearchParams();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Get token from URL query parameters
    const token = searchParams.get("token");

    // Validate token on component mount
    useEffect(() => {
        const validateResetToken = async () => {
            if (!token) {
                setTokenValid(false);
                setIsValidatingToken(false);
                toast({
                    title: "Invalid reset link",
                    description: "The password reset link is missing.",
                    variant: "destructive",
                });
                return;
            }

            try {
                setIsValidatingToken(true);
                console.log('🔐 Validating reset token:', token.substring(0, 20) + '...');
                
                // Store the token temporarily for validation
                const originalToken = localStorage.getItem('token');
                localStorage.setItem('token', token);
                
                try {
                    // Use the ApiService verifyToken method
                    const response = await apiService.verifyToken();
                    
                    console.log('🔐 Token validation response:', response);
                    
                    if (response.success) {
                        setTokenValid(true);
                        setTokenData(response.data);
                        toast({
                            title: "Valid reset link",
                            description: "You can now set your new password.",
                        });
                    } else {
                        setTokenValid(false);
                        toast({
                            title: "Invalid reset link",
                            description: "The password reset link is invalid or has expired.",
                            variant: "destructive",
                        });
                    }
                } finally {
                    // Restore original token or remove the reset token
                    if (originalToken) {
                        localStorage.setItem('token', originalToken);
                    } else {
                        localStorage.removeItem('token');
                    }
                }
            } catch (error) {
                console.error('🔐 Token validation error:', error);
                setTokenValid(false);
                
                let errorMessage = "Failed to validate reset link. Please try again.";
                
                if (error instanceof Error) {
                    if (error.message.includes('401') || error.message.includes('Token invalid')) {
                        errorMessage = "The reset link has expired or is invalid. Please request a new one.";
                    } else if (error.message.includes('network')) {
                        errorMessage = "Network error. Please check your connection and try again.";
                    }
                }
                
                toast({
                    title: "Error",
                    description: errorMessage,
                    variant: "destructive",
                });
            } finally {
                setIsValidatingToken(false);
            }
        };

        validateResetToken();
    }, [token, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token) {
            toast({
                title: "Invalid reset link",
                description: "The password reset link is missing.",
                variant: "destructive",
            });
            return;
        }

        if (!tokenValid) {
            toast({
                title: "Invalid reset link",
                description: "The reset link is no longer valid. Please request a new one.",
                variant: "destructive",
            });
            return;
        }

        // Validation
        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords don't match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return;
        }

        // Additional password strength validation
        if (!/(?=.*[a-zA-Z])/.test(password)) {
            toast({
                title: "Error",
                description: "Password must contain at least one letter",
                variant: "destructive",
            });
            return;
        }

        if (!/(?=.*\d)/.test(password)) {
            toast({
                title: "Error",
                description: "Password must contain at least one number",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            console.log('🔐 Attempting to reset password with token:', token.substring(0, 20) + '...');
            
            const response = await apiService.resetPassword(token, password);
            
            console.log('🔐 Reset password response:', response);

            if (response.success) {
                setIsSuccess(true);
                toast({
                    title: "Password reset successful",
                    description: response.message || "You can now login with your new password",
                });
                
                // Clear any stored tokens
                localStorage.removeItem('token');
                sessionStorage.removeItem('token');
                
                // Auto-redirect to login after 3 seconds
                setTimeout(() => {
                    navigate('/auth');
                }, 3000);
            } else {
                throw new Error(response.message || "Failed to reset password");
            }
        } catch (error: any) {
            console.error('🔐 Reset password error:', error);
            
            let errorMessage = "Failed to reset password. Please try again.";
            
            // Handle specific error cases
            if (error.message?.includes('token') || error.message?.includes('expired') || 
                error.message?.includes('invalid') || error.message?.includes('Invalid')) {
                errorMessage = "The reset link has expired or is invalid. Please request a new one.";
                setTokenValid(false);
            } else if (error.message?.includes('network') || error.message?.includes('Network')) {
                errorMessage = "Network error. Please check your connection and try again.";
            } else if (error.message?.includes('400') || error.message?.includes('Bad Request')) {
                errorMessage = "Invalid password. Please try a different one.";
            } else if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
                errorMessage = "Unauthorized. Please request a new reset link.";
                setTokenValid(false);
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast({
                title: "Password reset failed",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestNewLink = () => {
        // Clear any stored tokens
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        navigate('/forgot-password');
    };

    // Loading state while validating token
    if (isValidatingToken) {
        return (
            <div className="min-h-screen flex flex-col relative overflow-hidden"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
                <div className="flex-grow flex items-center justify-center px-4 relative z-10">
                    <div className="w-full max-w-md">
                        <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                Verifying Reset Link
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                Please wait while we verify your reset link...
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                                <div className="bg-blue-600 h-1.5 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                This may take a few moments
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // No token state
    if (!token) {
        return (
            <div className="min-h-screen flex flex-col relative overflow-hidden"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
                <div className="flex-grow flex items-center justify-center px-4 relative z-10">
                    <div className="w-full max-w-md">
                        <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                                <AlertCircle className="h-6 w-6 text-red-600" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                Missing Reset Link
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                The password reset link is missing from the URL.
                                Please check your email for the complete link.
                            </p>
                            <div className="space-y-3">
                                <Button onClick={handleRequestNewLink} className="w-full">
                                    Request New Reset Link
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/auth">
                                        Return to Login
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Invalid token state
    if (tokenValid === false) {
        return (
            <div className="min-h-screen flex flex-col relative overflow-hidden"
                style={{
                    backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
                <div className="flex-grow flex items-center justify-center px-4 relative z-10">
                    <div className="w-full max-w-md">
                        <div className="w-full max-w-md mx-auto bg-background/90 rounded-lg p-8 md:p-10 shadow-lg text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
                                <AlertCircle className="h-6 w-6 text-orange-600" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                Link Expired or Invalid
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                This password reset link has expired or is no longer valid.
                                Password reset links are only valid for a limited time.
                            </p>
                            <div className="space-y-3">
                                <Button onClick={handleRequestNewLink} className="w-full">
                                    Get New Reset Link
                                </Button>
                                <Button asChild variant="outline" className="w-full">
                                    <Link to="/auth">
                                        Return to Login
                                    </Link>
                                </Button>
                            </div>
                            <div className="mt-6 pt-6 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    If you continue to experience issues, please contact support.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
            
            {/* Top Navigation */}
            <div className="relative z-10 p-6">
                <Button
                    variant="ghost"
                    onClick={() => {
                        // Clear any stored tokens
                        localStorage.removeItem('token');
                        sessionStorage.removeItem('token');
                        navigate("/auth");
                    }}
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
                        {isSuccess ? (
                            <div className="animate-fade-in text-center">
                                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
                                    <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
                                    Password Updated!
                                </h2>
                                <p className="text-muted-foreground mb-6">
                                    Your password has been successfully reset. You can now login with your new password.
                                </p>
                                <p className="text-sm text-muted-foreground mb-6">
                                    Redirecting you to login page in 3 seconds...
                                </p>
                                <div className="space-y-3">
                                    <Button asChild className="w-full">
                                        <Link to="/auth">
                                            Return to Login Now
                                        </Link>
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        className="w-full"
                                        onClick={() => {
                                            localStorage.removeItem('token');
                                            sessionStorage.removeItem('token');
                                            navigate('/auth');
                                        }}
                                    >
                                        Go to Login
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="animate-fade-in text-center mb-6">
                                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 mb-4">
                                        <Lock className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold tracking-tight text-center mb-2">
                                        Set New Password
                                    </h2>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Enter your new password below. Make sure it's strong and secure.
                                    </p>
                                    {tokenData?.user && (
                                        <p className="text-sm text-blue-600 font-medium">
                                            Reset password for: {tokenData.user.email}
                                        </p>
                                    )}
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="animate-fade-in delay-200">
                                        <Label htmlFor="password" className="flex items-center gap-2">
                                            New Password
                                            {password.length >= 6 && /(?=.*[a-zA-Z])/.test(password) && /(?=.*\d)/.test(password) && (
                                                <span className="text-xs text-green-600 font-normal">
                                                    ✓ Strong
                                                </span>
                                            )}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter new password"
                                                required
                                                minLength={6}
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="mt-1 py-4 pr-10"
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isLoading}
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-2 space-y-1">
                                            <p>Password must contain:</p>
                                            <ul className="list-disc list-inside ml-2">
                                                <li className={password.length >= 6 ? "text-green-600" : ""}>
                                                    At least 6 characters
                                                </li>
                                                <li className={/(?=.*[a-zA-Z])/.test(password) ? "text-green-600" : ""}>
                                                    At least one letter
                                                </li>
                                                <li className={/(?=.*\d)/.test(password) ? "text-green-600" : ""}>
                                                    At least one number
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="animate-fade-in delay-300">
                                        <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                                            Confirm Password
                                            {password === confirmPassword && confirmPassword.length > 0 && (
                                                <span className="text-xs text-green-600 font-normal">
                                                    ✓ Passwords match
                                                </span>
                                            )}
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? "text" : "password"}
                                                placeholder="Confirm your new password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="mt-1 py-4 pr-10"
                                                disabled={isLoading}
                                                autoComplete="new-password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                                                disabled={isLoading}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {password !== confirmPassword && confirmPassword.length > 0 && (
                                            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                <AlertCircle className="h-3 w-3" />
                                                Passwords do not match
                                            </p>
                                        )}
                                    </div>
                                    
                                    <Button
                                        type="submit"
                                        className="w-full animate-fade-in delay-400 mt-6"
                                        disabled={isLoading || !tokenValid || password.length < 6 || password !== confirmPassword}
                                        size="lg"
                                    >
                                        {isLoading ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
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

                                <div className="mt-6 pt-6 border-t border-border animate-fade-in delay-500">
                                    <p className="text-sm text-muted-foreground text-center">
                                        Having trouble?{" "}
                                        <button
                                            onClick={handleRequestNewLink}
                                            className="text-primary hover:underline font-medium"
                                            disabled={isLoading}
                                        >
                                            Request a new reset link
                                        </button>
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
                <p>© 2025 ShopEase. All rights reserved.</p>
                <p className="text-xs mt-1">Secure password reset</p>
            </footer>
        </div>
    );
};

export default ResetPassword;