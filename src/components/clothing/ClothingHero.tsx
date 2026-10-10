import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ClothingHero: React.FC = () => {
  return (
    <section className="relative min-h-[70vh] md:min-h-[78vh] overflow-hidden bg-stone-900 text-white">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=80"
        alt="Fashion editorial featuring a model in contemporary clothing"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
      <div className="relative container mx-auto px-4 min-h-[70vh] md:min-h-[78vh] flex items-center">
        <div className="max-w-xl py-16">
          <p className="text-xs md:text-sm uppercase tracking-[0.28em] text-white/80 mb-4">
            The new season
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl leading-tight mb-4">
            Discover Your Style
          </h1>
          <p className="text-base md:text-lg text-white/85 mb-8 max-w-md">
            Premium fashion for every occasion. Curated clothing for men, women, and kids.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-white text-stone-900 hover:bg-stone-100">
              <Link to="/category/clothes/men">Shop Men</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Link to="/category/clothes/women">Shop Women</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClothingHero;
