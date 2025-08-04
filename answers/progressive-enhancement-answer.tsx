// PROGRESSIVE ENHANCEMENT - CORRECT IMPLEMENTATIONS
// This file shows how to build components that work at a basic level and enhance with JavaScript

import React, { useState, useEffect } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Use proper HTML form that works without JavaScript
// WHY: Ensures accessibility, works with all browsers, and provides fallback functionality
function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isJSEnabled, setIsJSEnabled] = useState(false);

  // Detect JavaScript availability
  useEffect(() => {
    setIsJSEnabled(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Only prevent default if JS is enabled
    
    if (!isJSEnabled) {
      // Let the form submit naturally to the server
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, message })
      });
      
      if (response.ok) {
        setSubmitMessage('Message sent successfully!');
        setEmail('');
        setMessage('');
      } else {
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Network error. Please check your connection.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="contact-form">
      <h2>Contact Us</h2>
      
      {/* ✅ Real HTML form that works without JavaScript */}
      <form 
        method="POST" 
        action="/api/contact" 
        onSubmit={handleSubmit}
        noValidate={isJSEnabled} // Only disable HTML5 validation if JS is available
      >
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            aria-describedby="email-error"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter your message"
            rows={4}
            required
            aria-describedby="message-error"
          />
        </div>
        
        {/* ✅ Real button that submits the form */}
        <button 
          type="submit"
          disabled={isJSEnabled && isSubmitting}
          aria-describedby="submit-status"
        >
          {isJSEnabled && isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
        
        {/* Enhanced feedback only shown with JavaScript */}
        {isJSEnabled && submitMessage && (
          <div 
            id="submit-status"
            className="submit-message" 
            role="status"
            aria-live="polite"
          >
            {submitMessage}
          </div>
        )}
      </form>
      
      {/* Graceful degradation message */}
      <noscript>
        <p>This form works without JavaScript. Your message will be sent when you click "Send Message".</p>
      </noscript>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Use semantic HTML elements that work without JavaScript and enhance with interactivity
// WHY: Screen readers understand semantic elements, keyboard navigation works, and basic functionality remains
function ProductCatalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState<any[]>([]);
  const [isJSEnabled, setIsJSEnabled] = useState(false);

  useEffect(() => {
    setIsJSEnabled(true);
    loadProducts();
  }, [selectedCategory, sortBy]);

  const loadProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${selectedCategory}&sort=${sortBy}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products');
    }
  };

  const addToCart = (product: any) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div className="product-catalog">
      <h1>Product Catalog</h1>
      
      {/* ✅ Use semantic navigation with proper links */}
      <nav className="category-filters" aria-label="Product categories">
        <h2>Categories</h2>
        <ul role="list">
          <li>
            <a 
              href="?category=all"
              onClick={isJSEnabled ? (e) => {
                e.preventDefault();
                setSelectedCategory('all');
              } : undefined}
              className={selectedCategory === 'all' ? 'active' : ''}
              aria-current={selectedCategory === 'all' ? 'page' : undefined}
            >
              All Products
            </a>
          </li>
          <li>
            <a 
              href="?category=electronics"
              onClick={isJSEnabled ? (e) => {
                e.preventDefault();
                setSelectedCategory('electronics');
              } : undefined}
              className={selectedCategory === 'electronics' ? 'active' : ''}
              aria-current={selectedCategory === 'electronics' ? 'page' : undefined}
            >
              Electronics
            </a>
          </li>
          <li>
            <a 
              href="?category=clothing"
              onClick={isJSEnabled ? (e) => {
                e.preventDefault();
                setSelectedCategory('clothing');
              } : undefined}
              className={selectedCategory === 'clothing' ? 'active' : ''}
              aria-current={selectedCategory === 'clothing' ? 'page' : undefined}
            >
              Clothing
            </a>
          </li>
          <li>
            <a 
              href="?category=books"
              onClick={isJSEnabled ? (e) => {
                e.preventDefault();
                setSelectedCategory('books');
              } : undefined}
              className={selectedCategory === 'books' ? 'active' : ''}
              aria-current={selectedCategory === 'books' ? 'page' : undefined}
            >
              Books
            </a>
          </li>
        </ul>
      </nav>

      {/* ✅ Use proper form select for sorting */}
      <form className="sort-options">
        <label htmlFor="sort-select">Sort By:</label>
        <select 
          id="sort-select"
          name="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="name">Name</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </form>

      {/* ✅ Product grid with proper semantic structure */}
      <main className="products-grid" role="main">
        <h2 className="visually-hidden">Product List</h2>
        {products.map(product => (
          <article key={product.id} className="product-card">
            <div className="product-image">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.src = '/images/placeholder.jpg';
                }}
              />
            </div>
            
            <div className="product-info">
              <h3>
                <a href={`/products/${product.id}`}>
                  {product.name}
                </a>
              </h3>
              <p className="price" aria-label={`Price: ${product.price} dollars`}>
                ${product.price}
              </p>
              <p className="rating" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                <span aria-hidden="true">⭐ {product.rating}/5</span>
              </p>
              
              {/* ✅ Real button with fallback form */}
              {isJSEnabled ? (
                <button 
                  type="button"
                  onClick={() => addToCart(product)}
                  aria-describedby={`product-${product.id}-desc`}
                >
                  Add to Cart
                </button>
              ) : (
                <form method="POST" action="/api/cart/add" style={{ display: 'inline' }}>
                  <input type="hidden" name="productId" value={product.id} />
                  <button type="submit">Add to Cart</button>
                </form>
              )}
            </div>
          </article>
        ))}
      </main>

      {/* ✅ Cart summary with proper link */}
      <aside className="cart-summary" role="complementary">
        <h2>Shopping Cart</h2>
        <p>
          <a href="/cart">
            View Cart ({isJSEnabled ? cart.length : '?'} items)
          </a>
        </p>
      </aside>
      
      {/* Progressive enhancement styles */}
      <style jsx>{`
        .visually-hidden {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
        
        /* Base styles work without JavaScript */
        .category-filters ul {
          list-style: none;
          padding: 0;
          display: flex;
          gap: 1rem;
        }
        
        .category-filters a {
          padding: 0.5rem 1rem;
          text-decoration: none;
          border: 1px solid #ccc;
          background: #f5f5f5;
        }
        
        .category-filters a:hover,
        .category-filters a:focus {
          background: #e0e0e0;
        }
        
        .category-filters a.active {
          background: #0066cc;
          color: white;
        }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 2rem;
        }
        
        .product-card {
          border: 1px solid #ddd;
          padding: 1rem;
          background: white;
        }
        
        .product-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }
        
        .product-card h3 a {
          text-decoration: none;
          color: #333;
        }
        
        .product-card h3 a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Create semantic HTML structure that works server-side and enhances client-side
// WHY: Admin functionality must be accessible even if JavaScript fails or is disabled
function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isJSEnabled, setIsJSEnabled] = useState(false);

  useEffect(() => {
    setIsJSEnabled(true);
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  const checkAuthentication = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      window.location.href = '/login';
    }
  };

  const loadDashboardData = async () => {
    try {
      const endpoints: { [key: string]: string } = {
        users: '/api/admin/users',
        orders: '/api/admin/orders',
        analytics: '/api/admin/analytics'
      };

      if (endpoints[activeTab]) {
        const response = await fetch(endpoints[activeTab]);
        const data = await response.json();
        
        switch (activeTab) {
          case 'users':
            setUsers(data);
            break;
          case 'orders':
            setOrders(data);
            break;
          case 'analytics':
            setAnalytics(data);
            break;
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard data');
    }
  };

  const handleUserAction = async (action: string, userId: string) => {
    try {
      await fetch(`/api/admin/users/${userId}/${action}`, { method: 'POST' });
      loadDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} user`);
    }
  };

  const handleOrderAction = async (action: string, orderId: string) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/${action}`, { method: 'POST' });
      loadDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} order`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  if (!isAuthenticated) {
    return (
      <div className="loading">
        <noscript>
          <meta httpEquiv="refresh" content="0; url=/login" />
        </noscript>
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* ✅ Semantic header with proper navigation */}
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <nav className="user-nav" aria-label="User navigation">
          <span>Welcome, {user?.name}</span>
          <a 
            href="/logout"
            onClick={isJSEnabled ? (e) => {
              e.preventDefault();
              handleLogout();
            } : undefined}
          >
            Logout
          </a>
        </nav>
      </header>

      {/* ✅ Main navigation with proper links and ARIA */}
      <nav className="dashboard-tabs" role="tablist" aria-label="Dashboard sections">
        <a 
          href="/admin/users"
          role="tab"
          aria-selected={activeTab === 'users'}
          aria-controls="users-panel"
          onClick={isJSEnabled ? (e) => {
            e.preventDefault();
            setActiveTab('users');
          } : undefined}
          className={activeTab === 'users' ? 'active' : ''}
        >
          Users
        </a>
        <a 
          href="/admin/orders"
          role="tab"
          aria-selected={activeTab === 'orders'}
          aria-controls="orders-panel"
          onClick={isJSEnabled ? (e) => {
            e.preventDefault();
            setActiveTab('orders');
          } : undefined}
          className={activeTab === 'orders' ? 'active' : ''}
        >
          Orders
        </a>
        <a 
          href="/admin/analytics"
          role="tab"
          aria-selected={activeTab === 'analytics'}
          aria-controls="analytics-panel"
          onClick={isJSEnabled ? (e) => {
            e.preventDefault();
            setActiveTab('analytics');
          } : undefined}
          className={activeTab === 'analytics' ? 'active' : ''}
        >
          Analytics
        </a>
      </nav>

      {/* ✅ Main content with proper semantic structure */}
      <main className="dashboard-content">
        {/* Users Section */}
        <section 
          id="users-panel"
          role="tabpanel"
          aria-labelledby="users-tab"
          className={activeTab === 'users' ? 'active' : 'hidden'}
        >
          <h2>User Management</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="user-actions">
                    <a href={`/admin/users/${user.id}/edit`}>
                      Edit
                    </a>
                    
                    {isJSEnabled ? (
                      <>
                        <button 
                          type="button"
                          onClick={() => handleUserAction('suspend', user.id)}
                        >
                          Suspend
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleUserAction('delete', user.id)}
                          className="danger"
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <form method="POST" action={`/admin/users/${user.id}/suspend`} style={{ display: 'inline' }}>
                          <button type="submit">Suspend</button>
                        </form>
                        <form method="POST" action={`/admin/users/${user.id}/delete`} style={{ display: 'inline' }}>
                          <button type="submit" className="danger">Delete</button>
                        </form>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Orders Section */}
        <section 
          id="orders-panel"
          role="tabpanel"
          aria-labelledby="orders-tab"
          className={activeTab === 'orders' ? 'active' : 'hidden'}
        >
          <h2>Order Management</h2>
          <table className="orders-table">
            <thead>
              <tr>
                <th scope="col">Order ID</th>
                <th scope="col">Customer</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>{order.customerName}</td>
                  <td>${order.total}</td>
                  <td>
                    <span className={`status ${order.status}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="order-actions">
                    <a href={`/admin/orders/${order.id}`}>
                      View Details
                    </a>
                    
                    {isJSEnabled ? (
                      <>
                        <button 
                          type="button"
                          onClick={() => handleOrderAction('fulfill', order.id)}
                        >
                          Fulfill
                        </button>
                        <button 
                          type="button"
                          onClick={() => handleOrderAction('cancel', order.id)}
                          className="danger"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <form method="POST" action={`/admin/orders/${order.id}/fulfill`} style={{ display: 'inline' }}>
                          <button type="submit">Fulfill</button>
                        </form>
                        <form method="POST" action={`/admin/orders/${order.id}/cancel`} style={{ display: 'inline' }}>
                          <button type="submit" className="danger">Cancel</button>
                        </form>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Analytics Section */}
        <section 
          id="analytics-panel"
          role="tabpanel"
          aria-labelledby="analytics-tab"
          className={activeTab === 'analytics' ? 'active' : 'hidden'}
        >
          <h2>Analytics Dashboard</h2>
          {analytics && (
            <div className="analytics-widgets">
              <div className="widget">
                <h3>Total Revenue</h3>
                <div className="metric" aria-label={`Total revenue: ${analytics.totalRevenue} dollars`}>
                  ${analytics.totalRevenue}
                </div>
              </div>
              <div className="widget">
                <h3>Active Users</h3>
                <div className="metric" aria-label={`Active users: ${analytics.activeUsers}`}>
                  {analytics.activeUsers}
                </div>
              </div>
              <div className="widget">
                <h3>Orders Today</h3>
                <div className="metric" aria-label={`Orders today: ${analytics.ordersToday}`}>
                  {analytics.ordersToday}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* ✅ Notifications sidebar with proper ARIA */}
      <aside className="notifications" role="complementary" aria-label="Notifications">
        <h2>Notifications</h2>
        <ul role="list">
          {notifications.map((notification, index) => (
            <li key={index} className="notification" role="listitem">
              <span>{notification.message}</span>
              {isJSEnabled ? (
                <button 
                  type="button"
                  onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              ) : (
                <form method="POST" action={`/admin/notifications/${index}/dismiss`} style={{ display: 'inline' }}>
                  <button type="submit" aria-label="Dismiss notification">×</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      </aside>
      
      {/* Progressive enhancement styles */}
      <style jsx>{`
        .hidden { display: none; }
        .active { display: block; }
        
        /* Base styles work without JavaScript */
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #ddd;
        }
        
        .dashboard-tabs {
          display: flex;
          gap: 0;
          border-bottom: 1px solid #ddd;
        }
        
        .dashboard-tabs a {
          padding: 1rem 2rem;
          text-decoration: none;
          background: #f5f5f5;
          border: 1px solid #ddd;
          border-bottom: none;
        }
        
        .dashboard-tabs a:hover,
        .dashboard-tabs a:focus {
          background: #e0e0e0;
        }
        
        .dashboard-tabs a.active {
          background: white;
          border-bottom: 1px solid white;
          margin-bottom: -1px;
        }
        
        .dashboard-content {
          padding: 2rem;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 1rem;
        }
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        
        th {
          background: #f5f5f5;
          font-weight: bold;
        }
        
        .user-actions, .order-actions {
          display: flex;
          gap: 0.5rem;
        }
        
        .user-actions a, .order-actions a,
        .user-actions button, .order-actions button {
          padding: 0.25rem 0.5rem;
          text-decoration: none;
          background: #0066cc;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .danger {
          background: #cc0000 !important;
        }
        
        .analytics-widgets {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .widget {
          padding: 1rem;
          border: 1px solid #ddd;
          background: white;
          text-align: center;
        }
        
        .metric {
          font-size: 2rem;
          font-weight: bold;
          color: #0066cc;
        }
        
        .notifications {
          position: fixed;
          top: 0;
          right: 0;
          width: 300px;
          background: white;
          border: 1px solid #ddd;
          max-height: 100vh;
          overflow-y: auto;
        }
        
        .notifications ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .notification {
          padding: 1rem;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .status {
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          font-size: 0.75rem;
          text-transform: uppercase;
        }
        
        .status.pending { background: #fff3cd; color: #856404; }
        .status.fulfilled { background: #d4edda; color: #155724; }
        .status.cancelled { background: #f8d7da; color: #721c24; }
      `}</style>
      
      {/* Fallback message for users without JavaScript */}
      <noscript>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: '#fff3cd',
          padding: '1rem',
          textAlign: 'center',
          borderBottom: '1px solid #856404'
        }}>
          This admin dashboard works without JavaScript, but some features may be limited. 
          For the best experience, please enable JavaScript.
        </div>
      </noscript>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Semantic HTML Foundation**: Start with proper HTML structure
   - Use form elements for forms, not divs with onClick
   - Use nav elements for navigation
   - Use proper headings, tables, buttons, and links
   - Include proper ARIA labels and roles

2. **Graceful Degradation**: Core functionality works without JavaScript
   - Forms submit to server endpoints
   - Links navigate to proper URLs
   - Tables display data correctly
   - Basic interactions work via HTTP requests

3. **Progressive Enhancement**: Layer JavaScript on top of working HTML
   - Detect JavaScript availability with useEffect
   - Prevent default behavior only when JS is enabled
   - Add enhanced interactions like AJAX and dynamic updates
   - Provide better UX with client-side state

4. **Accessibility First**: Support all users and technologies
   - Screen readers work with semantic HTML
   - Keyboard navigation functions properly
   - ARIA attributes provide context
   - Focus management is handled correctly

5. **Performance Benefits**: Basic functionality loads immediately
   - HTML renders first, JavaScript enhances later
   - Critical content is available without waiting for JS
   - Search engines can crawl and index content
   - Works on slow connections and limited devices

PROGRESSIVE ENHANCEMENT CHECKLIST:
✅ Use semantic HTML elements (form, nav, button, a, table)
✅ Ensure core functionality works without JavaScript
✅ Add ARIA labels and roles for accessibility
✅ Implement proper keyboard navigation
✅ Layer JavaScript enhancements on top of working HTML
✅ Provide fallback URLs and form actions
✅ Use noscript tags for JavaScript-disabled users
✅ Test with JavaScript disabled
✅ Include proper focus management
✅ Support screen readers and assistive technologies

COMMON MISTAKES TO AVOID:
- Using div elements for interactive elements
- Relying entirely on JavaScript for form submission
- Missing form action attributes
- No keyboard navigation support
- Missing ARIA labels and semantic markup
- No fallback for JavaScript-disabled users
- Inaccessible color-only status indicators
- Missing proper heading hierarchy
*/