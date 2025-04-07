import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const ShopPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-6 text-amber-900">
            Our Chocolate Shop
          </h1>
          <p className="text-lg mb-8 text-amber-800">
            Explore our delicious selection of handcrafted chocolates
          </p>
          <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
            <p className="text-amber-800 mb-4">
              Our shop page is coming soon with a complete catalog of our finest chocolate creations.
            </p>
            <p className="text-amber-800">
              Please check back later for our full selection of chocolate delights!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ShopPage;