// DEFENSIVE PROGRAMMING - CORRECT IMPLEMENTATIONS
// This file shows how to handle edge cases gracefully and provide meaningful feedback

import React, { useState, useEffect } from 'react';
import type { User, Product } from '../src/types';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Add comprehensive validation and error handling
// WHY: Prevents crashes and provides better user experience
function UserProfile({ user }: { user?: User | null }) {
  // Guard against null/undefined user
  if (!user) {
    return (
      <div className="user-profile user-profile--loading">
        <div className="loading-spinner">Loading user profile...</div>
      </div>
    );
  }

  // Validate user object structure
  if (typeof user !== 'object') {
    console.error('UserProfile: Expected user to be an object, received:', typeof user);
    return (
      <div className="user-profile user-profile--error">
        <div className="error-message">
          <h2>Invalid User Data</h2>
          <p>Unable to display user profile. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  // Extract and validate required fields with fallbacks
  const firstName = user.firstName?.trim() || 'Unknown';
  const lastName = user.lastName?.trim() || 'User';
  const email = user.email?.trim() || 'No email provided';
  const phone = user.phone?.trim() || null;
  const avatar = user.avatar?.trim() || null;
  const badges = Array.isArray(user.badges) ? user.badges : [];

  // Safe date parsing with error handling
  let memberSince = 'Unknown';
  if (user.createdAt) {
    try {
      const date = new Date(user.createdAt);
      if (!isNaN(date.getTime())) {
        memberSince = date.toLocaleDateString();
      } else {
        console.warn('UserProfile: Invalid createdAt date:', user.createdAt);
      }
    } catch (error) {
      console.warn('UserProfile: Failed to parse createdAt:', error);
    }
  }

  return (
    <div className="user-profile">
      {/* Safe image rendering with fallback */}
      {avatar ? (
        <img 
          src={avatar} 
          alt={`${firstName}'s avatar`}
          onError={(e) => {
            // Handle broken images gracefully
            e.currentTarget.style.display = 'none';
            console.warn('UserProfile: Failed to load avatar:', avatar);
          }}
        />
      ) : (
        <div className="avatar-placeholder">
          {firstName.charAt(0)}{lastName.charAt(0)}
        </div>
      )}

      <h1>{firstName} {lastName}</h1>
      <p>Email: {email}</p>
      
      {/* Conditional rendering with safe checks */}
      {phone && <p>Phone: {phone}</p>}
      <p>Member since: {memberSince}</p>
      
      {/* Safe array rendering */}
      {badges.length > 0 && (
        <div className="badges">
          <h3>Badges:</h3>
          {badges.map((badge, index) => (
            <span key={`${badge}-${index}`} className="badge">
              {typeof badge === 'string' ? badge : 'Invalid badge'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Usage with proper error boundaries
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userData = await fetchUser();
        setUser(userData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user';
        setError(errorMessage);
        console.error('App: Failed to load user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  return <UserProfile user={user} />;
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Comprehensive error handling for API calls and data processing
// WHY: Network requests and data processing are common failure points
function ProductSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (term: string) => {
    // Input validation
    if (!term?.trim()) {
      setProducts([]);
      setError(null);
      return;
    }

    // Prevent concurrent requests
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Sanitize input for URL
      const sanitizedTerm = encodeURIComponent(term.trim());
      const response = await fetch(`/api/products?search=${sanitizedTerm}`);

      // Check HTTP status codes
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product search service not found');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      // Parse JSON with error handling
      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error('Invalid response format from server');
      }

      // Validate response structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response structure');
      }

      if (!Array.isArray(data.products)) {
        console.warn('ProductSearch: Expected products array, received:', typeof data.products);
        setProducts([]);
        return;
      }

      // Process and validate each product
      const processedProducts = data.products
        .map((product: any, index: number) => {
          try {
            // Validate required fields
            if (!product || typeof product !== 'object') {
              console.warn(`ProductSearch: Invalid product at index ${index}:`, product);
              return null;
            }

            const id = product.id?.toString() || `temp-${index}`;
            const name = product.name?.toString()?.trim() || 'Unknown Product';
            const price = parseFloat(product.price) || 0;
            const category = product.category?.toString()?.toLowerCase()?.trim() || 'uncategorized';
            
            // Safe rating calculation
            let rating = 0;
            if (typeof product.rating === 'number' && !isNaN(product.rating)) {
              rating = Math.max(0, Math.min(5, Math.round(product.rating * 2) / 2));
            }

            // Safe inventory check
            const inventory = parseInt(product.inventory) || 0;
            const inStock = inventory > 0;

            // Safe image URL handling
            let imageUrl = '/images/placeholder.jpg';
            if (product.images && Array.isArray(product.images) && product.images.length > 0) {
              const firstImage = product.images[0];
              if (firstImage && typeof firstImage.url === 'string' && firstImage.url.trim()) {
                imageUrl = firstImage.url.trim();
              }
            }

            return {
              id,
              name,
              price: Math.max(0, price * 1.1), // Apply markup safely
              category,
              rating,
              inStock,
              imageUrl
            };
          } catch (productError) {
            console.warn(`ProductSearch: Error processing product at index ${index}:`, productError);
            return null;
          }
        })
        .filter(Boolean); // Remove null products

      setProducts(processedProducts);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to search products';
      setError(errorMessage);
      console.error('ProductSearch: Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    // Debounced search for better UX
    if (value.trim().length > 2) {
      const timeoutId = setTimeout(() => handleSearch(value), 300);
      return () => clearTimeout(timeoutId);
    } else if (value.trim().length === 0) {
      setProducts([]);
      setError(null);
    }
  };

  return (
    <div className="product-search">
      <h1>Product Search</h1>
      
      <input
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search products..."
        disabled={isLoading}
        aria-label="Search products"
      />
      
      {/* Error state */}
      {error && (
        <div className="error-message" role="alert">
          <h3>Search Error</h3>
          <p>{error}</p>
          <button onClick={() => handleSearch(searchTerm)}>
            Try Again
          </button>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="loading" aria-live="polite">
          Searching products...
        </div>
      )}
      
      {/* Results */}
      {!isLoading && !error && (
        <div className="search-results">
          {products.length > 0 ? (
            <>
              <p>{products.length} product{products.length !== 1 ? 's' : ''} found</p>
              <div className="products-grid">
                {products.map(product => (
                  <div key={product.id} className="product-card">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = '/images/placeholder.jpg';
                      }}
                    />
                    <h3>{product.name}</h3>
                    <p className="price">${product.price.toFixed(2)}</p>
                    <p className="category">Category: {product.category}</p>
                    <p className="rating">Rating: {product.rating} ⭐</p>
                    
                    {product.inStock ? (
                      <button 
                        onClick={() => console.log('Add to cart:', product.id)}
                        className="add-to-cart-btn"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <button disabled className="out-of-stock-btn">
                        Out of Stock
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : searchTerm.trim().length > 2 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search terms.</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ===== BONUS: Error Boundary Component =====
// 🔥 Advanced pattern for catching React errors
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ComponentType<{ error: Error }> },
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to monitoring service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // In production, you'd send this to an error tracking service
    // like Sentry, LogRocket, etc.
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback;
      
      if (FallbackComponent && this.state.error) {
        return <FallbackComponent error={this.state.error} />;
      }

      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>The application encountered an unexpected error.</p>
          <details>
            <summary>Error details</summary>
            <pre>{this.state.error?.toString()}</pre>
            {this.state.errorInfo?.componentStack && (
              <pre>{this.state.errorInfo.componentStack}</pre>
            )}
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage with error boundary
function AppWithErrorBoundary() {
  return (
    <ErrorBoundary fallback={({ error }) => (
      <div className="custom-error">
        <h2>Oops! Something went wrong</h2>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    )}>
      <App />
    </ErrorBoundary>
  );
}

// Safe API function with proper error handling
async function fetchUser(): Promise<User | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

  try {
    const response = await fetch('/api/user', {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Validate response structure
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid user data received');
    }

    return data as User;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error('Request timed out. Please check your connection.');
    }
    
    throw error;
  }
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Input Validation**: Always validate props, function parameters, and external data
   - Check for null/undefined values
   - Validate data types and structures
   - Provide meaningful fallbacks

2. **Error Boundaries**: Use React error boundaries to catch component errors
   - Prevent entire app crashes
   - Provide fallback UI
   - Log errors for debugging

3. **Safe API Calls**: Handle network failures gracefully
   - Check HTTP status codes
   - Handle JSON parsing errors
   - Implement timeouts
   - Provide retry mechanisms

4. **Safe DOM Operations**: Handle image loading, event handlers safely
   - onError handlers for images
   - Validate event targets
   - Use aria labels for accessibility

5. **Progressive Disclosure**: Show appropriate states
   - Loading states
   - Error states  
   - Empty states
   - Success states

DEFENSIVE PROGRAMMING CHECKLIST:
✅ Validate all inputs and props
✅ Handle null/undefined values
✅ Provide meaningful error messages
✅ Use error boundaries
✅ Implement proper loading states
✅ Handle network failures
✅ Log errors for debugging
✅ Use TypeScript for compile-time safety
✅ Test edge cases thoroughly
✅ Provide fallback UI components

COMMON FAILURE POINTS TO GUARD AGAINST:
- Null/undefined object access
- Array operations on non-arrays
- Invalid date strings
- Network timeouts
- Malformed JSON responses
- Missing required fields
- Type mismatches
- Image loading failures
- Event handler errors
*/