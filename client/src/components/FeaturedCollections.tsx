import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { useCollections } from '@/hooks/useProducts';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export const FeaturedCollections: React.FC = () => {
  const { collections, isLoading } = useCollections();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const collectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current && headingRef.current && collectionsRef.current) {
      // Animate heading
      gsap.fromTo(
        headingRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate collection cards
      gsap.fromTo(
        collectionsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          scrollTrigger: {
            trigger: collectionsRef.current,
            start: 'top 70%',
          }
        }
      );
    }
  }, [collections]);

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-4">
            Our Collections
          </h2>
          <p className="text-[hsl(var(--chocolate-medium))] max-w-2xl mx-auto">
            Discover our exquisite chocolate collections, each handcrafted with care and premium ingredients.
          </p>
        </div>
        
        <div ref={collectionsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loaders for collections
            Array(3).fill(0).map((_, index) => (
              <div key={index} className="relative overflow-hidden rounded-lg h-[350px] bg-gray-100">
                <Skeleton className="w-full h-full" />
                <div className="absolute bottom-0 left-0 p-6 w-full">
                  <Skeleton className="h-8 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))
          ) : (
            // Actual collections
            collections.map((collection) => (
              <div key={collection.id} className="relative overflow-hidden rounded-lg group h-[350px]">
                <img 
                  src={collection.imageUrl} 
                  alt={collection.name} 
                  className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(var(--chocolate-dark))] opacity-70"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white z-10">
                  <h3 className="font-display text-2xl font-semibold mb-2">{collection.name}</h3>
                  <p className="mb-4 opacity-90">{collection.description}</p>
                  <Link href={`/collections/${collection.id}`}>
                    <a className="inline-flex items-center text-[hsl(var(--chocolate-accent))] hover:underline font-medium">
                      Explore <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
