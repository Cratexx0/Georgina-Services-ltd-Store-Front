import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useAuth } from "@/context/AuthContext";
import SearchBar from "@/components/ui/SearchBar";
import MiniCart from "@/components/cart/MiniCart";
import { cn } from "@/lib/utils";

const clothingLinks = [
  { label: "Clothing", to: "/category/clothes" },
  { label: "Men", to: "/category/clothes/men" },
  { label: "Women", to: "/category/clothes/women" },
  { label: "Kids", to: "/category/clothes/kids" },
];

const Header = () => {
  const { cart, getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const getUserInitials = () => {
    const name = user?.name || user?.fullname || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  const cartCount = getTotalItems();

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "bg-background/95 backdrop-blur-md shadow-sm border-border"
            : "bg-background/80 backdrop-blur-md border-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-[4.5rem] items-center justify-between gap-4">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/gina_logo.png"
                alt="Georgina Services Limited"
                width={140}
                height={44}
                className="h-9 w-auto md:h-10"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-7 text-sm">
              {clothingLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-foreground/80 hover:text-foreground transition-colors tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3 flex-1 justify-end max-w-xl">
              <SearchBar className="w-[220px] lg:w-[280px]" />

              <Link to="/wishlist" className="relative p-2" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-foreground text-background rounded-full min-w-4 h-4 px-1 flex items-center justify-center text-[10px]">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="relative p-2"
                aria-label="Open shopping bag"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-foreground text-background rounded-full min-w-4 h-4 px-1 flex items-center justify-center text-[10px]">
                    {cartCount}
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="rounded-full px-1" aria-label="Account">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-foreground text-background text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <p className="text-sm font-medium">{user?.name || user?.fullname || "Account"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button size="sm" variant="outline" className="gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign in
                  </Button>
                </Link>
              )}
            </div>

            <div className="flex md:hidden items-center gap-1">
              <Link to="/wishlist" className="relative p-2" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {wishlist.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-foreground text-background rounded-full min-w-4 h-4 text-[10px] flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>
              <button type="button" className="relative p-2" aria-label="Open shopping bag" onClick={() => setCartOpen(true)}>
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute top-0.5 right-0.5 bg-foreground text-background rounded-full min-w-4 h-4 text-[10px] flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                className="p-2"
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="w-[86vw] sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="font-serif text-left text-2xl">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <SearchBar className="mb-6" onClose={() => setIsMenuOpen(false)} />
            <nav className="flex flex-col gap-1">
              {clothingLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className="py-2.5 text-lg border-b border-border"
                >
                  {link.label}
                </Link>
              ))}
              <Link to="/category/foodstuffs" onClick={() => setIsMenuOpen(false)} className="py-2.5 text-sm text-muted-foreground">
                Food & Spices
              </Link>
              <Link to="/category/services" onClick={() => setIsMenuOpen(false)} className="py-2.5 text-sm text-muted-foreground">
                Cleaning Services
              </Link>
            </nav>
            <div className="mt-6">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={() => { setIsMenuOpen(false); navigate("/dashboard"); }}>
                    <User className="h-4 w-4 mr-2" />
                    {user?.name || "Account"}
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <Button className="w-full" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <MiniCart open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;
