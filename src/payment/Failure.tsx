
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { X } from "lucide-react";

const Failure = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-red-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="rounded-full bg-shop-red/20 p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
          <X className="h-10 w-10 text-shop-red" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          We're sorry, but there was an issue processing your payment. Please try again.
        </p>

        <div className="bg-gray-50 rounded-md p-4 mb-6">
          <h3 className="font-medium text-gray-900 mb-2">Possible reasons:</h3>
          <ul className="text-sm text-gray-500 text-left list-disc pl-5">
            <li>Insufficient funds</li>
            <li>Card expired or invalid</li>
            <li>Payment declined by bank</li>
            <li>Network or connection issues</li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link to="/">
            <Button className="w-full bg-primary hover:bg-primary/90">
              Try Again
            </Button>
          </Link>
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Shop
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Failure;