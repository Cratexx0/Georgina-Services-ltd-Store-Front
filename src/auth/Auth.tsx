
import React from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AuthForm from "./AuthForm";

const Auth = () => {
  const navigate = useNavigate();
  
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
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-sm"></div>
      
      {/* Top Navigation */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="hover:bg-accent animate-fade-in"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2 animate-fade-in">
          <div className="text-foreground font-bold text-xl">ShopEase</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-muted-foreground text-sm animate-fade-in">
        <p>© 2025 ShopEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Auth;