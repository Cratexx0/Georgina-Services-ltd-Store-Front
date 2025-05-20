
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const Success = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-green-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="rounded-full bg-shop-green/20 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <Check className="h-10 w-10 text-shop-green" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been processed successfully.
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
          <p className="text-sm text-gray-500 mb-1">Order #: {Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
          <p className="text-sm text-gray-500">Date: {new Date().toLocaleDateString()}</p>
        </div>
        
        <Link to="/">
          <Button className="w-full">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
};

export default Success;