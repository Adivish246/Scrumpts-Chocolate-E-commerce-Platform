import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const CollectionsPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-6 text-amber-900">
            Chocolate Collections
          </h1>
          <p className="text-lg mb-8 text-amber-800">
            Discover our special curated chocolate collections
          </p>
          <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
            <p className="text-amber-800 mb-4">
              Our collections page is coming soon featuring our seasonal, limited edition, and gift box collections.
            </p>
            <p className="text-amber-800">
              Check back soon to discover our artisanal chocolate collections!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionsPage;