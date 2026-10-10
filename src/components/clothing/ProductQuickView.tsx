import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FlexibleProduct, getDiscountPrice, getPrice } from "@/lib/productTypes";
import {
  getDiscountPercent,
  getProductImages,
  getProductSizes,
  localToApiProduct,
} from "@/lib/productUtils";
import { Product as LocalProduct } from "@/data/products";
import { Product as ApiProduct } from "@/lib/type";
import { useCart } from "@/context/CartContext";
import ProductImage from "@/components/common/ProductImage";

interface ProductQuickViewProps {
  product: FlexibleProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const toApi = (p: FlexibleProduct): ApiProduct =>
  "categoryLevel1" in p ? p : localToApiProduct(p as LocalProduct);

const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  product,
  open,
  onOpenChange,
}) => {
  const { addToCart } = useCart();
  const [size, setSize] = useState("");
  if (!product) return null;

  const images = getProductImages(product);
  const sizes = getProductSizes(product);
  const current = getDiscountPrice(product) ?? getPrice(product);
  const original = getDiscountPrice(product) ? getPrice(product) : null;
  const discount = getDiscountPercent(product);

  const handleAdd = () => {
    if (sizes.length && !size) return;
    addToCart(toApi(product), 1, size);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <ProductImage
            src={images[0]}
            alt={product.name}
            className="aspect-[3/4] md:aspect-auto md:min-h-[420px]"
          />
          <div className="p-6 flex flex-col">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-left">
                {product.name}
              </DialogTitle>
            </DialogHeader>
            <div className="flex items-baseline gap-2 mt-3">
              <span className="text-lg font-medium">£{current.toFixed(2)}</span>
              {original && (
                <span className="text-sm text-muted-foreground line-through">
                  £{original.toFixed(2)}
                </span>
              )}
              {discount > 0 && (
                <span className="text-xs font-medium text-destructive">{discount}% off</span>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-3 line-clamp-4">
              {product.description}
            </p>
            {sizes.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-medium uppercase tracking-wide mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`h-9 min-w-9 px-3 border text-sm transition-colors ${
                        size === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-auto pt-6 flex flex-col gap-2">
              <Button onClick={handleAdd} disabled={product.stock === 0 || (sizes.length > 0 && !size)}>
                {product.stock === 0 ? "Out of stock" : "Add to cart"}
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/product/${product.slug}`} onClick={() => onOpenChange(false)}>
                  View full details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductQuickView;
