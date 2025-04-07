import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useProducts } from '@/hooks/useProducts';
import { ProductCard } from '@/components/ProductCard';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product } from '@shared/schema';

// Types for filters
type FilterState = {
  category: string;
  type: string;
  priceRange: [number, number];
  vegetarian: boolean;
  search: string;
};

// Sort options
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'rating-desc';

const ShopPage: React.FC = () => {
  // Categories and types for filter options
  const categories = ['All', 'Truffles', 'Pralines', 'Bars', 'Bonbons', 'Gift Sets'];
  const types = ['All', 'Dark', 'Milk', 'White', 'Assorted'];

  // State for filters, sort, and mobile filter visibility
  const [filters, setFilters] = useState<FilterState>({
    category: 'All',
    type: 'All',
    priceRange: [0, 2000],
    vegetarian: false,
    search: '',
  });
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Get products using the custom hook
  const { products, isLoading, error } = useProducts();

  // Apply filters and sorting
  const filteredAndSortedProducts = React.useMemo(() => {
    if (!products) return [];

    // Apply filters
    let result = [...products];

    // Category filter
    if (filters.category !== 'All') {
      result = result.filter(p => p.category === filters.category);
    }

    // Type filter
    if (filters.type !== 'All') {
      result = result.filter(p => p.type === filters.type);
    }

    // Price range filter (prices stored in paise)
    result = result.filter(p => 
      p.price >= filters.priceRange[0] * 100 && 
      p.price <= filters.priceRange[1] * 100
    );

    // Vegetarian filter
    if (filters.vegetarian) {
      result = result.filter(p => p.vegetarian);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchLower) || 
        p.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return result.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating-desc':
        return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'featured':
      default:
        return result.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, filters, sortBy]);

  // Format price for display (convert paise to rupees with commas)
  const formatPrice = (price: number) => {
    return `₹${(price / 100).toLocaleString('en-IN')}`;
  };

  // Handler for price range changes
  const handlePriceChange = (value: number[]) => {
    setFilters({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      category: 'All',
      type: 'All',
      priceRange: [0, 2000],
      vegetarian: false,
      search: '',
    });
    setSortBy('featured');
  };

  // Handle search input
  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const searchTerm = formData.get('searchQuery') as string;
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-6 text-amber-900">
            Our Chocolate Shop
          </h1>
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Mobile filters toggle */}
            <div className="md:hidden mb-4">
              <Button 
                variant="outline" 
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>

            {/* Search bar */}
            <div className="w-full mb-6">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    name="searchQuery"
                    placeholder="Search for chocolates..." 
                    className="pl-9 bg-white"
                    defaultValue={filters.search}
                  />
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - desktop sidebar & mobile dropdown */}
            <div className={`md:w-1/4 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-amber-900">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={resetFilters} className="text-amber-700">
                    Reset
                  </Button>
                  
                  {/* Close button for mobile */}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden" 
                    onClick={() => setShowMobileFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Category filter */}
                  <div>
                    <Label htmlFor="category" className="block mb-2 text-amber-900">
                      Category
                    </Label>
                    <Select 
                      value={filters.category} 
                      onValueChange={(value) => setFilters({...filters, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type filter */}
                  <div>
                    <Label htmlFor="type" className="block mb-2 text-amber-900">
                      Chocolate Type
                    </Label>
                    <Select 
                      value={filters.type} 
                      onValueChange={(value) => setFilters({...filters, type: value})}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price range filter */}
                  <div>
                    <Label className="block mb-2 text-amber-900">
                      Price Range (₹)
                    </Label>
                    <div className="pt-6 pb-2">
                      <Slider
                        defaultValue={[0, 2000]}
                        max={2000}
                        step={50}
                        value={filters.priceRange}
                        onValueChange={handlePriceChange}
                        className="mb-3"
                      />
                      <div className="flex justify-between text-sm text-amber-700">
                        <span>₹{filters.priceRange[0]}</span>
                        <span>₹{filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>

                  {/* Vegetarian filter */}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="vegetarian" 
                      checked={filters.vegetarian} 
                      onCheckedChange={(checked) => 
                        setFilters({...filters, vegetarian: checked === true})
                      }
                    />
                    <Label htmlFor="vegetarian" className="text-amber-900">
                      Vegetarian Only
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            {/* Product display area */}
            <div className="md:w-3/4">
              {/* Sort options */}
              <div className="mb-6 flex justify-between items-center">
                <p className="text-amber-800">
                  Showing {filteredAndSortedProducts.length} products
                </p>
                <div className="flex items-center">
                  <span className="mr-2 text-amber-900">Sort by:</span>
                  <Select 
                    value={sortBy} 
                    onValueChange={(value) => setSortBy(value as SortOption)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-asc">Price: Low to High</SelectItem>
                      <SelectItem value="price-desc">Price: High to Low</SelectItem>
                      <SelectItem value="name-asc">Name: A-Z</SelectItem>
                      <SelectItem value="name-desc">Name: Z-A</SelectItem>
                      <SelectItem value="rating-desc">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Display products or loading state */}
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-900"></div>
                </div>
              ) : error ? (
                <div className="text-center p-12">
                  <p className="text-red-600 mb-4">Error loading products</p>
                  <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="text-center py-12 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-800 mb-4">No products match your filters</p>
                  <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;