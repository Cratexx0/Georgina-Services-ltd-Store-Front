import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProductFilters } from "@/hooks/useProductFilters";

type Filters = ReturnType<typeof useProductFilters>;

interface ProductFiltersProps {
  filters: Filters;
}

const toggleValue = (list: string[], value: string, setter: (next: string[]) => void) => {
  setter(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
};

const ProductFilters: React.FC<ProductFiltersProps> = ({ filters }) => {
  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">Filters</h3>
        {filters.activeCount > 0 && (
          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={filters.clearAll}>
            Clear all
          </Button>
        )}
      </div>

      <div>
        <Label htmlFor="filter-search" className="text-xs uppercase tracking-wide text-muted-foreground">
          Search in results
        </Label>
        <Input
          id="filter-search"
          value={filters.search}
          onChange={(e) => filters.setSearch(e.target.value)}
          placeholder="Search…"
          className="mt-2 h-9"
        />
      </div>

      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Price</p>
        <Slider
          min={filters.bounds.min}
          max={filters.bounds.max}
          step={1}
          value={filters.priceRange}
          onValueChange={(v) => filters.setPriceRange([v[0], v[1]] as [number, number])}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>£{filters.priceRange[0]}</span>
          <span>£{filters.priceRange[1]}</span>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={filters.inStockOnly}
          onCheckedChange={(v) => filters.setInStockOnly(Boolean(v))}
        />
        In stock only
      </label>

      <label className="flex items-center gap-2 text-sm">
        <Checkbox
          checked={filters.discountOnly}
          onCheckedChange={(v) => filters.setDiscountOnly(Boolean(v))}
        />
        On sale
      </label>

      {filters.availableSizes.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Size</p>
          <div className="flex flex-wrap gap-2">
            {filters.availableSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleValue(filters.sizes, size, filters.setSizes)}
                className={`h-8 min-w-8 px-2 border text-xs ${
                  filters.sizes.includes(size)
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {filters.availableColors.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Color</p>
          <div className="space-y-2">
            {filters.availableColors.map((color) => (
              <label key={color} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.colors.includes(color)}
                  onCheckedChange={() => toggleValue(filters.colors, color, filters.setColors)}
                />
                {color}
              </label>
            ))}
          </div>
        </div>
      )}

      {filters.availableBrands.length > 0 && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Brand</p>
          <div className="space-y-2">
            {filters.availableBrands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleValue(filters.brands, brand, filters.setBrands)}
                />
                {brand}
              </label>
            ))}
          </div>
        </div>
      )}

      {filters.hasRating && (
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Rating</p>
          {[4, 3].map((rating) => (
            <label key={rating} className="flex items-center gap-2 text-sm mb-2">
              <Checkbox
                checked={filters.minRating === rating}
                onCheckedChange={(v) => filters.setMinRating(v ? rating : null)}
              />
              {rating}+ stars
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
