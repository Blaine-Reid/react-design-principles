// LOCALITY OF BEHAVIOR TEST
// Fix the code violations below - each example breaks the "Locality of Behavior" principle
// GOAL: Keep related logic close to where it's used instead of extracting prematurely

import React, { useState } from 'react';
import type { User, Product } from '../src/types';

// ===== EASY =====
// Problem: Simple helper extracted too early
import { formatUserName } from '../src/utils/userHelpers';

function UserGreeting({ user }: { user: User }) {
  return <h1>Hello, {formatUserName(user.firstName, user.lastName)}!</h1>;
}

// ===== MEDIUM =====
// Problem: Business logic scattered across multiple files
import { validateEmail, validatePassword, validateAge } from '../src/validators/userValidation';
import { formatErrorMessage } from '../src/utils/errorFormatting';

function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const ageError = validateAge(age);
    
    setErrors({
      email: emailError ? formatErrorMessage(emailError) : '',
      password: passwordError ? formatErrorMessage(passwordError) : '',
      age: ageError ? formatErrorMessage(ageError) : ''
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

// ===== HARD =====
// Problem: Complex component split across multiple files with shared state management
import { useProductFilters } from '../src/hooks/useProductFilters';
import { usePriceCalculations } from '../src/hooks/usePriceCalculations';
import { useProductSorting } from '../src/hooks/useProductSorting';
import { ProductCard } from '../src/components/ProductCard';
import { FilterSidebar } from '../src/components/FilterSidebar';
import { SortDropdown } from '../src/components/SortDropdown';
import { PriceRange } from '../src/components/PriceRange';

function ProductListing({ products }: { products: Product[] }) {
  const {
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    filteredProducts
  } = useProductFilters(products);

  const {
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
    priceFilteredProducts
  } = usePriceCalculations(filteredProducts);

  const {
    sortBy,
    setSortBy,
    sortedProducts
  } = useProductSorting(priceFilteredProducts);

  return (
    <div className="product-listing">
      <div className="filters">
        <FilterSidebar 
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          brandFilter={brandFilter}
          setBrandFilter={setBrandFilter}
        />
        <PriceRange 
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
        <SortDropdown 
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      
      <div className="products">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}