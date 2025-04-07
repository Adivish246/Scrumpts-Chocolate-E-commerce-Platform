import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const LearnPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-6 text-amber-900">
            Learn About Chocolate
          </h1>
          <p className="text-lg mb-8 text-amber-800">
            Discover the art and science of chocolate making
          </p>
          <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
            <p className="text-amber-800 mb-4">
              Our learning center is coming soon with educational content about chocolate origins, 
              production processes, tasting techniques, and more.
            </p>
            <p className="text-amber-800">
              Check back soon to enhance your chocolate knowledge and appreciation!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LearnPage;