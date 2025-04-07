import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Setup GSAP animations
    if (heroRef.current && headingRef.current && paragraphRef.current && buttonsRef.current) {
      // Create timeline for hero section animations
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      
      tl.fromTo(
        headingRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
      .fromTo(
        paragraphRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.4' // Start slightly before previous animation finishes
      )
      .fromTo(
        buttonsRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.2 },
        '-=0.4'
      );
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      className="hero-gradient text-white py-24 min-h-[500px] flex items-center"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-2xl">
          <h1 
            ref={headingRef}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            Indulge in Extraordinary Chocolate Experiences
          </h1>
          
          <p 
            ref={paragraphRef}
            className="text-lg md:text-xl mb-8 opacity-90"
          >
            Handcrafted luxury chocolates with premium ingredients and a touch of AI-powered personalization.
          </p>
          
          <div 
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/shop">
              <Button 
                size="lg"
                className="bg-[hsl(var(--chocolate-accent))] hover:bg-opacity-90 text-[hsl(var(--chocolate-dark))] font-semibold transition duration-300 h-12 px-8"
              >
                Shop Now
              </Button>
            </Link>
            
            <Link href="#ai-chat">
              <Button 
                variant="outline"
                size="lg"
                className="border border-white hover:bg-white hover:text-[hsl(var(--chocolate-dark))] text-white font-semibold transition duration-300 h-12 px-8"
              >
                AI Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
