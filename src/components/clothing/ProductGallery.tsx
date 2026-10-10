import React, { useState } from "react";
import { cn } from "@/lib/utils";
import ProductImage from "@/components/common/ProductImage";

interface ProductGalleryProps {
  images: string[];
  name: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, name }) => {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];

  return (
    <div className="lg:sticky lg:top-24 space-y-3">
      <ProductImage
        src={list[active]}
        alt={name}
        className="aspect-[3/4] rounded-lg bg-stone-100"
        imgClassName="object-cover"
      />
      {list.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Product images">
          {list.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}`}
              aria-selected={active === index}
              className={cn(
                "h-16 w-16 md:h-20 md:w-20 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active === index ? "border-foreground" : "border-transparent opacity-80 hover:opacity-100"
              )}
            >
              <img src={image} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
