// Example component that demonstrates over-abstraction
// This shows a component extracted too early

import React from 'react';

interface SortOption {
  value: string;
  label: string;
}

interface SortDropdownProps {
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  options?: SortOption[];
  label?: string;
  className?: string;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({
  sortBy,
  setSortBy,
  options = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Sort by Rating' }
  ],
  label = 'Sort by',
  className = ''
}) => {
  return (
    <div className={`sort-dropdown ${className}`}>
      {label && <label className="sort-label">{label}:</label>}
      <select 
        value={sortBy} 
        onChange={(e) => setSortBy(e.target.value)}
        className="sort-select"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};