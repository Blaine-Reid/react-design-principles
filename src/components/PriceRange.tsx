// Example component that demonstrates over-abstraction  
// This shows a component extracted too early

import React from 'react';

interface PriceRangeProps {
  minPrice: number;
  maxPrice: number;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  absoluteMin?: number;
  absoluteMax?: number;
  step?: number;
  currency?: string;
  showLabels?: boolean;
}

export const PriceRange: React.FC<PriceRangeProps> = ({
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  absoluteMin = 0,
  absoluteMax = 1000,
  step = 10,
  currency = '$',
  showLabels = true
}) => {
  return (
    <div className="price-range">
      {showLabels && <h4>Price Range</h4>}
      
      <div className="price-inputs">
        <div className="price-input-group">
          <label>Min:</label>
          <div className="input-with-currency">
            <span className="currency">{currency}</span>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
              min={absoluteMin}
              max={maxPrice}
              step={step}
              className="price-input"
            />
          </div>
        </div>
        
        <div className="price-input-group">
          <label>Max:</label>
          <div className="input-with-currency">
            <span className="currency">{currency}</span>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              min={minPrice}
              max={absoluteMax}
              step={step}
              className="price-input"
            />
          </div>
        </div>
      </div>
      
      <div className="price-range-display">
        {currency}{minPrice} - {currency}{maxPrice}
      </div>
      
      <button 
        onClick={() => {
          setMinPrice(absoluteMin);
          setMaxPrice(absoluteMax);
        }}
        className="btn btn-secondary btn-small"
      >
        Reset Range
      </button>
    </div>
  );
};