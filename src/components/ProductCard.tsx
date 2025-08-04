// Example component that demonstrates over-abstraction
// This shows a component extracted too early

import React from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  showAddToCart?: boolean;
  showRating?: boolean;
  layout?: 'horizontal' | 'vertical';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
  showAddToCart = true,
  showRating = true,
  layout = 'vertical'
}) => {
  return (
    <div className={`product-card product-card-${layout}`}>
      <div className="product-image">
        <img src={`/images/${product.id}.jpg`} alt={product.name} />
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-brand">{product.brand}</p>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price.toFixed(2)}</p>
        
        {showRating && (
          <div className="product-rating">
            ⭐ {product.rating}/5
          </div>
        )}
      </div>
      
      <div className="product-actions">
        {showAddToCart && onAddToCart && (
          <button 
            onClick={() => onAddToCart(product)}
            className="btn btn-primary"
          >
            Add to Cart
          </button>
        )}
        
        {onViewDetails && (
          <button 
            onClick={() => onViewDetails(product)}
            className="btn btn-secondary"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};