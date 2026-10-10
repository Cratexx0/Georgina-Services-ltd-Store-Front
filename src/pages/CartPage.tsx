import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import EmptyState from "@/components/common/EmptyState";
import ProductImage from "@/components/common/ProductImage";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { addToWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to continue");
      navigate("/auth");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) {
    return (
      <Layout>
        <EmptyState
          icon={<ShoppingBag className="h-8 w-8" />}
          title="Your bag is empty"
          description="Looks like you haven’t added anything yet. Browse the collection and find something you love."
          actionLabel="Continue shopping"
          actionTo="/category/clothes"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl md:text-4xl mb-8">Shopping bag</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
              <Button variant="ghost" size="sm" onClick={clearCart}>Clear bag</Button>
            </div>
            <div className="divide-y border-y">
              {cart.map((item) => {
                const itemPrice = parseFloat(item.product.discountPrice || item.product.price);
                return (
                  <div key={`${item.product.id}-${item.size}`} className="py-5 flex gap-4">
                    <Link to={`/product/${item.product.slug}`} className="h-28 w-24 flex-shrink-0 overflow-hidden rounded-md">
                      <ProductImage src={item.product.images?.[0]} alt={item.product.name} className="h-full w-full" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-3">
                        <Link to={`/product/${item.product.slug}`} className="font-medium hover:underline">
                          {item.product.name}
                        </Link>
                        <span className="font-medium">£{(itemPrice * item.quantity).toFixed(2)}</span>
                      </div>
                      {item.size && <p className="text-sm text-muted-foreground mt-1">Size: {item.size}</p>}
                      <p className="text-sm text-muted-foreground">£{itemPrice.toFixed(2)} each</p>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        <div className="flex items-center border rounded-md">
                          <button type="button" className="px-3 py-1" aria-label="Decrease quantity" onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.size)}>−</button>
                          <span className="px-3">{item.quantity}</span>
                          <button type="button" className="px-3 py-1" aria-label="Increase quantity" onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.size)}>+</button>
                        </div>
                        <button
                          type="button"
                          className="text-sm text-muted-foreground hover:text-foreground"
                          onClick={async () => {
                            await addToWishlist(item.product);
                            removeFromCart(item.product.id, item.size);
                          }}
                        >
                          Move to wishlist
                        </button>
                        <button
                          type="button"
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive ml-auto"
                          onClick={() => removeFromCart(item.product.id, item.size)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <aside className="lg:sticky lg:top-24 h-fit border rounded-lg p-6">
            <h2 className="font-serif text-2xl mb-4">Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>£{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-medium text-base">
                <span>Total</span>
                <span>£{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            {!isAuthenticated && (
              <p className="text-sm text-amber-700 bg-amber-50 rounded-md p-3 mb-4">
                Sign in to complete checkout.
              </p>
            )}
            <Button onClick={handleCheckout} className="w-full">
              {isAuthenticated ? "Checkout" : "Sign in to checkout"}
            </Button>
            <Button asChild variant="outline" className="w-full mt-2">
              <Link to="/category/clothes">Continue shopping</Link>
            </Button>
          </aside>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
