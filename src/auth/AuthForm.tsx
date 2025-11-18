
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, LogIn, Mail, User, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ 
    email: '', 
    password: '', 
    fullName: '', 
    confirmpassword: '' 
  });
  const { toast } = useToast();
  const { login, register } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(loginData.email, loginData.password);
      toast({
        title: "Login successful",
        description: "Welcome back to our store!",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const fullName = `${registerData.fullName}`.trim();
      await register(fullName, registerData.email, registerData.password);
      toast({
        title: "Registration successful",
        description: "Your account has been created.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: `${provider} login initiated`,
        description: `Logging in with ${provider}...`,
      });
    }, 1000);
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
                className="mt-1"
              />
            </div>
            
            <div className="animate-fade-in delay-200">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password">Password</Label>
                <a href="/forgot/password" className="text-xs text-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <Input 
                id="login-password" 
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                required
                className="mt-1"
              />
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
          
          {/* Social Login Buttons */}
          <div className="relative animate-fade-in delay-400">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          {/* <div className="grid grid-cols-2 gap-3 animate-fade-in delay-500">
            <Button 
              variant="outline" 
              className="social-button"
              onClick={() => handleSocialLogin("Google")}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              className="social-button"
              onClick={() => handleSocialLogin("Facebook")}
              disabled={isLoading}
            >
              <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
              Facebook
            </Button>
          </div> */}
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
                <Label htmlFor="register-first-name">First name</Label>
                <Input 
                  id="register-first-name" 
                  type="text"
                  value={registerData.fullName}
                  onChange={(e) => setRegisterData({...registerData, fullName: e.target.value})}
                  required
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
                className="mt-1"
              />
            </div>
            
            <div className="animate-fade-in delay-300">
              <Label htmlFor="register-password">Password</Label>
              <Input 
                id="register-password" 
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                required
                className="mt-1"
              />
            </div>

              <div className="animate-fade-in delay-300">
              <Label htmlFor="register-password">Confirm Password</Label>
              <Input 
                id="confirm-password" 
                type="password"
                value={registerData.confirmpassword}
                onChange={(e) => setRegisterData({...registerData, confirmpassword: e.target.value})}
                required
                className="mt-1"
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
                  Creating account...
                </div>
              ) : (
                <>Create account</>
              )}
            </Button>
          </form>
          
          {/* Social Register Buttons */}
          <div className="relative animate-fade-in delay-500">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or register with
              </span>
            </div>
          </div>
          
          {/* <div className="grid grid-cols-2 gap-3 animate-fade-in delay-500">
            <Button 
              variant="outline" 
              className="social-button"
              onClick={() => handleSocialLogin("Google")}
              disabled={isLoading}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
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
              className="social-button"
              onClick={() => handleSocialLogin("Facebook")}
              disabled={isLoading}
            >
              <Facebook className="mr-2 h-4 w-4 text-[#1877F2]" />
              Facebook
            </Button>
          </div> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthForm;
