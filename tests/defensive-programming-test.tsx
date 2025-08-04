// DEFENSIVE PROGRAMMING TEST
// Fix the code violations below - each example lacks proper error handling and validation
// GOAL: Handle edge cases gracefully and provide meaningful feedback

import React, { useState, useEffect } from 'react';
import type { User, Product } from '../src/types';

// ===== EASY =====
// Problem: No validation or error handling for props
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <h1>{user.firstName} {user.lastName}</h1>
      <p>Email: {user.email}</p>
      <p>Phone: {user.phone}</p>
      <img src={user.avatar} alt={`${user.firstName}'s avatar`} />
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
      <div className="badges">
        {user.badges.map(badge => (
          <span key={badge} className="badge">{badge}</span>
        ))}
      </div>
    </div>
  );
}

// Usage that will crash
function App() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    // Sometimes API returns null or malformed data
    fetchUser().then(setUser);
  }, []);

  return <UserProfile user={user} />;
}

// ===== MEDIUM =====
// Problem: No error handling in data fetching and processing
function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    
    const response = await fetch(`/api/products?search=${searchTerm}`);
    const data = await response.json();
    
    // Process the results without validation
    const processedProducts = data.products.map(product => ({
      id: product.id,
      name: product.name.toUpperCase(),
      price: product.price * 1.1, // Add 10% markup
      category: product.category.toLowerCase(),
      rating: Math.round(product.rating * 2) / 2, // Round to nearest 0.5
      inStock: product.inventory > 0,
      imageUrl: product.images[0].url
    }));
    
    setProducts(processedProducts);
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 2) {
      handleSearch();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search products..."
      />
      
      {isLoading && <p>Loading...</p>}
      
      <div className="products">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} />
            <h3>{product.name}</h3>
            <p>${product.price.toFixed(2)}</p>
            <p>Category: {product.category}</p>
            <p>Rating: {product.rating} ⭐</p>
            {product.inStock ? (
              <button>Add to Cart</button>
            ) : (
              <button disabled>Out of Stock</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ===== HARD =====
// Problem: Complex form with no validation, error handling, or edge case management
function ComplexRegistrationForm() {
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    preferences: {
      newsletter: false,
      notifications: false,
      theme: 'light'
    },
    businessInfo: {
      companyName: '',
      taxId: '',
      industry: '',
      employees: ''
    }
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateNestedField = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const validateStep = (step) => {
    const section = ['personalInfo', 'address', 'preferences', 'businessInfo'][step - 1];
    const data = formData[section];
    
    // Basic validation without error handling
    return Object.values(data).every(value => value !== '' && value !== null && value !== undefined);
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Process business logic without error handling
    const age = new Date().getFullYear() - new Date(formData.personalInfo.dateOfBirth).getFullYear();
    const isBusinessAccount = formData.businessInfo.companyName.length > 0;
    
    const processedData = {
      ...formData,
      derived: {
        age: age,
        accountType: isBusinessAccount ? 'business' : 'personal',
        fullName: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`,
        formattedPhone: formData.personalInfo.phone.replace(/\D/g, ''),
        addressLine: `${formData.address.street}, ${formData.address.city}, ${formData.address.state} ${formData.address.zipCode}`
      }
    };
    
    // API call without error handling
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(processedData)
    });
    
    const result = await response.json();
    
    // Process result without validation
    localStorage.setItem('userId', result.user.id);
    localStorage.setItem('token', result.token);
    localStorage.setItem('preferences', JSON.stringify(result.user.preferences));
    
    // Redirect without checking if operation succeeded
    window.location.href = '/dashboard';
  };

  const renderPersonalInfoStep = () => (
    <div>
      <h3>Personal Information</h3>
      <input
        type="text"
        placeholder="First Name"
        value={formData.personalInfo.firstName}
        onChange={(e) => updateNestedField('personalInfo', 'firstName', e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={formData.personalInfo.lastName}
        onChange={(e) => updateNestedField('personalInfo', 'lastName', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.personalInfo.email}
        onChange={(e) => updateNestedField('personalInfo', 'email', e.target.value)}
      />
      <input
        type="tel"
        placeholder="Phone"
        value={formData.personalInfo.phone}
        onChange={(e) => updateNestedField('personalInfo', 'phone', e.target.value)}
      />
      <input
        type="date"
        placeholder="Date of Birth"
        value={formData.personalInfo.dateOfBirth}
        onChange={(e) => updateNestedField('personalInfo', 'dateOfBirth', e.target.value)}
      />
    </div>
  );

  const renderAddressStep = () => (
    <div>
      <h3>Address Information</h3>
      <input
        type="text"
        placeholder="Street Address"
        value={formData.address.street}
        onChange={(e) => updateNestedField('address', 'street', e.target.value)}
      />
      <input
        type="text"
        placeholder="City"
        value={formData.address.city}
        onChange={(e) => updateNestedField('address', 'city', e.target.value)}
      />
      <input
        type="text"
        placeholder="State"
        value={formData.address.state}
        onChange={(e) => updateNestedField('address', 'state', e.target.value)}
      />
      <input
        type="text"
        placeholder="ZIP Code"
        value={formData.address.zipCode}
        onChange={(e) => updateNestedField('address', 'zipCode', e.target.value)}
      />
      <input
        type="text"
        placeholder="Country"
        value={formData.address.country}
        onChange={(e) => updateNestedField('address', 'country', e.target.value)}
      />
    </div>
  );

  const renderBusinessStep = () => (
    <div>
      <h3>Business Information (Optional)</h3>
      <input
        type="text"
        placeholder="Company Name"
        value={formData.businessInfo.companyName}
        onChange={(e) => updateNestedField('businessInfo', 'companyName', e.target.value)}
      />
      <input
        type="text"
        placeholder="Tax ID"
        value={formData.businessInfo.taxId}
        onChange={(e) => updateNestedField('businessInfo', 'taxId', e.target.value)}
      />
      <select
        value={formData.businessInfo.industry}
        onChange={(e) => updateNestedField('businessInfo', 'industry', e.target.value)}
      >
        <option value="">Select Industry</option>
        <option value="tech">Technology</option>
        <option value="finance">Finance</option>
        <option value="healthcare">Healthcare</option>
        <option value="retail">Retail</option>
        <option value="other">Other</option>
      </select>
      <input
        type="number"
        placeholder="Number of Employees"
        value={formData.businessInfo.employees}
        onChange={(e) => updateNestedField('businessInfo', 'employees', e.target.value)}
      />
    </div>
  );

  const getCurrentStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfoStep();
      case 2:
        return renderAddressStep();
      case 3:
        return (
          <div>
            <h3>Preferences</h3>
            <label>
              <input
                type="checkbox"
                checked={formData.preferences.newsletter}
                onChange={(e) => updateNestedField('preferences', 'newsletter', e.target.checked)}
              />
              Subscribe to newsletter
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.preferences.notifications}
                onChange={(e) => updateNestedField('preferences', 'notifications', e.target.checked)}
              />
              Enable notifications
            </label>
            <select
              value={formData.preferences.theme}
              onChange={(e) => updateNestedField('preferences', 'theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        );
      case 4:
        return renderBusinessStep();
      default:
        return null;
    }
  };

  return (
    <div className="registration-form">
      <h2>Registration - Step {currentStep} of 4</h2>
      
      {getCurrentStepContent()}
      
      <div className="form-navigation">
        {currentStep > 1 && (
          <button onClick={handlePrevious}>Previous</button>
        )}
        
        {currentStep < 4 ? (
          <button onClick={handleNext}>Next</button>
        ) : (
          <button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Complete Registration'}
          </button>
        )}
      </div>
    </div>
  );
}

// Mock API functions that can fail
async function fetchUser(): Promise<User | null> {
  // Simulates API that sometimes returns invalid data
  const responses = [
    null,
    undefined,
    { firstName: 'John' }, // Missing required fields
    { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com', phone: null, avatar: null, createdAt: 'invalid-date', badges: null }
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}