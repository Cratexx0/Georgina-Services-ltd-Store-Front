import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Truck, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Put your banner photo at /public/images/promo/ankara-banner.jpg
 * Recommended: landscape, at least 1600x900px, .jpg or .webp.
 * Tip: choose a photo where the model/outfit sits on the RIGHT side,
 * because the text overlays the left side.
 * Search pexels.com or unsplash.com for "ankara fashion" or "african print".
 */
const BANNER_IMAGE = "https://plus.unsplash.com/premium_photo-1769339044734-4f96667ed426?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=NHwxMjA3fDA%3D";

const HIGHLIGHTS = [
  { icon: Scissors, label: "Tailored fits" },
  { icon: Sparkles, label: "Authentic prints" },
  { icon: Truck, label: "Fast delivery" },
];

const PromoBanner: React.FC = () => {
  const [imgFailed, setImgFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="py-8 md:py-14">
      <div className="container mx-auto px-4">
        <div className="group relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-amber-800 via-rose-700 to-fuchsia-800 text-white shadow-xl min-h-[380px] md:min-h-[460px]">
          {/* Background image */}
          {!imgFailed && (
            <img
              src={BANNER_IMAGE}
              alt="Models wearing vibrant Ankara print outfits"
              loading="lazy"
              onLoad={() => setLoaded(true)}
              onError={() => setImgFailed(true)}
              className={`absolute inset-0 -z-10 h-full w-full object-cover object-right transition-all duration-1000 group-hover:scale-105 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {/* Readability overlays: darker on the left where the text sits */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/85 via-black/55 to-black/10 md:from-black/80 md:via-black/45 md:to-transparent" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Decorative pattern accent */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, #fff 2px, transparent 3px), radial-gradient(circle at 75% 70%, #fff 3px, transparent 4px)",
              backgroundSize: "44px 44px, 68px 68px",
            }}
          />

          {/* Content */}
          <div className="relative flex min-h-[380px] md:min-h-[460px] max-w-xl flex-col items-start justify-center p-8 md:p-16">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[10px] font-medium uppercase tracking-[0.22em] backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              Limited pieces
            </span>

            <h2 className="font-serif text-4xl leading-tight md:text-6xl">
              New season,
              <span className="block bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">
                new silhouettes
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
              Explore our latest Ankara arrivals before they go. Fresh cuts,
              bold prints and everyday staples, made to turn heads.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-white px-7 text-stone-900 hover:bg-amber-100"
              >
                <Link to="/category/clothes">
                  Shop the collection
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="rounded-full border border-white/40 px-7 text-white hover:bg-white/15 hover:text-white"
              >
                <Link to="/category/clothes/women">Shop women</Link>
              </Button>
            </div>

            {/* Highlights */}
            <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-xs text-white/80">
              {HIGHLIGHTS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-amber-300" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;