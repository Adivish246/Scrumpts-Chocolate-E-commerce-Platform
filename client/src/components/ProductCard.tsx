import React, { useRef, useEffect } from "react";
import { Link } from "wouter";
import { Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/types";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingBag, Star, Award } from "lucide-react";
import { motion } from "framer-motion";
import { hoverCard } from "@/lib/animations";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItemToCart, isAddingToCart } = useCart();
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Format price
  const price = formatPrice(product.price);

  // GSAP hover effect with enhanced glow
  useEffect(() => {
    if (cardRef.current && imageRef.current) {
      const card = cardRef.current;
      const image = imageRef.current;
      
      // Create hover animation timeline with glow effect
      const tl = gsap.timeline({ paused: true });
      tl.to(card, {
        y: -8,
        boxShadow: "0 15px 30px rgba(101, 67, 33, 0.15), 0 0 20px rgba(239, 176, 83, 0.15)",
        duration: 0.4,
        ease: "power2.out"
      });
      
      tl.to(image, {
        scale: 1.08,
        duration: 0.7,
        ease: "power2.out"
      }, 0);
      
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

  // Feature badge determination
  const getFeatureBadge = () => {
    if (product.bestseller) {
      return {
        text: "BESTSELLER",
        color: "bg-gradient-to-r from-amber-500 to-yellow-500",
        icon: <Award className="h-3 w-3 mr-1" />
      };
    } else if (product.featured) {
      return {
        text: "FEATURED",
        color: "bg-gradient-to-r from-rose-500 to-pink-500",
        icon: <Star className="h-3 w-3 mr-1" />
      };
    }
    return null;
  };

  const badge = getFeatureBadge();

  return (
    <motion.div 
      ref={cardRef}
      className="card-glow product-card bg-white rounded-lg overflow-hidden"
      whileHover="hover"
      whileTap="tap"
      initial="initial"
      variants={hoverCard}
    >
      <Link href={`/product/${product.id}`}>
        <div className="relative image-zoom-container h-64">
          <img 
            ref={imageRef}
            src={product.imageUrl} 
            alt={product.name}
            className="image-zoom w-full h-full object-cover"
          />
          <div className="absolute top-0 right-0 m-2">
            <Button 
              variant="ghost"
              size="icon"
              className="bg-white/80 backdrop-blur-sm hover:bg-white rounded-full shadow-soft hover:shadow-glow transition-all duration-300"
            >
              <Heart className="h-5 w-5 text-[hsl(var(--chocolate-medium))]" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
          </div>
          
          {/* Enhanced badges with glow */}
          {badge && (
            <div className={`premium-badge absolute top-0 left-0 m-2 flex items-center ${badge.color} text-white text-xs font-bold px-3 py-1 animate-glow-pulse`}>
              {badge.icon}
              {badge.text}
            </div>
          )}
          
          {/* Type badge */}
          <div className="absolute bottom-0 right-0 m-2">
            <span className="glass-effect text-xs font-medium px-2 py-1 rounded-full text-[hsl(var(--chocolate-dark))]">
              {product.type}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-display text-lg font-semibold text-[hsl(var(--chocolate-dark))] group-hover:text-glow-subtle">
              {product.name}
            </h3>
            <div className="flex items-center bg-[hsl(var(--muted))] px-2 py-1 rounded-full">
              <Star className="h-4 w-4 text-[hsl(var(--chocolate-accent))] fill-current" />
              <span className="text-sm ml-1 font-medium">{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex justify-between items-center">
            <span className="font-semibold text-lg text-[hsl(var(--chocolate-dark))]">
              {price.formatted}
            </span>
            <Button 
              onClick={handleAddToCart}
              className="btn-glow bg-[hsl(var(--chocolate-medium))] hover:bg-[hsl(var(--chocolate-dark))] text-white rounded-md px-3 py-1 text-sm font-medium transition-all duration-300 hover:shadow-glow"
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
                  <span>Add</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
