import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from './AuthContext';
import { formatPrice, calculateCartSummary, type CartItemDisplay, type CartSummary } from '@/lib/types';
import { CartItem, Product } from '@shared/schema';

interface CartContextType {
  cartItems: CartItemDisplay[];
  cartSummary: CartSummary;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  removeItem: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartSummary: {
    subtotal: { raw: 0, formatted: '₹0' },
    shipping: { raw: 0, formatted: '₹0' },
    tax: { raw: 0, formatted: '₹0' },
    total: { raw: 0, formatted: '₹0' },
    itemCount: 0
  },
  loading: true,
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  clearCart: async () => {}
});

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItemDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Calculate cart summary
  const cartSummary = calculateCartSummary(cartItems);

  // Fetch cart items whenever the user changes
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!currentUser) {
        setCartItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await apiRequest('GET', `/api/cart/${currentUser.uid}`);
        const items: (CartItem & { product: Product })[] = await response.json();
        
        // Transform to CartItemDisplay format
        const displayItems: CartItemDisplay[] = items.map(item => ({
          id: item.id,
          productId: item.productId,
          name: item.product.name,
          price: formatPrice(item.product.price),
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
          total: formatPrice(item.product.price * item.quantity)
        }));
        
        setCartItems(displayItems);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast({
          title: 'Cart Error',
          description: 'Failed to load your shopping cart',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [currentUser, toast]);

  // Add item to cart
  const addToCart = async (productId: number, quantity: number) => {
    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to add items to your cart',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiRequest('POST', '/api/cart', {
        userId: currentUser.uid,
        productId,
        quantity
      });
      
      // Get product details
      const productResponse = await apiRequest('GET', `/api/products/${productId}`);
      const product: Product = await productResponse.json();
      
      // Get the newly created cart item
      const cartItem: CartItem = await response.json();
      
      // Add to local state
      const newItem: CartItemDisplay = {
        id: cartItem.id,
        productId: cartItem.productId,
        name: product.name,
        price: formatPrice(product.price),
        quantity: cartItem.quantity,
        imageUrl: product.imageUrl,
        total: formatPrice(product.price * cartItem.quantity)
      };
      
      // Check if item already exists in cart
      const existingItemIndex = cartItems.findIndex(item => item.productId === productId);
      
      if (existingItemIndex >= 0) {
        // Update existing item
        const updatedItems = [...cartItems];
        updatedItems[existingItemIndex] = newItem;
        setCartItems(updatedItems);
      } else {
        // Add new item
        setCartItems([...cartItems, newItem]);
      }
      
      toast({
        title: 'Added to Cart',
        description: `${product.name} added to your cart`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Cart Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Update quantity of cart item
  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      setLoading(true);
      await apiRequest('PATCH', `/api/cart/${cartItemId}`, { quantity });
      
      // Update local state
      const updatedItems = cartItems.map(item => {
        if (item.id === cartItemId) {
          return {
            ...item,
            quantity,
            total: formatPrice(item.price.raw * 100 * quantity)
          };
        }
        return item;
      });
      
      setCartItems(updatedItems);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Cart Error',
        description: 'Failed to update item quantity',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId: number) => {
    try {
      setLoading(true);
      await apiRequest('DELETE', `/api/cart/${cartItemId}`);
      
      // Update local state
      const updatedItems = cartItems.filter(item => item.id !== cartItemId);
      setCartItems(updatedItems);
      
      toast({
        title: 'Item Removed',
        description: 'Item removed from your cart',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Cart Error',
        description: 'Failed to remove item from cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      await apiRequest('DELETE', `/api/cart/user/${currentUser.uid}`);
      
      // Update local state
      setCartItems([]);
      
      toast({
        title: 'Cart Cleared',
        description: 'All items removed from your cart',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Cart Error',
        description: 'Failed to clear your cart',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartSummary,
        loading,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
