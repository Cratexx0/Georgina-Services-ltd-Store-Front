import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDE_DURATION = 5000; // ms each slide stays on screen
const FADE_DURATION = 1500; // ms for the crossfade

type Slide = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  image: string;
  fallback: string;
};

/**
 * Put your Ankara photos in /public/images/hero/
 * Recommended: landscape, at least 1800x1000px, .jpg or .webp.
 * Choose photos where the model sits on the RIGHT, since the text overlays the left.
 */
const SLIDES: Slide[] = [
  {
    slug: "men",
    eyebrow: "Men · New season",
    title: "Bold prints, sharp cuts",
    description: "Ankara shirts, kaftans and two-piece sets made to stand out.",
    cta: "Shop Men",
    image: "/images/hero/ankara-men.jpg",
    fallback: "from-amber-800 via-orange-700 to-yellow-600",
  },
  {
    slug: "women",
    eyebrow: "Women · New season",
    title: "Vibrant, elegant, yours",
    description: "Ankara dresses, jumpsuits and statement pieces in rich prints.",
    cta: "Shop Women",
    image: "/images/hero/ankara-women.jpg",
    fallback: "from-fuchsia-800 via-rose-700 to-orange-600",
  },
  {
    slug: "kids",
    eyebrow: "Kids · New season",
    title: "Playful colours, all day comfort",
    description: "Colourful Ankara outfits little ones will love to wear.",
    cta: "Shop Kids",
    image: "/images/hero/ankara-kids.jpg",
    fallback: "from-emerald-800 via-teal-700 to-lime-600",
  },
];

const ClothingHero: React.FC = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const next = useCallback(() => setActive((i) => (i + 1) % SLIDES.length), []);
  const prev = useCallback(
    () => setActive((i) => (i - 1 + SLIDES.length) % SLIDES.length),
    []
  );

  // Auto-advance. Restarts whenever the slide changes (including manual changes),
  // and stops while hovered, focused or when the browser tab is hidden.
  useEffect(() => {
    if (paused) return;
    const id = window.setTimeout(() => {
      if (!document.hidden) next();
    }, SLIDE_DURATION);
    return () => window.clearTimeout(id);
  }, [active, paused, next]);

  const navBtn =
    "hidden md:flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white backdrop-blur transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white";

  return (
    <section
      className="relative min-h-[70vh] overflow-hidden bg-stone-900 text-white md:min-h-[78vh]"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <style>{`
        @keyframes hero-progress { from { width: 0%; } to { width: 100%; } }
        @media (prefers-reduced-motion: reduce) {
          .hero-slide, .hero-slide img { transition-duration: 0ms !important; }
          .hero-progress { animation: none !important; width: 100% !important; }
        }
      `}</style>

      {/* Slides */}
      {SLIDES.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.slug}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${SLIDES.length}`}
            aria-hidden={!isActive}
            className={`hero-slide absolute inset-0 bg-gradient-to-br ${slide.fallback} transition-opacity ease-in-out ${
              isActive ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
            }`}
            style={{ transitionDuration: `${FADE_DURATION}ms` }}
          >
            {!failed[slide.slug] && (
              <img
                src={slide.image}
                alt={`${slide.eyebrow}: models wearing Ankara print clothing`}
                loading={i === 0 ? "eager" : "lazy"}
                onError={() => setFailed((f) => ({ ...f, [slide.slug]: true }))}
                className={`absolute inset-0 h-full w-full object-cover object-right transition-transform ease-out ${
                  isActive ? "scale-110" : "scale-100"
                }`}
                style={{ transitionDuration: `${SLIDE_DURATION + FADE_DURATION * 2}ms` }}
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="container relative mx-auto flex min-h-[70vh] items-center px-4 md:min-h-[78vh]">
              <div
                className={`max-w-xl py-20 transition-all ease-out ${
                  isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDuration: "1200ms",
                  transitionDelay: isActive ? "400ms" : "0ms",
                }}
              >
                <p className="mb-4 text-xs uppercase tracking-[0.28em] text-white/80 md:text-sm">
                  {slide.eyebrow}
                </p>
                <h1 className="mb-4 font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">
                  {slide.title}
                </h1>
                <p className="mb-8 max-w-md text-base text-white/85 md:text-lg">
                  {slide.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-full bg-white px-7 text-stone-900 hover:bg-stone-100"
                  >
                    <Link to={`/category/clothes/${slide.slug}`} tabIndex={isActive ? 0 : -1}>
                      {slide.cta}
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-full border-white bg-transparent px-7 text-white hover:bg-white/10 hover:text-white"
                  >
                    <Link to="/category/clothes" tabIndex={isActive ? 0 : -1}>
                      View all
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Arrows */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 hidden -translate-y-1/2 justify-between px-4 md:flex lg:px-8">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className={`${navBtn} pointer-events-auto`}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className={`${navBtn} pointer-events-auto`}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Indicators with progress */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex items-center justify-center gap-3 px-4">
        {SLIDES.map((slide, i) => {
          const isActive = i === active;
          return (
            <button
              key={slide.slug}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Go to ${slide.cta.replace("Shop ", "")} slide`}
              aria-current={isActive}
              className="group flex items-center gap-2 py-2 focus-visible:outline-none"
            >
              <span
                className={`relative h-1 overflow-hidden rounded-full bg-white/30 transition-all duration-500 ${
                  isActive ? "w-14" : "w-6 group-hover:bg-white/50"
                }`}
              >
                {isActive && (
                  <span
                    key={`${active}-${paused}`}
                    className="hero-progress absolute inset-y-0 left-0 rounded-full bg-white"
                    style={{
                      animation: `hero-progress ${SLIDE_DURATION}ms linear forwards`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                  />
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default ClothingHero;