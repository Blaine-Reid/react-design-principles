// Example component that demonstrates over-abstraction
// This shows a component extracted too early

import React from 'react';

interface FilterSidebarProps {
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  brandFilter: string;
  setBrandFilter: (brand: string) => void;
  categories?: string[];
  brands?: string[];
  showCategories?: boolean;
  showBrands?: boolean;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categoryFilter,
  setCategoryFilter,
  brandFilter,
  setBrandFilter,
  categories = [],
  brands = [],
  showCategories = true,
  showBrands = true
}) => {
  return (
    <div className="filter-sidebar">
      <h3>Filters</h3>
      
      {showCategories && (
        <div className="filter-section">
          <h4>Category</h4>
          <select 
            value={categoryFilter} 
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      )}

      {showBrands && (
        <div className="filter-section">
          <h4>Brand</h4>
          <select 
            value={brandFilter} 
            onChange={(e) => setBrandFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="filter-actions">
        <button 
          onClick={() => {
            setCategoryFilter('');
            setBrandFilter('');
          }}
          className="btn btn-secondary btn-small"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};