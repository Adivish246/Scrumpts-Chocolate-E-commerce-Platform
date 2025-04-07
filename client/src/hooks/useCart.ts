import { useCart as useCartContext } from '@/context/CartContext';
import { useToast } from './use-toast';
import { useState } from 'react';

export const useCart = () => {
  const { 
    cartItems, 
    cartSummary, 
    loading, 
    addToCart, 
    updateQuantity, 
    removeItem, 
    clearCart 
  } = useCartContext();
  
  const [isAddingToCart, setIsAddingToCart] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  // Add to cart with loading state per product
  const addItemToCart = async (productId: number, quantity: number = 1) => {
    setIsAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      await addToCart(productId, quantity);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not add item to cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Update quantity with validation
  const updateItemQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      toast({
        title: 'Invalid quantity',
        description: 'Quantity must be at least 1',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not update item quantity. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Check if product is in cart
  const isInCart = (productId: number) => {
    return cartItems.some(item => item.productId === productId);
  };

  // Get quantity of product in cart
  const getQuantityInCart = (productId: number) => {
    const item = cartItems.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  };

  return {
    cartItems,
    cartSummary,
    loading,
    isAddingToCart,
    addItemToCart,
    updateItemQuantity,
    removeItem,
    clearCart,
    isInCart,
    getQuantityInCart
  };
};
