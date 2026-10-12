

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { ArrowUpRight } from "lucide-react";

// type Category = {
//   name: string;
//   slug: string;
//   image: string;
//   tagline: string;
//   description: string;
//   fallback: string; // gradient shown if the image fails to load
// };

// /**
//  * Put your Ankara photos in /public/images/categories/
//  * Recommended: portrait, at least 900x1200px, .jpg or .webp
//  *
//  * Free sources with real African print fashion photography:
//  *  - pexels.com  -> search "ankara fashion", "african print dress"
//  *  - unsplash.com -> search "ankara", "african print"
//  */
// const CATEGORIES: Category[] = [
//   {
//     name: "Men",
//     slug: "men",
//     image: "https://images.unsplash.com/photo-1615406092627-acf479f2bbc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//     tagline: "Bold & tailored",
//     description: "Ankara shirts, kaftans and two-piece sets made to stand out",
//     fallback: "from-amber-700 via-orange-600 to-yellow-500",
//   },
//   {
//     name: "Women",
//     slug: "women",
//     image: "https://plus.unsplash.com/premium_photo-1769339044563-7e77ab4c90a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//     tagline: "Vibrant & elegant",
//     description: "Ankara dresses, jumpsuits and statement pieces in rich prints",
//     fallback: "from-fuchsia-700 via-rose-600 to-orange-500",
//   },
//   {
//     name: "Kids",
//     slug: "kids",
//     image: "https://images.unsplash.com/photo-1744972974362-f517dff40f56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
//     tagline: "Playful & comfy",
//     description: "Colourful Ankara outfits little ones will love to wear",
//     fallback: "from-emerald-700 via-teal-600 to-lime-500",
//   },
// ];

// const CategoryCard: React.FC<{ category: Category; index: number }> = ({
//   category,
//   index,
// }) => {
//   const [imgFailed, setImgFailed] = useState(false);
//   const [loaded, setLoaded] = useState(false);

//   return (
//     <Link
//       to={`/category/clothes/${category.slug}`}
//       aria-label={`Shop ${category.name} collection`}
//       className={`group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${category.fallback} shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
//         index === 1 ? "lg:mt-10" : ""
//       }`}
//     >
//       {!imgFailed && (
//         <img
//           src={category.image}
//           alt={`${category.name} wearing Ankara print clothing`}
//           loading="lazy"
//           onLoad={() => setLoaded(true)}
//           onError={() => setImgFailed(true)}
//           className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
//             loaded ? "opacity-100" : "opacity-0"
//           }`}
//         />
//       )}

//       {/* Readability overlay */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

//       {/* Top badge */}
//       <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-900 backdrop-blur">
//         {category.tagline}
//       </span>

//       {/* Hover arrow */}
//       <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
//         <ArrowUpRight className="h-5 w-5" />
//       </span>

//       {/* Content */}
//       <div className="absolute inset-x-0 bottom-0 p-6 text-white">
//         <h3 className="font-serif text-3xl md:text-4xl mb-2">{category.name}</h3>
//         <p className="mb-4 max-w-[28ch] text-sm leading-relaxed text-white/85">
//           {category.description}
//         </p>
//         <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
//           <span className="relative">
//             Shop now
//             <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-white/80 transition-transform duration-300 group-hover:scale-x-[1.0] scale-x-50" />
//           </span>
//           <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
//         </span>
//       </div>
//     </Link>
//   );
// };

// const CategoryShowcase: React.FC = () => {
//   return (
//     <section className="relative overflow-hidden py-16 md:py-24">
//       {/* Soft Ankara-inspired background accent */}
//       <div
//         aria-hidden="true"
//         className="pointer-events-none absolute inset-0 opacity-[0.04]"
//         style={{
//           backgroundImage:
//             "radial-gradient(circle at 20% 20%, currentColor 2px, transparent 3px), radial-gradient(circle at 70% 60%, currentColor 3px, transparent 4px)",
//           backgroundSize: "48px 48px, 72px 72px",
//         }}
//       />

