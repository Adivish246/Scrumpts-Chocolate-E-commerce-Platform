// Animation variants for various components
import { Variants } from 'framer-motion';

// Fade in animation
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.6,
      ease: 'easeInOut'
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeInOut'
    }
  }
};

// Slide up animation
export const slideUp: Variants = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  },
  exit: { 
    opacity: 0, 
    y: 30,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  },
  exit: { 
    opacity: 0, 
    x: -40,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { 
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  },
  exit: { 
    opacity: 0, 
    x: 40,
    transition: { 
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1.0] 
    }
  }
};

// Pop up animation
export const popUp: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: 0.4,
      ease: [0.175, 0.885, 0.32, 1.275] // Custom easing for pop effect
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { 
      duration: 0.3,
      ease: 'easeInOut'
    }
  }
};

// Staggered animation for lists
export const staggerItems = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.08
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

// For individual staggered items
export const staggeredItem: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.4,
      ease: 'easeOut'
    }
  },
  exit: { 
    opacity: 0, 
    y: 15,
    transition: { 
      duration: 0.3,
      ease: 'easeIn'
    }
  }
};

// Chocolate-themed animation (for special elements)
export const chocolateDrip: Variants = {
  initial: { 
    opacity: 0, 
    y: -20,
    scaleY: 0.8 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scaleY: 1,
    transition: { 
      duration: 0.7,
      ease: [0.33, 1, 0.68, 1] // Custom ease that feels like dripping chocolate
    }
  },
  exit: { 
    opacity: 0, 
    y: 20,
    transition: { 
      duration: 0.4,
      ease: 'easeIn'
    }
  }
};