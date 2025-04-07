import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto py-12">
          <h1 className="text-4xl font-display font-bold mb-6 text-amber-900">
            About Scrumpts
          </h1>
          <p className="text-lg mb-8 text-amber-800">
            Our story, mission, and chocolate crafting philosophy
          </p>
          <div className="bg-amber-50 rounded-lg p-8 border border-amber-200">
            <p className="text-amber-800 mb-4">
              Our about page is coming soon with the full story of our chocolate journey, our team, 
              and our commitment to sustainable and ethical chocolate production.
            </p>
            <p className="text-amber-800">
              Check back soon to learn more about the passion behind Scrumpts!
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;