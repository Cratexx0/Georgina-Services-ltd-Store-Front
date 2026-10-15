
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const HeroCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { categories } = useCategories();
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === categories.length - 1 ? 0 : prev + 1));
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? categories.length - 1 : prev - 1));
  };
  
  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentSlide(0);
  }, [categories.length]);

  if (categories.length === 0) return null;

  return (
    <div className="relative h-[60vh] overflow-hidden">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700",
            currentSlide === index ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
        >
          <div className="relative h-full w-full">
            <img 
              src={category.image} 
              alt={category.name} 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-slide-in">{category.name}</h1>
              <p className="text-xl mb-6 max-w-lg animate-slide-in animation-delay-200">{category.description}</p>
              <Link to={`/category/${category.slug}`}>
                <Button variant="default" size="lg" className="animate-slide-in animation-delay-300">
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ))}
      
      <button 
        onClick={prevSlide} 
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/40 transition-colors"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 hover:bg-white/40 transition-colors"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>
      
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2">
        {categories.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={cn(
              "w-3 h-3 rounded-full transition-colors",
              currentSlide === index ? "bg-white" : "bg-white/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
