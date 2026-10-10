import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import RelatedProductsCarousel from "@/components/products/RelatedProductsCarousel";
import ProductReview from "@/components/products/ProductReview";
import { toast } from "@/components/ui/sonner";
import { apiService } from "@/lib/api";
import { Product } from "@/lib/type";
import { getProductBySlug as getLocalBySlug, products as localProducts } from "@/data/products";
import {
  addRecentlyViewed,
  getProductImages,
  getProductSizes,
  getRecentlyViewed,
  localToApiProduct,
} from "@/lib/productUtils";
import ProductGallery from "@/components/clothing/ProductGallery";
import { ProductDetailSkeleton } from "@/components/Loader/SkeletonLoader";
import ErrorState from "@/components/common/ErrorState";
import ProductGrid from "@/components/products/ProductGrid";

const ProductPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [recent, setRecent] = useState(getRecentlyViewed(productSlug));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      try {
        setLoading(true);
        setError(null);
        let productData: Product | null = null;
        try {
          productData = await apiService.getProductBySlug(productSlug);
        } catch {
          productData = null;
        }
        if (!productData) {
          const local = getLocalBySlug(productSlug);
          productData = local ? localToApiProduct(local) : null;
        }
        if (!productData) {
          setError("Product not found");
          return;
        }
        setProduct(productData);
        addRecentlyViewed(productData);
        setRecent(getRecentlyViewed(productData.slug));
        const sizes = getProductSizes(productData);
        setSelectedSize(sizes[0] || "");

        try {
          const related = await apiService.getProductsByCategory(productData.categoryLevel1);
          setRelatedProducts(related.filter((p) => p.id !== productData!.id).slice(0, 8));
        } catch {
          const related = localProducts
            .filter((p) => p.slug !== productData!.slug && p.categoryId === "clothes")
            .slice(0, 8)
            .map(localToApiProduct);
          setRelatedProducts(related);
        }
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productSlug]);

  const handleAddToCart = (goCheckout = false) => {
    if (!product) return;
    if (product.stock === 0) {
      toast.error("This product is out of stock");
      return;
    }
    const availableSizes = getProductSizes(product);
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    addToCart(product, quantity, selectedSize);
    if (goCheckout) navigate("/checkout");
  };

  const handleWishlistToggle = async () => {
    if (!product) return;
    if (isInWishlist(product.id)) await removeFromWishlist(product.id);
    else await addToWishlist(product);
  };

  const handleShare = async () => {
    if (!product) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: product.name, url: window.location.href });
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (loading) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <ErrorState
          title="Product not found"
          message="This piece may have been removed or the link is incorrect."
        />
      </Layout>
    );
  }

  const discountPercentage =
    product.discountPrice && product.price
      ? Math.round(
          (1 - parseFloat(product.discountPrice.toString()) / parseFloat(product.price.toString())) * 100
        )
      : 0;
  const currentPrice = product.discountPrice
    ? parseFloat(product.discountPrice.toString())
    : parseFloat(product.price.toString());
  const originalPrice = product.discountPrice ? parseFloat(product.price.toString()) : null;
  const availableSizes = getProductSizes(product);
  const images = getProductImages(product);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 md:py-10">
        <nav className="flex items-center flex-wrap gap-1 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <Link to="/category/clothes" className="hover:text-foreground">Clothing</Link>
          {product.categoryLevel2 && (
            <>
              <span>/</span>
              <Link
                to={`/category/clothes/${product.categoryLevel2.toLowerCase()}`}
                className="hover:text-foreground capitalize"
              >
                {product.categoryLevel2}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-foreground truncate max-w-[180px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          <ProductGallery images={images} name={product.name} />

          <div>
            <h1 className="font-serif text-3xl md:text-4xl mb-3">{product.name}</h1>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-xl font-medium">£{currentPrice.toFixed(2)}</span>
              {originalPrice && (
                <span className="text-muted-foreground line-through">£{originalPrice.toFixed(2)}</span>
              )}
              {discountPercentage > 0 && (
                <span className="text-sm text-destructive">{discountPercentage}% off</span>
              )}
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {product.description || "A thoughtfully made piece for your wardrobe."}
            </p>

            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Size {selectedSize && `· ${selectedSize}`}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 min-w-10 px-3 border text-sm ${
                        selectedSize === size
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

            <p className="flex items-center text-sm mb-4">
              <span className={`h-2 w-2 rounded-full mr-2 ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
              {product.stock > 0
                ? product.stock <= 5
                  ? `Almost gone · ${product.stock} left`
                  : `In stock · ${product.stock} available`
                : "Out of stock"}
            </p>

            <div className="flex items-center gap-3 mb-3">
              <div className="flex items-center border rounded-md">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="px-3 py-2"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  −
                </button>
                <span className="px-3">{quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="px-3 py-2"
                  disabled={quantity >= product.stock}
                  onClick={() => setQuantity((q) => q + 1)}
                >
                  +
                </button>
              </div>
              <Button
                className="flex-1"
                onClick={() => handleAddToCart(false)}
                disabled={product.stock === 0 || (availableSizes.length > 0 && !selectedSize)}
              >
                Add to cart
              </Button>
            </div>
            <Button
              variant="outline"
              className="w-full mb-4"
              onClick={() => handleAddToCart(true)}
              disabled={product.stock === 0 || (availableSizes.length > 0 && !selectedSize)}
            >
              Buy now
            </Button>

            <div className="flex gap-2 mb-6">
              <Button variant="ghost" size="sm" onClick={handleWishlistToggle}>
                <Heart className={`h-4 w-4 mr-2 ${isInWishlist(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                {isInWishlist(product.id) ? "Saved" : "Save"}
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" /> Share
              </Button>
            </div>

            <div className="border-t pt-5 space-y-3 text-sm">
              <p className="flex items-start gap-2 text-muted-foreground">
                <Truck className="h-4 w-4 mt-0.5" />
                Standard shipping calculated at checkout. Orders usually dispatch within 2–3 working days.
              </p>
              <p>
                <span className="font-medium">Category:</span> {product.categoryLevel1}
                {product.categoryLevel2 ? ` · ${product.categoryLevel2}` : ""}
              </p>
              {product.brand && (
                <p>
                  <span className="font-medium">Brand:</span> {product.brand}
                </p>
              )}
            </div>

            <div className="mt-8 border-t pt-6">
              <ProductReview productId={product.id} />
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <RelatedProductsCarousel products={relatedProducts} title="You may also like" />
          </div>
        )}

        {recent.length > 0 && (
          <div className="mt-16">
            <ProductGrid products={recent} title="Recently viewed" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductPage;
