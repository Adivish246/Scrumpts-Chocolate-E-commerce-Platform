import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FilterOption, SortOption, ProductFilter } from "@/lib/types";
import { motion } from "framer-motion";
import { fadeIn, revealText, staggerItems, staggeredItem } from "@/lib/animations";
import { Filter, SlidersHorizontal, Gift, Coffee, ChevronDown, ChevronUp } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const ProductShowcase: React.FC = () => {
  const { products, filter, updateFilter, isLoading } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState(8);
  const [showFilters, setShowFilters] = useState(true);
  
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const filterOptions: FilterOption[] = [
    { value: '', label: 'All', icon: <Filter className="h-4 w-4 mr-1" /> },
    { value: 'Dark', label: 'Dark', icon: <Coffee className="h-4 w-4 mr-1" /> },
    { value: 'Milk', label: 'Milk', icon: <Coffee className="h-4 w-4 mr-1" /> },
    { value: 'White', label: 'White', icon: <Coffee className="h-4 w-4 mr-1" /> },
    { value: 'Gift Sets', label: 'Gift Sets', icon: <Gift className="h-4 w-4 mr-1" /> }
  ];

  const sortOptions: SortOption[] = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest' }
  ];

  // GSAP animations with enhanced effects
  useEffect(() => {
    if (sectionRef.current && headingRef.current && filtersRef.current && productsRef.current) {
      // Animate heading with enhanced glow
      gsap.fromTo(
        headingRef.current.children,
        { 
          opacity: 0, 
          y: 20,
          filter: "blur(5px)"
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.15,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          }
        }
      );

      // Add subtle glow effect to heading
      gsap.fromTo(
        headingRef.current.querySelector('h2'),
        { 
          textShadow: "0px 0px 0px rgba(239, 176, 83, 0)"
        },
        { 
          textShadow: "0px 0px 10px rgba(239, 176, 83, 0.25)",
          duration: 1.2,
          delay: 0.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 85%',
          }
        }
      );

      // Animate filters with staggered blur effect
      gsap.fromTo(
        filtersRef.current.children,
        { 
          opacity: 0, 
          y: 20,
          filter: "blur(4px)",
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.6,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: filtersRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate products with staggered appearance and shadows
      if (productsRef.current.children.length > 0) {
        gsap.fromTo(
          productsRef.current.children,
          { 
            opacity: 0, 
            y: 40,
            scale: 0.95,
            boxShadow: "0px 0px 0px rgba(0,0,0,0)",
            filter: "blur(5px) brightness(0.9)"
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            boxShadow: "0px 10px 25px -5px rgba(101, 67, 33, 0.08)",
            filter: "blur(0px) brightness(1)",
            duration: 0.8,
            stagger: {
              each: 0.09,
              grid: [4, 2],
              from: "center"
            },
            ease: "power2.out",
            scrollTrigger: {
              trigger: productsRef.current,
              start: 'top 75%',
            }
          }
        );
      }
    }
  }, [products, showFilters]);

  const handleFilterChange = (type: string) => {
    updateFilter({ type: type || undefined });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFilter({ sort: e.target.value as ProductFilter['sort'] });
  };

  const loadMoreProducts = () => {
    setVisibleProducts(prev => prev + 4);
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <motion.section 
      id="shop" 
      ref={sectionRef} 
      className="py-16 bg-gradient-to-b from-white to-[hsl(var(--muted))/30]"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          ref={headingRef} 
          className="text-center mb-12"
          variants={staggerItems}
        >
          <motion.h2 
            className="glow-title font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-4"
            variants={revealText}
          >
            Our Exquisite Chocolates
          </motion.h2>
          <motion.p 
            className="text-[hsl(var(--chocolate-medium))] max-w-2xl mx-auto"
            variants={revealText}
          >
            Explore our handcrafted treasures made with premium ingredients and traditional artisanal techniques.
          </motion.p>
        </motion.div>
        
        {/* Filter Toggle for Mobile */}
        <div className="md:hidden mb-4">
          <Button
            onClick={toggleFilters}
            variant="outline"
            className="w-full flex items-center justify-between border-2 border-[hsl(var(--chocolate-light))] text-[hsl(var(--chocolate-dark))]"
          >
            <span className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filters & Sorting
            </span>
            {showFilters ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Filter and Sort */}
        <div 
          ref={filtersRef} 
          className={`flex flex-col md:flex-row justify-between items-center mb-8 gap-4 transition-all duration-500 ease-in-out ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden md:max-h-96 md:opacity-100'}`}
        >
          <div className="flex flex-wrap gap-2">
            {filterOptions.map(option => (
              <Button 
                key={option.value}
                variant={filter.type === option.value || (option.value === '' && !filter.type) ? "default" : "outline"}
                onClick={() => handleFilterChange(option.value)}
                className={filter.type === option.value || (option.value === '' && !filter.type) 
                  ? "chocolate-button flex items-center text-white shadow-glow" 
                  : "bg-white hover:bg-[hsl(var(--muted))] text-[hsl(var(--chocolate-medium))] border border-[hsl(var(--border))] flex items-center hover:shadow-glow transition-all duration-300"}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="flex items-center">
            <label className="mr-2 text-[hsl(var(--chocolate-medium))] font-medium">Sort by:</label>
            <select 
              className="glass-effect px-4 py-2 rounded-md text-[hsl(var(--chocolate-dark))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--chocolate-accent))] bg-white/80 backdrop-blur-sm border border-[hsl(var(--border))]"
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
            // Enhanced skeleton loaders with glow
            Array(8).fill(0).map((_, index) => (
              <motion.div 
                key={index} 
                className="card-glow bg-white rounded-lg overflow-hidden"
                variants={staggeredItem}
                initial="initial"
                animate="animate"
              >
                <div className="h-64 bg-gradient-to-b from-gray-100 to-gray-200">
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
              </motion.div>
            ))
          ) : products.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-10 glass-effect rounded-lg p-8"
              variants={fadeIn}
            >
              <h3 className="text-xl font-display font-semibold mb-4 text-[hsl(var(--chocolate-dark))]">No chocolates found</h3>
              <p className="text-[hsl(var(--chocolate-medium))] mb-6">
                Try changing your filter or search criteria to discover our delicious treats.
              </p>
              <Button 
                onClick={() => updateFilter({ type: undefined, sort: 'popularity' })}
                className="chocolate-button text-white shadow-glow"
              >
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </motion.div>
          ) : (
            products.slice(0, visibleProducts).map(product => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        
        {/* Enhanced Load More Button */}
        {!isLoading && products.length > visibleProducts && (
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Button 
              onClick={loadMoreProducts}
              className="btn-glow bg-gradient-to-r from-[hsl(var(--chocolate-medium))] to-[hsl(var(--chocolate-dark))] text-white font-medium px-8 py-3 h-12 rounded-md shadow-glow"
            >
              <span>Load More Treats</span>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
