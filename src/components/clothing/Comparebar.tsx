// src/components/CompareBar.tsx
// Floating bar shown at the bottom of every page while products are selected for comparison.
import { Link, useLocation } from "react-router-dom";
import { GitCompare, X } from "lucide-react";
import { useCompare, MAX_COMPARE } from "@/context/Comparecontext";
import { getProductImages, handleImageError } from "@/lib/productUtils";

const CompareBar = () => {
  const { compareItems, count, clearCompare, removeFromCompare } = useCompare();
  const { pathname } = useLocation();

  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/90 px-4 py-3 shadow-xl backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <GitCompare className="h-4 w-4" />
          {count}/{MAX_COMPARE}
        </div>

        <div className="flex items-center gap-2">
          {compareItems.map((p) => (
            <div key={p.id} className="group relative h-10 w-10 overflow-hidden rounded-lg bg-muted">
              <img
                src={getProductImages(p)[0]}
                alt={p.name}
                onError={handleImageError}
                className="h-full w-full object-contain p-1"
              />
              <button
                type="button"
                aria-label={`Remove ${p.name} from compare`}
                onClick={() => removeFromCompare(p.id)}
                className="absolute inset-0 grid place-items-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}
        </div>

        <Link
          to="/compare"
          className={`rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition ${
            count < 2 ? "pointer-events-none opacity-50" : "hover:opacity-90"
          }`}
          aria-disabled={count < 2}
        >
          Compare
        </Link>

        <button type="button" onClick={clearCompare} aria-label="Clear compare list" className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CompareBar;