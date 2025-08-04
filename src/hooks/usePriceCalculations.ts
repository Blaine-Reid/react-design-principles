// Example custom hook that demonstrates over-abstraction
// This shows unnecessary separation of related price logic

import { useState, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
}

export const usePriceCalculations = (products: Product[]) => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const priceFilteredProducts = useMemo(() => {
    return products.filter(product => 
      product.price >= minPrice && product.price <= maxPrice
    );
  }, [products, minPrice, maxPrice]);

  const priceRange = useMemo(() => {
    if (products.length === 0) return { min: 0, max: 1000 };
    
    const prices = products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [products]);

  const averagePrice = useMemo(() => {
    if (products.length === 0) return 0;
    return products.reduce((sum, p) => sum + p.price, 0) / products.length;
  }, [products]);

  return {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    priceFilteredProducts,
    priceRange,
    averagePrice
  };
};