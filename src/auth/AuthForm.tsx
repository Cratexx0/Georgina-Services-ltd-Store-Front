import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogIn, UserPlus, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Separator } from "@/components/ui/separator";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showLoginPassword, setShowLoginPassword] = useState<boolean>(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    confirmpassword: '' 
  });
  const { toast } = useToast();
  const { login, register, loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();
  
  const requestOAuthToken = async (provider: 'google' | 'facebook') => {
    const presetToken =
      (window as any)?.ginaSocialToken?.[provider] ||
      (window as any)?.[`gina_${provider}_accessToken`];

    if (presetToken) return presetToken as string;

    const label =
      provider === 'google'
        ? 'Google idToken'
        : 'Facebook access token';

    const entered = window.prompt(`Paste the ${label}:`);
    return entered ?? '';
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    try {
      const token = await requestOAuthToken(provider);

      if (!token) {
        toast({
          title: "Login cancelled",
          description:
            provider === 'google'
              ? "No Google idToken provided."
              : "No Facebook access token provided.",
          variant: "destructive"
        });
        return;
      }

      const loginFn = provider === 'google' ? loginWithGoogle : loginWithFacebook;
      await loginFn(token);

      toast({
        title: "Login successful",
        description: `Signed in with ${provider === 'google' ? 'Google' : 'Facebook'}.`,
      });
      navigate('/', { replace: true });
    } catch (error: any) {
      toast({
        title: "Social login failed",
        description: error?.message || `Unable to sign in with ${provider}.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('🔐 [FORM] Starting login process for:', loginData.email);
      
      // Call the AuthContext login - this handles ALL the logic
      await login(loginData.email, loginData.password);
      
      console.log('🔐 [FORM] Login successful, showing toast and navigating');
      
      // Show success toast
      toast({
        title: "Login successful",
        description: "Welcome back to our store!",
      });
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('🔐 [FORM] Login error:', error);
      
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (registerData.password !== registerData.confirmpassword) {
      toast({
        title: "Registration failed",
        description: "Passwords do not match.",
        variant: "destructive"
      });
      return;
    }

    // Validate password strength
    if (registerData.password.length < 6) {
      toast({
        title: "Registration failed",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('👤 [FORM] Starting registration for:', registerData.email);
      
      const fullName = registerData.fullName.trim();
      
      // Call the AuthContext register - this handles login automatically
      await register(fullName, registerData.email, registerData.password);
      
      console.log('👤 [FORM] Registration successful, showing toast and navigating');
      
      // Show success toast
      toast({
        title: "Registration successful",
        description: "Your account has been created. Welcome!",
      });
      
      // Navigate to home page
      navigate('/', { replace: true });
      
    } catch (error: any) {
      console.error('👤 [FORM] Registration error:', error);
      
      toast({
        title: "Registration failed",
        description: error.message || "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // if (!loginData.email) {
    //   toast({
    //     title: "Email required",
    //     description: "Please enter your email address to reset password.",
    //     variant: "destructive"
    //   });
    //   return;
    // }
        navigate("/forgot/password")

    // setIsLoading(true);
    // try {
    //   // You'll need to implement this in your AuthContext
    //   // await forgotPassword(loginData.email);
      
    //   toast({
    //     title: "Reset email sent",
    //     description: "Check your email for password reset instructions.",
    //   });
    // } catch (error: any) {
    //   toast({
    //     title: "Reset failed",
    //     description: error.message || "Failed to send reset instructions.",
    //     variant: "destructive"
    //   });
    // } finally {
    //   setIsLoading(false);
    // }
  };
  
  return (
    <div className="w-full max-w-md mx-auto bg-card border border-border rounded-xl shadow-2xl p-8 md:p-10">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="login" className="flex items-center gap-2">
            <LogIn className="h-4 w-4" /> Login
          </TabsTrigger>
          <TabsTrigger value="register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" /> Register
          </TabsTrigger>
        </TabsList>
        
        {/* Login Form */}
        <TabsContent value="login" className="space-y-4">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
              Welcome back
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your credentials to access your account
            </p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="animate-fade-in delay-100">
              <Label htmlFor="login-email">Email</Label>
              <Input 
                id="login-email" 
                type="email" 
                placeholder="name@example.com"
                value={loginData.email}
                onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            
            <div className="animate-fade-in delay-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative mt-1">
                <Input 
                  id="login-password" 
                  type={showLoginPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showLoginPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full animate-fade-in delay-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                  Logging in...
                </div>
              ) : (
                <>Sign in</>
              )}
            </Button>
          </form>
          
          <div className="relative my-6 animate-fade-in delay-400">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 animate-fade-in delay-500">
            <Button 
              variant="outline" 
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialLogin('google')}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </TabsContent>
        
        {/* Register Form */}
        <TabsContent value="register" className="space-y-4">
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-4">
              Create an account
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Enter your details below to create your account
            </p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="animate-fade-in delay-100">
              <Label htmlFor="register-full-name">Full name</Label>
              <Input 
                id="register-full-name" 
                type="text"
                placeholder="John Doe"
                value={registerData.fullName}
                onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            
            <div className="animate-fade-in delay-200">
              <Label htmlFor="register-email">Email</Label>
              <Input 
                id="register-email" 
                type="email" 
                placeholder="name@example.com"
                value={registerData.email}
                onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                required
                disabled={isLoading}
                className="mt-1"
              />
            </div>
            
            <div className="animate-fade-in delay-300">
              <Label htmlFor="register-password">Password</Label>
              <div className="relative mt-1">
                <Input 
                  id="register-password" 
                  type={showRegisterPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showRegisterPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="animate-fade-in delay-400">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative mt-1">
                <Input 
                  id="confirm-password" 
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={registerData.confirmpassword}
                  onChange={(e) => setRegisterData({...registerData, confirmpassword: e.target.value})}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full animate-fade-in delay-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                  Creating account...
                </div>
              ) : (
                <>Create account</>
              )}
            </Button>
          </form>
          
          <div className="relative my-6 animate-fade-in delay-600">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 animate-fade-in delay-700">
            <Button 
              variant="outline" 
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialLogin('google')}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              type="button"
              disabled={isLoading}
              onClick={() => handleSocialLogin('facebook')}
              className="flex items-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="#1877F2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;