//       <div className="container relative mx-auto px-4">
//         <div className="mx-auto mb-12 max-w-2xl text-center">
//           <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
//             Shop by category
//           </p>
//           <h2 className="font-serif text-3xl md:text-5xl">
//             Wear the story of Ankara
//           </h2>
//           <div className="mx-auto mt-5 flex items-center justify-center gap-2">
//             <span className="h-1 w-10 rounded-full bg-amber-500" />
//             <span className="h-1 w-4 rounded-full bg-rose-500" />
//             <span className="h-1 w-10 rounded-full bg-emerald-500" />
//           </div>
//           <p className="mt-5 text-sm md:text-base text-muted-foreground">
//             Authentic African prints, crafted for every style and every age.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
//           {CATEGORIES.map((category, index) => (
//             <CategoryCard key={category.slug} category={category} index={index} />
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default CategoryShowcase;


import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

type Category = {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  fallback: string; // gradient shown if the image fails to load
};

const CATEGORIES: Category[] = [
  {
    name: "Men",
    slug: "men",
    image: "https://images.unsplash.com/photo-1615406092627-acf479f2bbc7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    tagline: "Bold & tailored",
    description: "Ankara shirts, kaftans and two-piece sets made to stand out",
    fallback: "from-amber-700 via-orange-600 to-yellow-500",
  },
  {
    name: "Women",
    slug: "women",
    image: "https://plus.unsplash.com/premium_photo-1769339044563-7e77ab4c90a5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    tagline: "Vibrant & elegant",
    description: "Ankara dresses, jumpsuits and statement pieces in rich prints",
    fallback: "from-fuchsia-700 via-rose-600 to-orange-500",
  },
  {
    name: "Kids",
    slug: "kids",
    image: "https://images.unsplash.com/photo-1744972974362-f517dff40f56?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D",
    tagline: "Playful & comfy",
    description: "Colourful Ankara outfits little ones will love to wear",
    fallback: "from-emerald-700 via-teal-600 to-lime-500",
  },
];

const CategoryCard: React.FC<{ category: Category; index: number }> = ({
  category,
  index,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <Link
      to={`/category/clothes/${category.slug}`}
      aria-label={`Shop ${category.name} collection`}
      className={`group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-gradient-to-br ${category.fallback} shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shrink-0 w-[80vw] sm:w-auto snap-center ${
        index === 1 ? "lg:mt-10" : ""
      }`}
    >
      {!imgFailed && (
        <img
          src={category.image}
          alt={`${category.name} wearing Ankara print clothing`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setImgFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}

      {/* Readability overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

      {/* Top badge */}
      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-900 backdrop-blur">
        {category.tagline}
      </span>

      {/* Hover arrow */}
      <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-neutral-900 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        <ArrowUpRight className="h-5 w-5" />
      </span>

      {/* Content */}
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <h3 className="font-serif text-3xl md:text-4xl mb-2">{category.name}</h3>
        <p className="mb-4 max-w-[28ch] text-sm leading-relaxed text-white/85">
          {category.description}
        </p>
        <span className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em]">
          <span className="relative">
            Shop now
            <span className="absolute -bottom-1 left-0 h-px w-full origin-left bg-white/80 transition-transform duration-300 group-hover:scale-x-[1.0] scale-x-50" />
          </span>
          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </Link>
  );
};

const CategoryShowcase: React.FC = () => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Soft Ankara-inspired background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, currentColor 2px, transparent 3px), radial-gradient(circle at 70% 60%, currentColor 3px, transparent 4px)",
          backgroundSize: "48px 48px, 72px 72px",
        }}
      />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Shop by category
          </p>
          <h2 className="font-serif text-3xl md:text-5xl">
            Wear the story of Ankara
          </h2>
          <div className="mx-auto mt-5 flex items-center justify-center gap-2">
            <span className="h-1 w-10 rounded-full bg-amber-500" />
            <span className="h-1 w-4 rounded-full bg-rose-500" />
            <span className="h-1 w-10 rounded-full bg-emerald-500" />
          </div>
          <p className="mt-5 text-sm md:text-base text-muted-foreground">
            Authentic African prints, crafted for every style and every age.
          </p>
        </div>

        {/* Carousel on mobile / small screens, Grid on tablet & desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 px-4 -mx-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 md:gap-8 sm:overflow-visible no-scrollbar">
          {CATEGORIES.map((category, index) => (
            <CategoryCard key={category.slug} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;