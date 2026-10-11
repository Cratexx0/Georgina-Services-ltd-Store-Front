import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Heart,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShoppingBag,
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


const iconButton =
  "relative inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

const CountBadge = ({ count }: { count: number }) =>
  count > 0 ? (
    <span
      key={count}
      aria-hidden="true"
      className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-medium leading-none text-background animate-in zoom-in-50 duration-200 motion-reduce:animate-none"
    >
      {count > 99 ? "99+" : count}
    </span>
  ) : null;

const Header = () => {
  const { getTotalItems } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  const displayName = user?.name || user?.fullname || "Account";

  const getUserInitials = () => {
    const name = user?.name || user?.fullname || user?.email || "U";
    return name.charAt(0).toUpperCase();
  };

  // "Clothing" is the parent of Men/Women/Kids, so it only matches exactly
  const isActive = (to: string) =>
    to === "/category/clothes"
      ? pathname === to
      : pathname === to || pathname.startsWith(`${to}/`);

  const cartCount = getTotalItems();
  const wishlistCount = wishlist.length;

  const desktopLinkClass = (active: boolean) =>
    cn(
      "relative whitespace-nowrap py-1 text-sm tracking-wide transition-colors",
      "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-foreground",
      "after:transition-transform after:duration-300 motion-reduce:after:transition-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background rounded-sm",
      active
        ? "text-foreground after:scale-x-100"
        : "text-foreground/70 hover:text-foreground after:scale-x-0 hover:after:scale-x-100"
    );

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-all duration-300",
          scrolled
            ? "border-border bg-background/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-background/80 backdrop-blur-md"
        )}
      >
        <div className="container mx-auto px-4">
          <div
            className={cn(
              "grid grid-cols-[1fr_auto_1fr] items-center gap-4 transition-[height] duration-300 md:flex md:justify-between",
              scrolled ? "h-14 md:h-16" : "h-16 md:h-[4.5rem]"
            )}
          >
            {/* Mobile menu button (left on mobile, hidden on md+) */}
            <div className="flex md:hidden">
              <button
                type="button"
                className={cn(iconButton, "-ml-2")}
                onClick={() => setIsMenuOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Logo (centered on mobile, left on md+) */}
            <Link
              to="/"
              className="flex-shrink-0 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
              aria-label="Georgina Services Limited home"
            >
              <img
                src="/gina_logo.png"
                alt="Georgina Services Limited"
                width={140}
                height={44}
                className={cn(
                  "w-auto transition-all duration-300",
                  scrolled ? "h-8 md:h-9" : "h-9 md:h-10"
                )}
              />
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Main"
              className="hidden items-center gap-5 md:hidden lg:flex xl:gap-7"
            >
              {clothingLinks.map((link) => {
                const active = isActive(link.to);
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    aria-current={active ? "page" : undefined}
                    className={desktopLinkClass(active)}
                  >
                    {link.label}
                  </Link>
                );
              })}
         
            </nav>

            {/* Actions */}
            <div className="flex items-center justify-end gap-1 md:flex-1 md:gap-2">
              <div className="hidden md:block">
                <SearchBar className="w-[170px] xl:w-[260px]" />
              </div>

              <Link
                to="/wishlist"
                className={iconButton}
                aria-label={
                  wishlistCount > 0
                    ? `Wishlist, ${wishlistCount} ${wishlistCount === 1 ? "item" : "items"}`
                    : "Wishlist"
                }
              >
                <Heart className="h-5 w-5" />
                <CountBadge count={wishlistCount} />
              </Link>

              <button
                type="button"
                className={iconButton}
                aria-label={
                  cartCount > 0
                    ? `Open shopping bag, ${cartCount} ${cartCount === 1 ? "item" : "items"}`
                    : "Open shopping bag"
                }
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="h-5 w-5" />
                <CountBadge count={cartCount} />
              </button>

              <div className="hidden md:block">
                {isAuthenticated ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background"
                        aria-label="Account menu"
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-foreground text-sm text-background">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-60">
                      <DropdownMenuLabel className="font-normal">
                        <p className="truncate text-sm font-medium">{displayName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user?.email}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate("/dashboard")}
                        className="cursor-pointer"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button size="sm" variant="outline" className="gap-2" asChild>
                    <Link to="/auth" aria-label="Sign in">
                      <LogIn className="h-4 w-4" />
                      <span className="hidden xl:inline">Sign in</span>
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="left" className="flex w-[86vw] flex-col gap-0 p-0 sm:max-w-sm">
          <SheetHeader className="border-b px-5 py-4 text-left">
            <SheetTitle className="font-serif text-2xl">Menu</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <SearchBar onClose={() => setIsMenuOpen(false)} />

            <nav aria-label="Mobile" className="mt-6">
              <ul>
                {clothingLinks.map((link) => {
                  const active = isActive(link.to);
                  return (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        onClick={() => setIsMenuOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between border-b border-border py-3 text-lg transition-colors",
                          active ? "font-medium text-foreground" : "text-foreground/80"
                        )}
                      >
                        {link.label}
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    </li>
                  );
                })}
              </ul>

    
            </nav>
          </div>

          {/* Account area pinned to the bottom */}
          <div className="border-t bg-muted/30 px-5 py-4">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-foreground text-background">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{displayName}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/dashboard");
                    }}
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                  <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </div>
            ) : (
              <Button className="w-full" asChild>
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign in
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <MiniCart open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
};

export default Header;