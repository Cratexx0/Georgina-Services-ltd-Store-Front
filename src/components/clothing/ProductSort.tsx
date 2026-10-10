import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SortOption } from "@/hooks/useProductFilters";

interface ProductSortProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  showRating?: boolean;
}

const ProductSort: React.FC<ProductSortProps> = ({ value, onChange, showRating }) => {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger className="w-[180px] h-9 text-sm" aria-label="Sort products">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        {showRating && <SelectItem value="rating">Best Rated</SelectItem>}
        <SelectItem value="discount">Biggest Discount</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ProductSort;
