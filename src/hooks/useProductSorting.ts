// Example custom hook that demonstrates over-abstraction
// This shows unnecessary separation of sorting logic

import { useState, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
}

type SortOption = 'name' | 'price-low' | 'price-high' | 'rating';

export const useProductSorting = (products: Product[]) => {
  const [sortBy, setSortBy] = useState<SortOption>('name');
  
  const setSortByString = (sortBy: string) => {
    setSortBy(sortBy as SortOption);
  };

  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'name':
      default:
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, sortBy]);

  const sortOptions = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Sort by Rating' }
  ] as const;

  return {
    sortBy,
    setSortBy: setSortByString,
    sortedProducts,
    sortOptions
  };
};