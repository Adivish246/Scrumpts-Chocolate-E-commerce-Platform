import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterOption, SortOption, ProductFilter } from "@/lib/types";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const ProductShowcase: React.FC = () => {
  const { products, filter, updateFilter, isLoading } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState(8);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const filterOptions: FilterOption[] = [
    { value: '', label: 'All' },
    { value: 'Dark', label: 'Dark' },
    { value: 'Milk', label: 'Milk' },
    { value: 'White', label: 'White' },
    { value: 'Gift Sets', label: 'Gift Sets' }
  ];

  const sortOptions: SortOption[] = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' }
  ];

  // GSAP animations
  useEffect(() => {
    if (sectionRef.current && headingRef.current && filtersRef.current && productsRef.current) {
      // Animate heading
      gsap.fromTo(
        headingRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate filters
      gsap.fromTo(
        filtersRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate products
      if (productsRef.current.children.length > 0) {
        gsap.fromTo(
          productsRef.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            scrollTrigger: {
              trigger: productsRef.current,
              start: 'top 70%',
            }
          }
        );
      }
    }
  }, [products]);

  const handleFilterChange = (type: string) => {
    updateFilter({ type: type || undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter({ sort: e.target.value as ProductFilter['sort'] });
  };

  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 4);
  };

  return (
    <section id="shop" ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-4">
            Our Chocolates
          </h2>
          <p className="text-[hsl(var(--chocolate-medium))] max-w-2xl mx-auto">
            Explore our handcrafted chocolates made with premium ingredients and artisanal techniques.
          </p>
        </div>
        
        {/* Filter and Sort */}
        <div ref={filtersRef} className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <Button 
                key={option.value}
                variant={filter.type === option.value || (option.value === '' && !filter.type) ? "default" : "outline"}
                onClick={() => handleFilterChange(option.value)}
                className={filter.type === option.value || (option.value === '' && !filter.type) 
                  ? "bg-[hsl(var(--chocolate-dark))] text-white" 
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-[hsl(var(--chocolate-medium))]">Sort by:</label>
            <select 
              className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--chocolate-accent))] bg-white"
              value={filter.sort || 'popularity'}
              onChange={handleSortChange}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Product Grid */}
        <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
          {isLoading ? (
            // Skeleton loaders
            Array(8).fill(0).map((_, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="h-64 bg-gray-200">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-8 w-1/3" />
                  </div>
                </div>
              </div>
            ))
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <h3 className="text-xl font-medium mb-2">No chocolates found</h3>
              <p className="text-gray-500 mb-4">
                Try changing your filter or search criteria.
              </p>
              <Button 
                onClick={() => updateFilter({ type: undefined, sort: 'popularity' })}
                className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            products.slice(0, visibleProducts).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        {/* Load More Button */}
        {!isLoading && products.length > visibleProducts && (
          <div className="text-center">
            <Button 
              onClick={loadMoreProducts}
              variant="outline"
              className="border-2 border-[hsl(var(--chocolate-dark))] text-[hsl(var(--chocolate-dark))] hover:bg-[hsl(var(--chocolate-dark))] hover:text-white font-semibold px-8 py-3 h-12"
            >
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
