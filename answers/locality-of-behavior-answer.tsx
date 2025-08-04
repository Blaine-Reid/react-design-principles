// LOCALITY OF BEHAVIOR - CORRECT IMPLEMENTATIONS
// This file shows how to fix the violations by keeping related logic close to where it's used

import React, { useState } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Keep simple formatting logic directly in the component
// WHY: formatUserName was only used in one place, so extracting it created unnecessary indirection
function UserGreeting({ user }) {
  // Simple logic that's only used here stays here
  const displayName = `${user.firstName} ${user.lastName}`;
  
  return <h1>Hello, {displayName}!</h1>;
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Keep validation and error formatting logic in the component
// WHY: This validation is specific to this form's requirements and UX patterns
function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState({});

  // Validation logic co-located with the component that uses it
  const validateEmail = (email) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain uppercase, lowercase, and numbers';
    }
    return null;
  };

  const validateAge = (age) => {
    const ageNum = parseInt(age);
    if (!age) return 'Age is required';
    if (isNaN(ageNum)) return 'Age must be a number';
    if (ageNum < 13) return 'Must be at least 13 years old';
    if (ageNum > 120) return 'Please enter a valid age';
    return null;
  };

  // Error formatting specific to this form's design
  const formatError = (error) => error ? `⚠️ ${error}` : '';

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const ageError = validateAge(age);
    
    setErrors({
      email: formatError(emailError),
      password: formatError(passwordError),
      age: formatError(ageError)
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {errors.password && <span className="error">{errors.password}</span>}
      
      <input 
        type="number" 
        value={age} 
        onChange={(e) => setAge(e.target.value)}
        placeholder="Age"
      />
      {errors.age && <span className="error">{errors.age}</span>}
      
      <button type="submit">Register</button>
    </form>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Consolidate related functionality into a single, cohesive component
// WHY: All the filtering, sorting, and price logic is part of one user experience
function ProductListing({ products }) {
  // All related state in one place
  const [categoryFilter, setCategoryFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [sortBy, setSortBy] = useState('name');

  // All filtering logic co-located - it's part of this component's responsibility
  const filteredProducts = products
    .filter(product => !categoryFilter || product.category === categoryFilter)
    .filter(product => !brandFilter || product.brand === brandFilter)
    .filter(product => product.price >= minPrice && product.price <= maxPrice)
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  // Extract unique values for filter options (derived state)
  const categories = [...new Set(products.map(p => p.category))];
  const brands = [...new Set(products.map(p => p.brand))];

  return (
    <div className="product-listing">
      <div className="filters">
        {/* Category filter */}
        <select 
          value={categoryFilter} 
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {/* Brand filter */}
        <select 
          value={brandFilter} 
          onChange={(e) => setBrandFilter(e.target.value)}
        >
          <option value="">All Brands</option>
          {brands.map(brand => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {/* Price range - inline since it's simple */}
        <div className="price-range">
          <label>
            Min: $
            <input 
              type="number" 
              value={minPrice} 
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
          </label>
          <label>
            Max: $
            <input 
              type="number" 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </label>
        </div>

        {/* Sort dropdown */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Sort by Rating</option>
        </select>
      </div>
      
      <div className="products">
        {filteredProducts.map(product => (
          // Simple product card inline - only extract if it becomes complex
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.brand} - {product.category}</p>
            <p>${product.price}</p>
            <p>⭐ {product.rating}/5</p>
          </div>
        ))}
      </div>
      
      <div className="results-summary">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Extract only when there's real reuse**: The formatUserName function was only used once, 
   so we eliminated the unnecessary indirection.

2. **Keep domain logic with its context**: Registration validation rules are specific to 
   this form's business requirements and UX patterns, so they belong here.

3. **Consolidate related functionality**: All the product filtering, sorting, and display 
   logic is part of one cohesive user experience, so it lives together.

4. **Prefer clarity over DRY**: We chose to keep the logic readable and traceable rather 
   than abstracting it prematurely.

5. **Extract when it truly helps**: We didn't extract components until they would provide 
   real value in terms of reusability, testing, or complexity management.

WHEN TO EXTRACT:
- ✅ Logic is used in 2+ components
- ✅ Testing or isolation would be significantly easier
- ✅ The abstraction clarifies intent rather than obscuring it
- ❌ "It might be reused someday"
- ❌ "It looks cleaner in a separate file"
- ❌ Following DRY principle blindly
*/