// import { useState } from "react";
// import { useNavigate, Navigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/context/AuthContext";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// const ChangePassword = () => {
//   const { isAuthenticated } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showCurrentPassword, setShowCurrentPassword] = useState(false);
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const { toast } = useToast();
//   const navigate = useNavigate();

//   if (!isAuthenticated) {
//     return <Navigate to="/auth" replace />;
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (formData.newPassword !== formData.confirmPassword) {
//       toast({
//         title: "Passwords don't match",
//         description: "New password and confirmation password must match.",
//         variant: "destructive"
//       });
//       return;
//     }

//     if (formData.newPassword.length < 6) {
//       toast({
//         title: "Password too short",
//         description: "Password must be at least 6 characters long.",
//         variant: "destructive"
//       });
//       return;
//     }

//     setIsLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 1500));
      
//       toast({
//         title: "Password changed successfully",
//         description: "Your password has been updated.",
//       });
      
//       navigate('/account');
//     } catch (error) {
//       toast({
//         title: "Failed to change password",
//         description: "Please check your current password and try again.",
//         variant: "destructive"
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div 
//       className="min-h-screen flex flex-col relative overflow-hidden"
//       style={{ 
//         backgroundImage: "url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070')", 
//         backgroundSize: "cover",
//         backgroundPosition: "center"
//       }}
//     >
//       {/* Overlay */}
//       <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70 backdrop-blur-sm"></div>
      
//       {/* Top Navigation */}
//       <div className="relative z-10 flex justify-between items-center p-6">
//         <Button
//           variant="ghost"
//           size="icon"
//           onClick={() => navigate("/account")}
//           className="hover:bg-accent animate-fade-in"
//         >
//           <ArrowLeft className="h-5 w-5" />
//         </Button>
        
//         <div className="flex items-center space-x-2 animate-fade-in">
//           <div className="text-foreground font-bold text-xl">ShopEase</div>
//         </div>
//       </div>
      
//       {/* Main Content */}
//       <div className="flex-grow flex items-center justify-center px-4 relative z-10">
//         <Card className="w-full max-w-md">
//           <CardHeader>
//             <CardTitle className="text-2xl flex items-center gap-2">
//               <Lock className="h-6 w-6" />
//               Change Password
//             </CardTitle>
//             <CardDescription>
//               Update your password to keep your account secure
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="current-password">Current Password</Label>
//                 <div className="relative">
//                   <Input 
//                     id="current-password" 
//                     type={showCurrentPassword ? "text" : "password"}
//                     value={formData.currentPassword}
//                     onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
//                     required
//                     className="pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowCurrentPassword(!showCurrentPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   >
//                     {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="new-password">New Password</Label>
//                 <div className="relative">
//                   <Input 
//                     id="new-password" 
//                     type={showNewPassword ? "text" : "password"}
//                     value={formData.newPassword}
//                     onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
//                     required
//                     className="pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowNewPassword(!showNewPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   >
//                     {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//                 <p className="text-xs text-muted-foreground">
//                   Must be at least 6 characters long
//                 </p>
//               </div>
              
//               <div className="space-y-2">
//                 <Label htmlFor="confirm-password">Confirm New Password</Label>
//                 <div className="relative">
//                   <Input 
//                     id="confirm-password" 
//                     type={showConfirmPassword ? "text" : "password"}
//                     value={formData.confirmPassword}
//                     onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
//                     required
//                     className="pr-10"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
//                   >
//                     {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                   </button>
//                 </div>
//               </div>
              
//               <Button 
//                 type="submit" 
//                 className="w-full"
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
//                     Updating password...
//                   </div>
//                 ) : (
//                   <>Change Password</>
//                 )}
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
      
//       {/* Footer */}
//       <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
//         <p>© 2025 ShopEase. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// };

// export default ChangePassword;
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { apiService } from "@/context/ApiService";


const ChangePassword = () => {
  const { isAuthenticated, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast({
        title: "Same password",
        description: "New password must be different from current password.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Call the API service to change password
      // Note: You'll need to add this method to your ApiService
      const response = await apiService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      if (response.success) {
        toast({
          title: "Password changed successfully",
          description: "Your password has been updated.",
        });
        
        // Clear form
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Navigate back to account page
        navigate('/account');
      } else {
        throw new Error(response.message || "Failed to change password");
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      
      let errorMessage = "Please check your current password and try again.";
      
      if (error.message?.includes('current password') || error.message?.includes('Current password')) {
        errorMessage = "Your current password is incorrect. Please try again.";
      } else if (error.message?.includes('network') || error.message?.includes('Network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Failed to change password",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Temporary implementation using reset password flow
  const handleSubmitWithResetFlow = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill in all password fields.",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirmation password must match.",
        variant: "destructive"
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Since changePassword endpoint might not exist, we can simulate it
      // or use the reset password flow with a token
      
      // Option 1: Simulate API call (remove this in production)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Option 2: If you have a change password endpoint, uncomment below:
      // const response = await apiService.changePassword({
      //   currentPassword: formData.currentPassword,
      //   newPassword: formData.newPassword
      // });
      
      toast({
        title: "Password changed successfully",
        description: "Your password has been updated.",
      });
      
      // Clear form
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      navigate('/account');
    } catch (error: any) {
      console.error('Password change error:', error);
      
      toast({
        title: "Failed to change password",
        description: "Please check your current password and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
      
      {/* Top Navigation */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/account")}
          className="hover:bg-accent animate-fade-in"
          disabled={isLoading}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2 animate-fade-in">
          <div className="text-foreground font-bold text-xl">ShopEase</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 relative z-10">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Lock className="h-6 w-6" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitWithResetFlow} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input 
                    id="current-password" 
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                    required
                    className="pr-10"
                    disabled={isLoading}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input 
                    id="new-password" 
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) => handleInputChange('newPassword', e.target.value)}
                    required
                    className="pr-10"
                    disabled={isLoading}
                    placeholder="Enter your new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Must be at least 6 characters long
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input 
                    id="confirm-password" 
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    required
                    className="pr-10"
                    disabled={isLoading}
                    placeholder="Confirm your new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-20 border-t-white"></div>
                    Updating password...
                  </div>
                ) : (
                  <>Change Password</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
        <p>© 2025 ShopEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ChangePassword;