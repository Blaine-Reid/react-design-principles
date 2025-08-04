// Example custom hook that demonstrates over-abstraction
// This shows splitting related functionality unnecessarily

import { useState, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
}

export const useProductFilters = (products: Product[]) => {
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  const filteredProducts = useMemo(() => {
    return products
      .filter(product => !categoryFilter || product.category === categoryFilter)
      .filter(product => !brandFilter || product.brand === brandFilter);
  }, [products, categoryFilter, brandFilter]);

  const categories = useMemo(() => {
    return [...new Set(products.map(p => p.category))];
  }, [products]);

  const brands = useMemo(() => {
    return [...new Set(products.map(p => p.brand))];
  }, [products]);

  return {
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    filteredProducts,
    categories,
    brands
  };
};