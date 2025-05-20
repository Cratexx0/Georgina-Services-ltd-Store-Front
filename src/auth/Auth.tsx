
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
        backgroundImage: "url('https://images.unsplash.com/photo-1607082350899-7e105aa886ae?auto=format&fit=crop&q=80&w=2070')", 
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 backdrop-blur-sm"></div>
      
      {/* Top Navigation */}
      <div className="relative z-10 flex justify-between items-center p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="text-white hover:bg-white/10 animate-fade-in"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2 animate-fade-in">
          <div className="text-white font-bold text-xl">ShopEase</div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md">
          <AuthForm />
        </div>
      </div>
      
      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-white/80 text-sm animate-fade-in">
        <p>© 2025 ShopEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Auth;