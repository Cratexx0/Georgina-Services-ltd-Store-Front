import React from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Trash2 } from "lucide-react";
import ProductImage from "@/components/common/ProductImage";

interface MiniCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MiniCart: React.FC<MiniCartProps> = ({ open, onOpenChange }) => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="font-serif text-2xl">Your bag</SheetTitle>
        </SheetHeader>

        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="font-medium mb-1">Your bag is empty</p>
            <p className="text-sm text-muted-foreground mb-6">
              Add something you love and it will appear here.
            </p>
            <Button asChild onClick={() => onOpenChange(false)}>
              <Link to="/category/clothes">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.map((item) => {
                const price = parseFloat(item.product.discountPrice || item.product.price);
                return (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-3"
                  >
                    <Link
                      to={`/product/${item.product.slug}`}
                      onClick={() => onOpenChange(false)}
                      className="h-24 w-20 flex-shrink-0 overflow-hidden rounded-md"
                    >
                      <ProductImage
                        src={item.product.images?.[0]}
                        alt={item.product.name}
                        className="h-full w-full"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={() => onOpenChange(false)}
                        className="text-sm font-medium line-clamp-2 hover:underline"
                      >
                        {item.product.name}
                      </Link>
                      {item.size && (
                        <p className="text-xs text-muted-foreground mt-0.5">Size: {item.size}</p>
                      )}
                      <p className="text-sm mt-1">£{(price * item.quantity).toFixed(2)}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border rounded-md text-sm">
                          <button
                            type="button"
                            className="px-2 py-1"
                            aria-label="Decrease quantity"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1, item.size)
                            }
                          >
                            −
                          </button>
                          <span className="px-2">{item.quantity}</span>
                          <button
                            type="button"
                            className="px-2 py-1"
                            aria-label="Increase quantity"
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1, item.size)
                            }
                          >
                            +
                          </button>
                        </div>
                        <button
                          type="button"
                          aria-label="Remove item"
                          className="text-muted-foreground hover:text-destructive"
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
            <div className="border-t px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span className="font-medium">£{getTotalPrice().toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping calculated at checkout.</p>
              <Button asChild className="w-full" onClick={() => onOpenChange(false)}>
                <Link to="/checkout">Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
                <Link to="/cart">View bag</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MiniCart;
