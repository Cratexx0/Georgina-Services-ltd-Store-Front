import React from "react";
import { Link } from "react-router-dom";

const CATEGORIES = [
  {
    name: "Men",
    slug: "men",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=900&q=80",
    description: "Tailored looks and everyday essentials",
  },
  {
    name: "Women",
    slug: "women",
    image:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    description: "Dresses, prints, and modern classics",
  },
  {
    name: "Kids",
    slug: "kids",
    image:
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?auto=format&fit=crop&w=900&q=80",
    description: "Comfortable pieces they’ll love to wear",
  },
];

const CategoryShowcase: React.FC = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground mb-2">
            Shop by category
          </p>
          <h2 className="font-serif text-3xl md:text-4xl">Find your collection</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/category/clothes/${category.slug}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-lg"
            >
              <img
                src={category.image}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="font-serif text-3xl mb-1">{category.name}</h3>
                <p className="text-sm text-white/80 mb-3">{category.description}</p>
                <span className="text-xs uppercase tracking-[0.18em] border-b border-white/70 pb-0.5">
                  Shop now
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
