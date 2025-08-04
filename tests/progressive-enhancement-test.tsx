// PROGRESSIVE ENHANCEMENT TEST
// Fix the code violations below - each example breaks without JavaScript or doesn't use semantic HTML
// GOAL: Build components that work at a basic level and enhance with JavaScript

import React, { useState, useEffect } from 'react';

// ===== EASY =====
// Problem: Form that completely breaks without JavaScript
function ContactFormBroken() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async () => {
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
    <div className="contact-form"> {/* Not a real form! */}
      <h2>Contact Us</h2>
      
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
        />
      </div>
      
      <div className="form-group">
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your message"
          rows={4}
        />
      </div>
      
      <div 
        className={`submit-btn ${isSubmitting ? 'disabled' : ''}`}
        onClick={isSubmitting ? undefined : handleSubmit} // Not a real button!
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </div>
      
      {submitMessage && (
        <div className="submit-message">{submitMessage}</div>
      )}
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Interactive elements that don't use proper HTML elements
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);

  useEffect(() => {
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
    // Show notification or something
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
  };

  return (
    <div className="product-catalog">
      <h1>Product Catalog</h1>
      
      {/* Filter navigation using divs instead of proper navigation */}
      <div className="category-filters">
        <h3>Categories</h3>
        <div className="filter-list">
          <div 
            className={`filter-item ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('all')}
          >
            All Products
          </div>
          <div 
            className={`filter-item ${selectedCategory === 'electronics' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('electronics')}
          >
            Electronics
          </div>
          <div 
            className={`filter-item ${selectedCategory === 'clothing' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('clothing')}
          >
            Clothing
          </div>
          <div 
            className={`filter-item ${selectedCategory === 'books' ? 'active' : ''}`}
            onClick={() => handleCategoryClick('books')}
          >
            Books
          </div>
        </div>
      </div>

      {/* Sort options using divs instead of select */}
      <div className="sort-options">
        <h3>Sort By</h3>
        <div className="sort-list">
          <div 
            className={`sort-item ${sortBy === 'name' ? 'active' : ''}`}
            onClick={() => handleSortChange('name')}
          >
            Name
          </div>
          <div 
            className={`sort-item ${sortBy === 'price-low' ? 'active' : ''}`}
            onClick={() => handleSortChange('price-low')}
          >
            Price: Low to High
          </div>
          <div 
            className={`sort-item ${sortBy === 'price-high' ? 'active' : ''}`}
            onClick={() => handleSortChange('price-high')}
          >
            Price: High to Low
          </div>
          <div 
            className={`sort-item ${sortBy === 'rating' ? 'active' : ''}`}
            onClick={() => handleSortChange('rating')}
          >
            Rating
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              <div 
                className="image-placeholder"
                style={{ backgroundImage: `url(${product.imageUrl})` }}
              />
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="price">${product.price}</p>
              <p className="rating">⭐ {product.rating}/5</p>
              <div 
                className="add-to-cart-btn"
                onClick={() => addToCart(product)} // Not a real button!
              >
                Add to Cart
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart summary */}
      <div className="cart-summary">
        <h3>Cart ({cart.length} items)</h3>
        <div 
          className="view-cart-btn"
          onClick={() => window.location.href = '/cart'} // Not a real link!
        >
          View Cart
        </div>
      </div>
    </div>
  );
}

// ===== HARD =====
// Problem: Complex dashboard that's completely JavaScript-dependent
function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
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
      const endpoints = {
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleUserAction = async (action, userId) => {
    try {
      await fetch(`/api/admin/users/${userId}/${action}`, { method: 'POST' });
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error(`Failed to ${action} user`);
    }
  };

  const handleOrderAction = async (action, orderId) => {
    try {
      await fetch(`/api/admin/orders/${orderId}/${action}`, { method: 'POST' });
      loadDashboardData(); // Reload data
    } catch (error) {
      console.error(`Failed to ${action} order`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
  };

  if (!isAuthenticated) {
    return <div className="loading">Checking authentication...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Header with navigation using divs */}
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <div className="logout-btn" onClick={handleLogout}>
            Logout
          </div>
        </div>
      </div>

      {/* Tab navigation using divs */}
      <div className="dashboard-tabs">
        <div 
          className={`tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabClick('users')}
        >
          Users
        </div>
        <div 
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabClick('orders')}
        >
          Orders
        </div>
        <div 
          className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => handleTabClick('analytics')}
        >
          Analytics
        </div>
      </div>

      {/* Content area */}
      <div className="dashboard-content">
        {activeTab === 'users' && (
          <div className="users-section">
            <h2>User Management</h2>
            <div className="users-table">
              {users.map(user => (
                <div key={user.id} className="user-row">
                  <div className="user-info">
                    <span>{user.name}</span>
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                  </div>
                  <div className="user-actions">
                    <div 
                      className="action-btn edit"
                      onClick={() => window.location.href = `/admin/users/${user.id}/edit`}
                    >
                      Edit
                    </div>
                    <div 
                      className="action-btn suspend"
                      onClick={() => handleUserAction('suspend', user.id)}
                    >
                      Suspend
                    </div>
                    <div 
                      className="action-btn delete"
                      onClick={() => handleUserAction('delete', user.id)}
                    >
                      Delete
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Order Management</h2>
            <div className="orders-table">
              {orders.map(order => (
                <div key={order.id} className="order-row">
                  <div className="order-info">
                    <span>#{order.id}</span>
                    <span>{order.customerName}</span>
                    <span>${order.total}</span>
                    <span>{order.status}</span>
                  </div>
                  <div className="order-actions">
                    <div 
                      className="action-btn view"
                      onClick={() => window.location.href = `/admin/orders/${order.id}`}
                    >
                      View
                    </div>
                    <div 
                      className="action-btn fulfill"
                      onClick={() => handleOrderAction('fulfill', order.id)}
                    >
                      Fulfill
                    </div>
                    <div 
                      className="action-btn cancel"
                      onClick={() => handleOrderAction('cancel', order.id)}
                    >
                      Cancel
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Analytics Dashboard</h2>
            {analytics && (
              <div className="analytics-widgets">
                <div className="widget">
                  <h3>Total Revenue</h3>
                  <div className="metric">${analytics.totalRevenue}</div>
                </div>
                <div className="widget">
                  <h3>Active Users</h3>
                  <div className="metric">{analytics.activeUsers}</div>
                </div>
                <div className="widget">
                  <h3>Orders Today</h3>
                  <div className="metric">{analytics.ordersToday}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notifications area */}
      <div className="notifications">
        <h3>Notifications</h3>
        {notifications.map((notification, index) => (
          <div key={index} className="notification">
            <span>{notification.message}</span>
            <div 
              className="dismiss-btn"
              onClick={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
            >
              ×
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}