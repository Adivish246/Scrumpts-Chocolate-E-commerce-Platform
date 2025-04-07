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
import logoImage from '@/assets/logo.png';

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
                <div className="flex items-center cursor-pointer logo-container rounded-lg p-1">
                  <img 
                    src={logoImage} 
                    alt="Scrumpts Logo" 
                    className="h-14 w-auto animate-glow-pulse relative z-10"
                  />
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2">
              <Link href="/shop">
                <span className={`font-medium cursor-pointer py-2 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-glow ${isShopPage ? 'text-[hsl(var(--chocolate-dark))] text-glow-subtle bg-[hsl(var(--muted))]' : 'text-[hsl(var(--chocolate-medium))]'}`}>
                  Shop
                </span>
              </Link>
              <Link href="/collections">
                <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] py-2 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-glow">
                  Collections
                </span>
              </Link>
              <Link href="/about">
                <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] py-2 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-glow">
                  About
                </span>
              </Link>
              <Link href="/learn">
                <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] py-2 px-4 rounded-lg transition-all duration-300 hover:bg-white hover:shadow-glow">
                  Learn
                </span>
              </Link>
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSearch} 
                className="text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-lg transition-all duration-300 hover:shadow-glow"
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <Link href="/wishlist">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-lg transition-all duration-300 hover:shadow-glow"
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
              
              <Link href="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-lg transition-all duration-300 hover:shadow-glow relative"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {cartSummary.itemCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white w-5 h-5 flex items-center justify-center p-0 text-xs animate-glow-pulse shadow-glow">
                      {cartSummary.itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-lg transition-all duration-300 hover:shadow-glow"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="shadow-premium rounded-lg border-[hsl(var(--border))]">
                    <DropdownMenuItem className="text-sm font-medium text-[hsl(var(--chocolate-dark))]">
                      {user?.displayName || user?.email}
                    </DropdownMenuItem>
                    <Link href="/profile">
                      <DropdownMenuItem className="cursor-pointer hover:text-[hsl(var(--chocolate-dark))]">
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/orders">
                      <DropdownMenuItem className="cursor-pointer hover:text-[hsl(var(--chocolate-dark))]">
                        Orders
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => openAuthModal('login')} 
                  className="text-[hsl(var(--chocolate-medium))] hover:text-white hover:bg-[hsl(var(--chocolate-medium))] border-[hsl(var(--chocolate-medium))] rounded-lg transition-all duration-300 hover:shadow-glow flex items-center space-x-2"
                >
                  <User className="h-4 w-4 mr-1" />
                  <span>Sign In</span>
                </Button>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu} 
                className="md:hidden text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-lg transition-all duration-300 hover:shadow-glow"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="search-container py-4 border-t border-[hsl(var(--chocolate-light))/20]">
              <div className="relative">
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search exquisite chocolates..."
                  className="w-full pl-12 pr-12 py-3 border-2 border-[hsl(var(--chocolate-light))] rounded-xl focus:outline-none focus:ring-2 focus:ring-[hsl(var(--chocolate-medium))] focus:border-[hsl(var(--chocolate-medium))] transition-all duration-300 shadow-soft focus:shadow-glow"
                />
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-[hsl(var(--chocolate-medium))]" />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowSearch(false)}
                  className="absolute right-3 top-2.5 text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-transparent"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="text-xs bg-white border-[hsl(var(--chocolate-light))] text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-full shadow-soft">Dark Chocolate</Button>
                <Button variant="outline" size="sm" className="text-xs bg-white border-[hsl(var(--chocolate-light))] text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-full shadow-soft">Truffles</Button>
                <Button variant="outline" size="sm" className="text-xs bg-white border-[hsl(var(--chocolate-light))] text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-full shadow-soft">Gift Sets</Button>
                <Button variant="outline" size="sm" className="text-xs bg-white border-[hsl(var(--chocolate-light))] text-[hsl(var(--chocolate-medium))] hover:text-[hsl(var(--chocolate-dark))] hover:bg-white rounded-full shadow-soft">Seasonal</Button>
              </div>
            </div>
          )}
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu md:hidden bg-gradient-to-b from-white to-[hsl(var(--muted))/50] border-t py-4">
            <div className="container mx-auto px-4">
              <div className="flex justify-center mb-6">
                <div className="logo-container rounded-lg p-1">
                  <img 
                    src={logoImage} 
                    alt="Scrumpts Logo" 
                    className="h-20 w-auto animate-float relative z-10"
                  />
                </div>
              </div>
              <nav className="flex flex-col space-y-4">
                <Link href="/shop">
                  <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-dark))] hover:text-[hsl(var(--chocolate-medium))] py-3 px-4 block hover:bg-white rounded-lg transition-all duration-300 shadow-soft hover:shadow-glow">
                    Shop
                  </span>
                </Link>
                <Link href="/collections">
                  <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-dark))] hover:text-[hsl(var(--chocolate-medium))] py-3 px-4 block hover:bg-white rounded-lg transition-all duration-300 shadow-soft hover:shadow-glow">
                    Collections
                  </span>
                </Link>
                <Link href="/about">
                  <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-dark))] hover:text-[hsl(var(--chocolate-medium))] py-3 px-4 block hover:bg-white rounded-lg transition-all duration-300 shadow-soft hover:shadow-glow">
                    About
                  </span>
                </Link>
                <Link href="/learn">
                  <span className="font-medium cursor-pointer text-[hsl(var(--chocolate-dark))] hover:text-[hsl(var(--chocolate-medium))] py-3 px-4 block hover:bg-white rounded-lg transition-all duration-300 shadow-soft hover:shadow-glow">
                    Learn
                  </span>
                </Link>
                
                {!isAuthenticated && (
                  <div className="flex flex-col space-y-3 pt-4 mt-2 border-t border-[hsl(var(--chocolate-light))/20]">
                    <Button 
                      variant="outline" 
                      onClick={() => openAuthModal('login')}
                      className="w-full justify-center py-6 border-2 border-[hsl(var(--chocolate-medium))] text-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-medium))] hover:text-white transition-all duration-300"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => openAuthModal('signup')}
                      className="w-full justify-center py-6 bg-gradient-to-r from-[hsl(var(--chocolate-medium))] to-[hsl(var(--chocolate-dark))] hover:from-[hsl(var(--chocolate-dark))] hover:to-[hsl(var(--chocolate-dark))] text-white shadow-glow"
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
