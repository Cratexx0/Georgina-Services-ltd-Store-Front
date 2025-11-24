// components/products/SizeSelector.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeSelect: (size: string | null) => void;
  className?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  selectedSize,
  onSizeSelect,
  className
}) => {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  // Common size order for better UX
  const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
  const sortedSizes = [...sizes].sort((a, b) => {
    const indexA = sizeOrder.indexOf(a.toUpperCase());
    const indexB = sizeOrder.indexOf(b.toUpperCase());
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-900">Size</h4>
        {selectedSize && (
          <button
            type="button"
            onClick={() => onSizeSelect(null)}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!selectedSize ? "default" : "outline"}
          size="sm"
          onClick={() => onSizeSelect(null)}
          className="min-w-12 h-10"
        >
          All
        </Button>
        {sortedSizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSizeSelect(size)}
            className="min-w-12 h-10"
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;