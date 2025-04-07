import React, { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { gsap } from 'gsap';
import { 
  Search, 
  ShoppingBag, 
  User, 
  Menu, 
  X,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { AuthModals } from './AuthModals';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup'>('login');
  const { isAuthenticated, user, logout } = useAuth();
  const { cartSummary } = useCart();
  
  const [isHomePage] = useRoute('/');
  const [isShopPage] = useRoute('/shop');
  const [isCartPage] = useRoute('/cart');
  
  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    if (!isMobileMenuOpen) {
      // Open animation
      gsap.fromTo(
        '.mobile-menu',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
    }
  };

  // Toggle search
  const toggleSearch = () => {
    setShowSearch(!showSearch);
    
    if (!showSearch) {
      // Open animation
      gsap.fromTo(
        '.search-container',
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      
      // Focus input after animation
      setTimeout(() => {
        const searchInput = document.getElementById('search-input');
        if (searchInput) searchInput.focus();
      }, 300);
    }
  };

  // Open auth modal
  const openAuthModal = (type: 'login' | 'signup') => {
    setAuthType(type);
    setIsAuthModalOpen(true);
  };

  return (
    <>
      <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-white shadow-md' : 'bg-white'} transition-all duration-200`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <span className="font-display text-2xl font-bold" style={{ color: 'hsl(var(--chocolate-dark))' }}>
                    Scrumpts
                  </span>
                </a>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/shop">
                <a className={`font-medium hover:text-amber-900 ${isShopPage ? 'text-amber-900' : 'text-amber-800'}`}>
                  Shop
                </a>
              </Link>
              <Link href="/collections">
                <a className="font-medium text-amber-800 hover:text-amber-900">
                  Collections
                </a>
              </Link>
              <Link href="/about">
                <a className="font-medium text-amber-800 hover:text-amber-900">
                  About
                </a>
              </Link>
              <Link href="/learn">
                <a className="font-medium text-amber-800 hover:text-amber-900">
                  Learn
                </a>
              </Link>
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={toggleSearch} className="text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                <Search className="h-5 w-5" />
              </Button>
              
              <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button variant="ghost" size="icon" className="text-amber-800 hover:text-amber-900 hover:bg-amber-50 relative">
                  <ShoppingBag className="h-5 w-5" />
                  {cartSummary.itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-amber-600 hover:bg-amber-600 text-white w-5 h-5 flex items-center justify-center p-0 text-xs">
                      {cartSummary.itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-sm font-medium">
                      {user?.displayName || user?.email}
                    </DropdownMenuItem>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/orders">
                      <DropdownMenuItem className="cursor-pointer">
                        Orders
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => openAuthModal('login')} className="text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                  <User className="h-5 w-5" />
                </Button>
              )}
              
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu} className="md:hidden text-amber-800 hover:text-amber-900 hover:bg-amber-50">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="search-container py-4 border-t">
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search for chocolates..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu md:hidden bg-white border-t py-4">
            <div className="container mx-auto px-4">
              <nav className="flex flex-col space-y-4">
                <Link href="/shop">
                  <a className="font-medium text-amber-800 hover:text-amber-900 py-2">
                    Shop
                  </a>
                </Link>
                <Link href="/collections">
                  <a className="font-medium text-amber-800 hover:text-amber-900 py-2">
                    Collections
                  </a>
                </Link>
                <Link href="/about">
                  <a className="font-medium text-amber-800 hover:text-amber-900 py-2">
                    About
                  </a>
                </Link>
                <Link href="/learn">
                  <a className="font-medium text-amber-800 hover:text-amber-900 py-2">
                    Learn
                  </a>
                </Link>
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-2 pt-2 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => openAuthModal('login')}
                      className="w-full justify-center"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => openAuthModal('signup')}
                      className="w-full justify-center bg-amber-800 hover:bg-amber-900 text-white"
                    >
                      Create Account
                    </Button>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>
      
      {/* Auth Modals */}
      <AuthModals 
        isOpen={isAuthModalOpen}
        type={authType}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitch={(type) => setAuthType(type)}
      />
    </>
  );
};
