// Types for formatting and displaying data in the UI

export type PriceDisplay = {
  raw: number;
  formatted: string;
};

export type ProductFilter = {
  category?: string;
  type?: string;
  sort?: 'popularity' | 'price-asc' | 'price-desc' | 'newest';
};

export type SortOption = {
  value: string;
  label: string;
};

export type FilterOption = {
  value: string;
  label: string;
};

// Cart and Checkout Types
export type CartItemDisplay = {
  id: number;
  productId: number;
  name: string;
  price: PriceDisplay;
  quantity: number;
  imageUrl: string;
  total: PriceDisplay;
};

export type CartSummary = {
  subtotal: PriceDisplay;
  shipping: PriceDisplay;
  tax: PriceDisplay;
  total: PriceDisplay;
  itemCount: number;
};

export type PaymentMethod = 'upi' | 'paypal' | 'card';

// User Preferences
export type UserPreferences = {
  favoriteTypes: string[];
  dietaryRestrictions: string[];
  flavorPreferences: string[];
  occasions: string[];
};

// Chat Types
export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

// Helper functions
export const formatPrice = (priceInPaise: number): PriceDisplay => {
  const rawInRupees = priceInPaise / 100;
  return {
    raw: rawInRupees,
    formatted: `₹${rawInRupees.toLocaleString('en-IN')}`
  };
};

export const calculateCartSummary = (items: CartItemDisplay[]): CartSummary => {
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotalInPaise = items.reduce((acc, item) => acc + (item.price.raw * 100 * item.quantity), 0);
  const shippingInPaise = subtotalInPaise > 100000 ? 0 : 9900; // Free shipping over ₹1000
  const taxInPaise = Math.round(subtotalInPaise * 0.18); // 18% GST
  const totalInPaise = subtotalInPaise + shippingInPaise + taxInPaise;
  
  return {
    subtotal: formatPrice(subtotalInPaise),
    shipping: formatPrice(shippingInPaise),
    tax: formatPrice(taxInPaise),
    total: formatPrice(totalInPaise),
    itemCount
  };
};

export const formatDateTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
