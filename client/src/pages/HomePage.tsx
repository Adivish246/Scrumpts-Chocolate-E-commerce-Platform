import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { AIRecommendations } from "@/components/AIRecommendations";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ChocolateMakingProcess } from "@/components/ChocolateMakingProcess";
import { Footer } from "@/components/Footer";
import { AIChat } from "@/components/AIChat";
import { staggerItems, staggeredItem } from "@/lib/animations";

const HomePage: React.FC = () => {
  // Set page title
  useEffect(() => {
    document.title = "Scrumpts - Luxury Chocolate Experience";
    
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Main content wrapped in staggered animation container */}
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={staggerItems}
        className="flex-grow"
      >
        <motion.div variants={staggeredItem}>
          <Hero />
        </motion.div>
        
        <motion.div variants={staggeredItem}>
          <FeaturedCollections />
        </motion.div>
        
        <motion.div variants={staggeredItem}>
          <AIRecommendations />
        </motion.div>
        
        <motion.div variants={staggeredItem}>
          <ProductShowcase />
        </motion.div>
        
        <motion.div variants={staggeredItem}>
          <ChocolateMakingProcess />
        </motion.div>
      </motion.div>
      
      <Footer />
      <AIChat floatingAnimation={true} />
    </div>
  );
};

export default HomePage;
