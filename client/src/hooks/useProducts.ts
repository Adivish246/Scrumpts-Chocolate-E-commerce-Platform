import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductFilter } from '@/lib/types';
import { useToast } from './use-toast';
import { Product } from '@shared/schema';

export const useProducts = (initialFilter?: ProductFilter) => {
  const [filter, setFilter] = useState<ProductFilter>(initialFilter || {});
  const { toast } = useToast();

  // Construct query key based on filter
  const queryKey = ['/api/products'];
  
  if (filter.category) queryKey.push(`category=${filter.category}`);
  if (filter.type) queryKey.push(`type=${filter.type}`);
  
  // Fetch products
  const { 
    data: products = [], 
    isLoading, 
    error,
    refetch 
  } = useQuery<Product[]>({ 
    queryKey,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Apply client-side sorting
  const sortedProducts = [...products].sort((a, b) => {
    if (!filter.sort) return 0;
    
    switch (filter.sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'popularity':
      default:
        // Sort by rating (default)
        return b.rating - a.rating;
    }
  });

  // Apply filter
  const updateFilter = (newFilter: Partial<ProductFilter>) => {
    setFilter(prevFilter => ({
      ...prevFilter,
      ...newFilter
    }));
  };

  if (error) {
    toast({
      title: 'Error loading products',
      description: 'There was a problem loading the products. Please try again.',
      variant: 'destructive',
    });
  }

  return {
    products: sortedProducts,
    filter,
    updateFilter,
    isLoading,
    error,
    refetch
  };
};

export const useFeaturedProducts = () => {
  const { toast } = useToast();

  // Fetch featured products
  const { 
    data: featuredProducts = [], 
    isLoading, 
    error 
  } = useQuery<Product[]>({ 
    queryKey: ['/api/products/featured'],
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  if (error) {
    toast({
      title: 'Error loading featured products',
      description: 'There was a problem loading the featured products.',
      variant: 'destructive',
    });
  }

  return {
    featuredProducts,
    isLoading,
    error
  };
};

export const useBestsellers = () => {
  const { toast } = useToast();

  // Fetch bestseller products
  const { 
    data: bestsellers = [], 
    isLoading, 
    error 
  } = useQuery<Product[]>({ 
    queryKey: ['/api/products/bestsellers'],
    staleTime: 1000 * 60 * 15, // 15 minutes
  });

  if (error) {
    toast({
      title: 'Error loading bestsellers',
      description: 'There was a problem loading the bestselling products.',
      variant: 'destructive',
    });
  }

  return {
    bestsellers,
    isLoading,
    error
  };
};

export const useCollections = () => {
  const { toast } = useToast();

  // Fetch collections
  const { 
    data: collections = [], 
    isLoading, 
    error 
  } = useQuery<any[]>({ 
    queryKey: ['/api/collections'],
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  if (error) {
    toast({
      title: 'Error loading collections',
      description: 'There was a problem loading the collections.',
      variant: 'destructive',
    });
  }

  return {
    collections,
    isLoading,
    error
  };
};

export const useProductDetail = (productId: number) => {
  const { toast } = useToast();

  // Fetch single product
  const { 
    data: product, 
    isLoading, 
    error 
  } = useQuery<Product>({ 
    queryKey: [`/api/products/${productId}`],
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!productId
  });

  if (error) {
    toast({
      title: 'Error loading product',
      description: 'There was a problem loading the product details.',
      variant: 'destructive',
    });
  }

  return {
    product,
    isLoading,
    error
  };
};
