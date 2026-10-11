// src/components/products/ShopFilterPanel.tsx
// Sidebar / bottom-sheet filter panel + the "Sort by" dropdown.
import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { SORT_OPTIONS, SortKey, ShopFilters } from "../lib/Useshopfilters";
import { formatPrice } from "@/lib/Audience";

const Section = ({
  title,
  onClear,
  children,
}: {
  title: string;
  onClear?: () => void;
  children: React.ReactNode;
}) => (
  <section className="border-b py-5 first:pt-0 last:border-b-0">
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold">{title}</h3>
      {onClear && (
        <button
          type="button"
          onClick={onClear}
          className="text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          Clear
        </button>
      )}
    </div>
    {children}
  </section>
);

export const SortSelect = ({
  value,
  onChange,
}: {
  value: SortKey;
  onChange: (v: SortKey) => void;
}) => (
  <label className="flex items-center gap-2 text-sm">
    <span className="hidden text-muted-foreground sm:inline">Sort by</span>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortKey)}
        className="appearance-none rounded-full border bg-background py-2 pl-4 pr-9 text-sm font-medium transition-colors hover:border-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
      >
        {SORT_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
    </div>
  </label>
);

const Checkbox = ({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    role="checkbox"
    aria-checked={checked}
    onClick={() => onChange(!checked)}
    className="flex w-full items-center gap-3 py-1.5 text-left text-sm transition-colors hover:text-foreground/70"
  >
    <span
      className={`grid h-4 w-4 place-items-center rounded-[4px] border transition-all ${
        checked ? "border-foreground bg-foreground text-background" : "border-border"
      }`}
    >
      {checked && <Check className="h-3 w-3" />}
    </span>
    {label}
  </button>
);

const ShopFilterPanel = ({ filters }: { filters: ShopFilters }) => {
  const {
    typeCounts,
    types,
    toggleType,
    bounds,
    effectiveMax,
    setMaxPrice,
    sizeOptions,
    sizes,
    toggleSize,
    onSale,
    setOnSale,
    inStock,
    setInStock,
    newOnly,
    setNewOnly,
  } = filters;

  return (
    <div className="text-sm">
      {typeCounts.length > 0 && (
        <Section title="Categories" onClear={types.length ? () => types.forEach(toggleType) : undefined}>
          <ul className="space-y-0.5">
            {typeCounts.map(({ name, count }) => {
              const active = types.includes(name);
              return (
                <li key={name}>
                  <button
                    type="button"
                    onClick={() => toggleType(name)}
                    aria-pressed={active}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted ${
                      active ? "bg-muted font-semibold" : "text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {active && <Check className="h-3.5 w-3.5" />}
                      {name}
                    </span>
                    <span className="text-xs tabular-nums">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Section>
      )}

      {bounds.max > bounds.min && (
        <Section
          title="Price"
          onClear={effectiveMax < bounds.max ? () => setMaxPrice(null) : undefined}
        >
          <input
            type="range"
            min={bounds.min}
            max={bounds.max}
            step={1}
            value={effectiveMax}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            aria-label="Maximum price"
            className="h-1.5 w-full cursor-pointer accent-foreground"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(bounds.min)}</span>
            <span className="font-medium text-foreground">{formatPrice(effectiveMax)}</span>
          </div>
        </Section>
      )}

      {sizeOptions.length > 0 && (
        <Section title="Size" onClear={sizes.length ? () => sizes.forEach(toggleSize) : undefined}>
          <div className="flex flex-wrap gap-2">
            {sizeOptions.map((s) => {
              const active = sizes.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSize(s)}
                  aria-pressed={active}
                  className={`h-9 min-w-9 rounded-full border px-3 text-xs font-medium transition-all active:scale-95 ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "hover:border-foreground"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Availability">
        <Checkbox checked={onSale} onChange={setOnSale} label="On sale" />
        <Checkbox checked={inStock} onChange={setInStock} label="In stock" />
        <Checkbox checked={newOnly} onChange={setNewOnly} label="New arrivals" />
      </Section>
    </div>
  );
};

export default ShopFilterPanel;