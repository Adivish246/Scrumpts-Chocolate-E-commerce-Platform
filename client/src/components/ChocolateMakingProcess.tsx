import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Leaf, Flame, Utensils, Sparkles, Play } from "lucide-react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type ProcessStep = {
  icon: React.ReactNode;
  title: string;
  description: string;
  number: number;
};

export const ChocolateMakingProcess: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  const processSteps: ProcessStep[] = [
    {
      icon: <Leaf className="text-white text-3xl" />,
      title: "Bean Selection",
      description: "We source premium cacao beans from sustainable farms across the globe.",
      number: 1
    },
    {
      icon: <Flame className="text-white text-3xl" />,
      title: "Roasting",
      description: "Careful roasting to develop complex flavor profiles unique to each origin.",
      number: 2
    },
    {
      icon: <Utensils className="text-white text-3xl" />,
      title: "Conching",
      description: "Extended conching for incredibly smooth texture and flavor development.",
      number: 3
    },
    {
      icon: <Sparkles className="text-white text-3xl" />,
      title: "Artisanal Finishing",
      description: "Hand-finished by our master chocolatiers with unique decorations.",
      number: 4
    }
  ];

  useEffect(() => {
    if (sectionRef.current && headingRef.current && stepsRef.current) {
      // Animate section heading
      gsap.fromTo(
        headingRef.current.children,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          scrollTrigger: {
            trigger: headingRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate process steps
      gsap.fromTo(
        stepsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.2,
          scrollTrigger: {
            trigger: stepsRef.current,
            start: 'top 75%',
          }
        }
      );
    }
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-[hsl(var(--chocolate-cream))] bg-opacity-20">
      <div className="container mx-auto px-4">
        <div ref={headingRef} className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[hsl(var(--chocolate-dark))] mb-4">
            Our Chocolate-Making Process
          </h2>
          <p className="text-[hsl(var(--chocolate-medium))] max-w-2xl mx-auto">
            From bean to bar, discover how we craft our exquisite chocolates using traditional methods and modern innovation.
          </p>
        </div>
        
        <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="relative mb-6 mx-auto w-24 h-24 rounded-full bg-[hsl(var(--chocolate-medium))] flex items-center justify-center">
                {step.icon}
                <div className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-[hsl(var(--chocolate-accent))] flex items-center justify-center text-white font-bold">
                  {step.number}
                </div>
              </div>
              <h3 className="font-display font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-[hsl(var(--chocolate-medium))] text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="link" 
                className="inline-flex items-center text-[hsl(var(--chocolate-dark))] font-semibold hover:text-[hsl(var(--chocolate-accent))] transition duration-300"
              >
                <span>Watch our chocolate-making video</span>
                <Play className="ml-2 h-5 w-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-lg">Video would play here</p>
                  <p className="text-sm opacity-70">Our master chocolatiers crafting premium chocolates</p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};
