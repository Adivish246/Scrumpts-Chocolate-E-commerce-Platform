import React, { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShoppingCart } from "@/components/ShoppingCart";
import { AIChat } from "@/components/AIChat";

const CartPage: React.FC = () => {
  // Set page title
  useEffect(() => {
    document.title = "Shopping Cart - Scrumpts";
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-8">
            Your Shopping Cart
          </h1>
          <ShoppingCart />
        </div>
      </main>
      <Footer />
      <AIChat />
    </div>
  );
};

export default CartPage;
