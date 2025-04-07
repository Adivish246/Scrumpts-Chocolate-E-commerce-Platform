import React, { useRef, useEffect } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/types";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItemToCart, isAddingToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);

  // Format price
  const price = formatPrice(product.price);

  // GSAP hover effect
  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;
      
      // Create hover animation timeline
      const tl = gsap.timeline({ paused: true });
      tl.to(card, {
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(45, 30, 18, 0.1)",
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Add event listeners
      const handleMouseEnter = () => tl.play();
      const handleMouseLeave = () => tl.reverse();
      
      card.addEventListener("mouseenter", handleMouseEnter);
      card.addEventListener("mouseleave", handleMouseLeave);
      
      // Cleanup event listeners
      return () => {
        card.removeEventListener("mouseenter", handleMouseEnter);
        card.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, []);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product.id);
  };

  return (
    <div 
      ref={cardRef}
      className="product-card bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300"
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative h-64 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-0 right-0 m-2">
            <Button 
              variant="ghost"
              size="icon"
              className="bg-white hover:bg-gray-100 rounded-full shadow-sm"
            >
              <Heart className="h-5 w-5 text-[hsl(var(--chocolate-medium))]" />
            </Button>
          </div>
          
          {/* Badges */}
          {product.bestseller && (
            <div className="absolute top-0 left-0 bg-[hsl(var(--chocolate-accent))] text-white text-xs font-bold px-3 py-1">
              BESTSELLER
            </div>
          )}
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-lg font-semibold text-[hsl(var(--chocolate-dark))]">
              {product.name}
            </h3>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-[hsl(var(--chocolate-accent))] fill-current" />
              <span className="text-sm ml-1">{product.rating.toFixed(1)}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-lg">
              {price.formatted}
            </span>
            <Button 
              onClick={handleAddToCart}
              className="bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white rounded-md px-3 py-1 text-sm font-medium transition duration-300"
              disabled={isAddingToCart[product.id]}
            >
              {isAddingToCart[product.id] ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4 mr-1" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
