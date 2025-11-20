import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, LogIn, User, Heart, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Debug auth state
  useEffect(() => {
    console.log('🔐 Header Auth State:', {
      isAuthenticated,
      user: user?.email,
      path: location.pathname
    });
  }, [isAuthenticated, user, location.pathname]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopEase
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/category/clothes" className="text-muted-foreground hover:text-primary transition-colors">
              Clothes
            </Link>
            <Link to="/category/foodstuffs" className="text-muted-foreground hover:text-primary transition-colors">
              Food & Spices
            </Link>
            <Link to="/category/services" className="text-muted-foreground hover:text-primary transition-colors">
              Cleaning Services
            </Link>
          </nav>
          
          {/* Search and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search products..."
                className="w-[200px] lg:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                variant="ghost" 
                size="icon" 
                className="absolute right-0 top-0"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
            
            <Link to="/wishlist" className="relative">
              <Heart className="h-4 w-4 text-muted-foreground" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative">
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <Link to="/dashboard">
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 text-sm w-4" />
                      {/* {user?.name ||  'Account'} */}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-xs"
                  >
                    <LogOut className=' text-red-800 hover:bg-red-600'/>
                  </Button>
                </div>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-muted-foreground" 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-down">
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="text-muted-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/category/clothes" className="text-muted-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                Clothes
              </Link>
              <Link to="/category/foodstuffs" className="text-muted-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                Food & Spices
              </Link>
              <Link to="/category/services" className="text-muted-foreground hover:text-primary transition-colors" onClick={toggleMenu}>
                Cleaning Services
              </Link>
         
              <div className="flex items-center space-x-4">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-2 w-full">
                    <Link to="/dashboard" onClick={toggleMenu} className="w-full">
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 w-full justify-start">
                        <User className="h-4 w-4" />
                        {user?.name || user?.fullname || 'Account'}
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleLogout}
                      className="w-full justify-start text-xs"
                    >
                   <LogOut/>
                    </Button>
                  </div>
                ) : (
                  <Link to="/auth" onClick={toggleMenu} className="w-full">
                    <Button variant="default" size="sm" className="flex items-center gap-2 w-full">
                      <LogIn className="h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
            <div className="mt-4 flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button 
                  type="submit" 
                  variant="ghost" 
                  size="icon" 
                  className="absolute right-0 top-0"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
              
              <Link to="/cart" className="relative" onClick={toggleMenu}>
                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;