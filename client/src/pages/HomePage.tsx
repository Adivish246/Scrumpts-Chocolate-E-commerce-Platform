import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { AIRecommendations } from "@/components/AIRecommendations";
import { ProductShowcase } from "@/components/ProductShowcase";
import { ChocolateMakingProcess } from "@/components/ChocolateMakingProcess";
import { Footer } from "@/components/Footer";
import { AIChat } from "@/components/AIChat";

const HomePage: React.FC = () => {
  // Set page title
  useEffect(() => {
    document.title = "Scrumpts - Luxury Chocolate Experience";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <FeaturedCollections />
      <AIRecommendations />
      <ProductShowcase />
      <ChocolateMakingProcess />
      <Footer />
      <AIChat />
    </div>
  );
};

export default HomePage;
