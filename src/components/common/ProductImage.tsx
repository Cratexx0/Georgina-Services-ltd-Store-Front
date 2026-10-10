import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_IMAGE } from "@/lib/productUtils";

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  hoverSrc?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({
  src,
  alt,
  className,
  imgClassName,
  hoverSrc,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const displaySrc = failed || !src ? PLACEHOLDER_IMAGE : src;

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-muted clothing-shimmer" />
      )}
      <img
        src={displaySrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          setFailed(true);
          setLoaded(true);
        }}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-500",
          hoverSrc ? "group-hover:opacity-0" : "group-hover:scale-105",
          loaded ? "opacity-100" : "opacity-0",
          imgClassName
        )}
      />
      {hoverSrc && !failed && (
        <img
          src={hoverSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
    </div>
  );
};

export default ProductImage;
