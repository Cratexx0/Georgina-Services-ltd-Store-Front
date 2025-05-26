import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { Mail } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'inline' | 'centered' | 'footer';
  className?: string;
}

const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ 
  variant = 'inline', 
  className = '' 
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Thank you for subscribing to our newsletter!', {
        description: 'You\'ll receive updates about new products and special offers.'
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  if (variant === 'centered') {
    return (
      <div className={`relative rounded-lg overflow-hidden ${className}`}>
        {/* Background image with overlay */}
        <div className="absolute inset-0 bg-black/50 z-0" />
        <img 
          src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60" // Replace with your image path
          alt="Newsletter background"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        
        {/* Content */}
        <div className="relative z-10 text-center p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-white">Stay Updated</h3>
            <p className="text-gray-200 mb-6">
              Subscribe to our newsletter for the latest products and exclusive offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/90 backdrop-blur-sm"
              />
              <Button 
                type="submit" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={className}>
        <h4 className="text-lg font-semibold mb-4 text-white">Newsletter</h4>
        <p className="text-gray-300 mb-4">
          Get updates on new products and special offers.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
          />
          <Button 
            type="submit" 
            variant="outline"
            disabled={isSubmitting}
            className="bg-white text-gray-800 hover:bg-gray-100"
          >
            {isSubmitting ? '...' : 'Subscribe'}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <Input
        type="email"
        placeholder="Enter your email for updates"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Subscribing...' : 'Subscribe'}
      </Button>
    </form>
  );
};

export default NewsletterSignup;