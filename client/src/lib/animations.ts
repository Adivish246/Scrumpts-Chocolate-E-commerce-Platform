import { gsap } from "gsap";

// Animation for fading in elements
export const fadeIn = (element: HTMLElement, delay: number = 0, duration: number = 0.5) => {
  gsap.fromTo(
    element,
    { opacity: 0 },
    { opacity: 1, duration, delay, ease: "power2.out" }
  );
};

// Animation for sliding up elements
export const slideUp = (element: HTMLElement, delay: number = 0, duration: number = 0.5) => {
  gsap.fromTo(
    element,
    { y: 20, opacity: 0 },
    { y: 0, opacity: 1, duration, delay, ease: "power2.out" }
  );
};

// Animation for staggered children elements
export const staggerChildren = (
  parent: HTMLElement,
  childSelector: string,
  delay: number = 0,
  stagger: number = 0.1
) => {
  const children = parent.querySelectorAll(childSelector);
  gsap.fromTo(
    children,
    { y: 20, opacity: 0 },
    { 
      y: 0, 
      opacity: 1, 
      duration: 0.5, 
      delay, 
      stagger,
      ease: "power2.out" 
    }
  );
};

// Animation for reveal on scroll
export const revealOnScroll = (
  elements: NodeListOf<HTMLElement> | HTMLElement[],
  threshold: number = 0.1
) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          gsap.fromTo(
            entry.target,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }
          );
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold }
  );

  elements.forEach((el) => observer.observe(el));
  
  return observer;
};

// Animation for product card hover effect
export const productCardHover = (card: HTMLElement) => {
  const tl = gsap.timeline({ paused: true });
  
  tl.to(card, {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(45, 30, 18, 0.1)",
    duration: 0.3,
    ease: "power2.out"
  });
  
  card.addEventListener("mouseenter", () => tl.play());
  card.addEventListener("mouseleave", () => tl.reverse());
  
  return () => {
    card.removeEventListener("mouseenter", () => tl.play());
    card.removeEventListener("mouseleave", () => tl.reverse());
  };
};

// Animation for page transitions
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }
  }
};

// Animation for button click
export const buttonClick = (button: HTMLElement) => {
  button.addEventListener("click", () => {
    gsap.to(button, {
      scale: 0.95,
      duration: 0.1,
      onComplete: () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.1
        });
      }
    });
  });
  
  return () => {
    button.removeEventListener("click", () => {});
  };
};

// Animation for showing modal
export const showModal = (modal: HTMLElement, backdrop: HTMLElement) => {
  gsap.set([modal, backdrop], { display: "block", opacity: 0 });
  gsap.to(backdrop, { opacity: 1, duration: 0.3 });
  gsap.fromTo(
    modal,
    { y: -20, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.4, delay: 0.1 }
  );
};

// Animation for hiding modal
export const hideModal = (modal: HTMLElement, backdrop: HTMLElement) => {
  gsap.to(modal, { 
    y: -20, 
    opacity: 0, 
    duration: 0.3,
    onComplete: () => {
      gsap.set([modal, backdrop], { display: "none" });
    }
  });
  gsap.to(backdrop, { opacity: 0, duration: 0.3 });
};
