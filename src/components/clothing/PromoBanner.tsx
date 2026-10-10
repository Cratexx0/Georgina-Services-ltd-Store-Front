import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PromoBanner: React.FC = () => {
  return (
    <section className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl min-h-[240px] md:min-h-[320px] bg-stone-900 text-white">
          <img
            src="https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80"
            alt="Seasonal clothing collection"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
          <div className="relative z-10 flex h-full min-h-[240px] md:min-h-[320px] flex-col items-start justify-center p-8 md:p-14 max-w-lg">
            <p className="text-xs uppercase tracking-[0.24em] mb-3">Limited pieces</p>
            <h2 className="font-serif text-3xl md:text-4xl mb-3">New season, new silhouettes</h2>
            <p className="text-sm md:text-base text-white/85 mb-6">
              Explore our latest arrivals before they go. Fresh cuts, prints, and everyday staples.
            </p>
            <Button asChild className="bg-white text-stone-900 hover:bg-stone-100">
              <Link to="/category/clothes">Shop the collection</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
