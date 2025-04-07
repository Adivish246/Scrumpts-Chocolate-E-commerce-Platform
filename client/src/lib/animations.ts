// Animation variants for various components
import { Variants } from 'framer-motion';

// Enhanced fade in animation with glow
export const fadeIn: Variants = {
  initial: { 
    opacity: 0,
    filter: 'blur(8px)'
  },
  animate: { 
    opacity: 1,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.7,
      ease: 'easeInOut'
    }
  },
  exit: { 
    opacity: 0,
    filter: 'blur(8px)',
    transition: { 
      duration: 0.5,
      ease: 'easeInOut'
    }
  }
};

// Enhanced slide up animation with shadow
export const slideUp: Variants = {
  initial: { 
    opacity: 0, 
    y: 40,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    boxShadow: '0px 15px 25px rgba(0,0,0,0.1)',
    transition: { 
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      boxShadow: {
        duration: 0.8,
        delay: 0.2
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: 30,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

// Enhanced slide in from left with shadow and scale
export const slideInLeft: Variants = {
  initial: { 
    opacity: 0, 
    x: -60, 
    scale: 0.95,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)'
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.12)',
    transition: { 
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      scale: {
        duration: 0.6
      },
      boxShadow: {
        duration: 0.8,
        delay: 0.2
      }
    }
  },
  exit: { 
    opacity: 0, 
    x: -40,
    scale: 0.95,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

// Enhanced slide in from right with shadow
export const slideInRight: Variants = {
  initial: { 
    opacity: 0, 
    x: 60, 
    scale: 0.95,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)'
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    boxShadow: '0px 10px 30px rgba(0,0,0,0.12)',
    transition: { 
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
      scale: {
        duration: 0.6
      },
      boxShadow: {
        duration: 0.8,
        delay: 0.2
      }
    }
  },
  exit: { 
    opacity: 0, 
    x: 40,
    scale: 0.95,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    transition: { 
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

// Enhanced pop up animation with glow effect
export const popUp: Variants = {
  initial: { 
    opacity: 0, 
    scale: 0.85,
    filter: 'brightness(0.8) blur(4px)'
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    filter: 'brightness(1) blur(0px)',
    transition: { 
      duration: 0.5,
      ease: [0.175, 0.885, 0.32, 1.275], // Custom easing for pop effect
      filter: {
        duration: 0.7,
        delay: 0.1
      }
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    filter: 'brightness(0.8) blur(4px)',
    transition: { 
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

// Enhanced staggered animation for lists with scale
export const staggerItems = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Enhanced individual staggered items with shadow and transform
export const staggeredItem: Variants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.97,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    filter: 'brightness(0.9)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    boxShadow: '0px 8px 20px rgba(0,0,0,0.09)',
    filter: 'brightness(1)',
    transition: { 
      duration: 0.6,
      ease: 'easeOut',
      scale: {
        duration: 0.7
      },
      boxShadow: {
        duration: 0.8,
        delay: 0.1
      },
      filter: {
        duration: 0.5
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: 15,
    scale: 0.97,
    boxShadow: '0px 0px 0px rgba(0,0,0,0)',
    filter: 'brightness(0.9)',
    transition: { 
      duration: 0.4,
      ease: 'easeIn'
    }
  }
};

// Enhanced chocolate drip animation with glow effect
export const chocolateDrip: Variants = {
  initial: { 
    opacity: 0, 
    y: -30,
    scaleY: 0.7,
    filter: 'brightness(0.8) drop-shadow(0px 0px 0px rgba(101, 67, 33, 0))'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scaleY: 1,
    filter: 'brightness(1.05) drop-shadow(0px 15px 20px rgba(101, 67, 33, 0.35))',
    transition: { 
      duration: 0.9,
      ease: [0.33, 1, 0.68, 1], // Custom ease that feels like dripping chocolate
      filter: {
        duration: 1.1,
        delay: 0.2
      }
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    filter: 'brightness(0.8) drop-shadow(0px 0px 0px rgba(101, 67, 33, 0))',
    transition: { 
      duration: 0.5,
      ease: 'easeIn'
    }
  }
};

// New hover effect for cards
export const hoverCard: Variants = {
  initial: {
    boxShadow: '0px 4px 15px rgba(0,0,0,0.08)',
    y: 0,
    scale: 1
  },
  hover: {
    boxShadow: '0px 20px 30px rgba(0,0,0,0.15)',
    y: -5,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut'
    }
  },
  tap: {
    scale: 0.98,
    boxShadow: '0px 10px 15px rgba(0,0,0,0.1)',
    transition: {
      duration: 0.15
    }
  }
};

// New glow pulse animation
export const glowPulse: Variants = {
  initial: {
    boxShadow: '0px 0px 0px rgba(120, 65, 20, 0)',
    filter: 'brightness(1)'
  },
  animate: {
    boxShadow: [
      '0px 0px 0px rgba(120, 65, 20, 0)',
      '0px 0px 25px rgba(120, 65, 20, 0.5)',
      '0px 0px 0px rgba(120, 65, 20, 0)'
    ],
    filter: [
      'brightness(1)',
      'brightness(1.15)',
      'brightness(1)'
    ],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut'
    }
  }
};

// New reveal text animation with blur
export const revealText: Variants = {
  initial: {
    y: 20,
    opacity: 0,
    filter: 'blur(10px)'
  },
  animate: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// New shimmer effect for premium elements
export const shimmer: Variants = {
  initial: {
    backgroundPosition: '0% 0%'
  },
  animate: {
    backgroundPosition: '100% 0%',
    transition: {
      repeat: Infinity,
      repeatType: 'mirror',
      duration: 2,
      ease: 'linear'
    }
  }
};