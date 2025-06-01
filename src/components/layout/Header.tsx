
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart, Menu, X, LogIn, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import LanguageSelector from '@/components/ui/LanguageSelector';

const Header = () => {
  const { cart } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary">
            ShopEase
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-primary transition-colors">
              {t('home')}
            </Link>
            <Link to="/category/clothing" className="text-gray-700 hover:text-primary transition-colors">
              {t('clothing')}
            </Link>
            <Link to="/category/food" className="text-gray-700 hover:text-primary transition-colors">
              {t('food')}
            </Link>
            <Link to="/cleaning-services" className="text-gray-700 hover:text-primary transition-colors">
              {t('cleaningServices')}
            </Link>
          </nav>
          
          {/* Search and Cart */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder={t('searchPlaceholder')}
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
            
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-4 w-4 text-gray-700" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>
            
            <LanguageSelector />
            
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <Link to="/account">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {t('account')}
                  </Button>
                </Link>
              ) : (
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="flex bg-blue-500 text-gray-50 hover:bg-blue-400 hover:text-gray-100 items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    {t('signIn')}
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden text-gray-700" 
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
              <Link to="/" className="text-gray-700 hover:text-primary transition-colors" onClick={toggleMenu}>
                {t('home')}
              </Link>
              <Link to="/category/clothing" className="text-gray-700 hover:text-primary transition-colors" onClick={toggleMenu}>
                {t('clothing')}
              </Link>
              <Link to="/category/food" className="text-gray-700 hover:text-primary transition-colors" onClick={toggleMenu}>
                {t('food')}
              </Link>
              <Link to="/cleaning-services" className="text-gray-700 hover:text-primary transition-colors" onClick={toggleMenu}>
                {t('cleaningServices')}
              </Link>
         
              <div className="flex items-center space-x-4">
                <LanguageSelector />
                {isAuthenticated ? (
                  <Link to="/account" onClick={toggleMenu}>
                    <Button variant="ghost" size="sm" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {t('account')}
                    </Button>
                  </Link>
                ) : (
                  <Link to="/auth" onClick={toggleMenu}>
                    <Button variant="ghost" size="sm" className="flex bg-blue-500 text-gray-50 hover:bg-blue-400 hover:text-gray-100 items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      {t('signIn')}
                    </Button>
                  </Link>
                )}
              </div>
            </nav>
            <div className="mt-4 flex items-center space-x-4">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={t('searchPlaceholder')}
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
                <ShoppingCart className="h-6 w-6 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
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
