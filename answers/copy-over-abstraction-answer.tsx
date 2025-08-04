// COPY OVER ABSTRACTION - CORRECT IMPLEMENTATIONS
// This file shows when to copy JSX instead of creating premature abstractions

import React, { useState } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Copy similar components instead of forcing them into one abstraction
// WHY: Each verification type has unique behavior, styling, and requirements

function EmailVerificationItem({ email, isVerified, onVerify, onEdit }) {
  return (
    <div className="email-verification-item">
      <div className="status-header">
        <span className="icon">📧</span>
        <h3>Email Address</h3>
        {isVerified && <span className="verified-badge">✅ Verified</span>}
      </div>
      
      <div className="status-content">
        <p className="email-value">{email}</p>
        <div className="actions">
          <button onClick={onEdit} className="edit-btn">
            Edit Email
          </button>
          {!isVerified && (
            <button onClick={onVerify} className="verify-btn primary">
              Send Verification Email
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function PhoneVerificationItem({ phone, isVerified, onVerify, onEdit }) {
  return (
    <div className="phone-verification-item">
      <div className="status-header">
        <span className="icon">📱</span>
        <h3>Phone Number</h3>
        {isVerified && <span className="verified-badge">✅ Verified</span>}
      </div>
      
      <div className="status-content">
        <p className="phone-value">{phone}</p>
        <div className="actions">
          <button onClick={onEdit} className="edit-btn">
            Edit Phone
          </button>
          {!isVerified && (
            <button onClick={onVerify} className="verify-btn secondary">
              Send SMS Code
            </button>
          )}
        </div>
        {!isVerified && (
          <small className="help-text">
            We'll send a 6-digit code to verify your number
          </small>
        )}
      </div>
    </div>
  );
}

function AddressVerificationItem({ address, isVerified, onVerify, onEdit }) {
  return (
    <div className="address-verification-item">
      <div className="status-header">
        <span className="icon">🏠</span>
        <h3>Home Address</h3>
        {isVerified && <span className="verified-badge">✅ Verified</span>}
      </div>
      
      <div className="status-content">
        <p className="address-value">{address}</p>
        <div className="actions">
          <button onClick={onEdit} className="edit-btn">
            Edit Address
          </button>
          {!isVerified && (
            <button onClick={onVerify} className="verify-btn tertiary">
              Mail Verification Letter
            </button>
          )}
        </div>
        {!isVerified && (
          <div className="address-notice">
            <p><strong>Note:</strong> Address verification takes 5-7 business days</p>
            <p>We'll mail a letter with a verification code to this address</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Clean, simple usage with specific components
function UserVerificationStatus() {
  return (
    <div className="verification-status">
      <EmailVerificationItem 
        email="user@example.com"
        isVerified={true}
        onVerify={() => {}}
        onEdit={() => {}}
      />
      <PhoneVerificationItem 
        phone="+1 (555) 123-4567"
        isVerified={false}
        onVerify={() => {}}
        onEdit={() => {}}
      />
      <AddressVerificationItem 
        address="123 Main St, City, ST 12345"
        isVerified={false}
        onVerify={() => {}}
        onEdit={() => {}}
      />
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Simple, inline form fields instead of over-engineered abstraction
// WHY: This form is only used in one place and has specific validation rules

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateName = (name: string) => {
    if (name.length < 2) return 'Name must be at least 2 characters';
    return null;
  };

  const validateEmail = (email: string) => {
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Contact Us</h2>
      
      {/* Name field - inline and specific */}
      <div className="form-field">
        <label className="required">
          <span className="field-icon">👤</span>
          Full Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter your name"
          className={`form-input ${errors.name ? 'error' : ''}`}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      {/* Email field - inline and specific */}
      <div className="form-field">
        <label className="required">
          <span className="field-icon">📧</span>
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          placeholder="your@email.com"
          autoComplete="email"
          className={`form-input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <span className="error-text">{errors.email}</span>}
      </div>

      {/* Subject field - specific to this form */}
      <div className="form-field">
        <label className="required">Subject</label>
        <select
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          className={`form-input ${errors.subject ? 'error' : ''}`}
        >
          <option value="">Choose a subject</option>
          <option value="support">Technical Support</option>
          <option value="billing">Billing Question</option>
          <option value="feature">Feature Request</option>
        </select>
        {errors.subject && <span className="error-text">{errors.subject}</span>}
      </div>

      {/* Message field - with specific character counter */}
      <div className="form-field">
        <label className="required">Message</label>
        <textarea
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Describe your inquiry..."
          maxLength={500}
          rows={4}
          className={`form-input ${errors.message ? 'error' : ''}`}
        />
        <div className="field-footer">
          <small className="help-text">Please be as specific as possible</small>
          <span className="char-count">{formData.message.length}/500</span>
        </div>
        {errors.message && <span className="error-text">{errors.message}</span>}
      </div>

      <button type="submit" className="submit-btn">
        Send Message
      </button>
    </form>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Simple, specific components instead of universal abstraction
// WHY: Each widget has unique requirements - copying is clearer and more maintainable

function SalesChart({ data, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    await onRefresh();
    setIsLoading(false);
  };

  return (
    <div className="sales-chart-widget">
      <div className="widget-header">
        <h3>Monthly Sales</h3>
        <button onClick={handleRefresh} disabled={isLoading}>
          🔄 {isLoading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      
      <div className="chart-container">
        {/* Specific chart implementation for sales data */}
        <div className="line-chart">
          <div className="chart-placeholder">
            📈 Line Chart: Monthly Revenue Trends
          </div>
          {/* Real chart library would go here */}
        </div>
      </div>
      
      <div className="chart-legend">
        <span className="legend-item">
          <span className="color-dot blue"></span> Revenue
        </span>
        <span className="legend-item">
          <span className="color-dot green"></span> Target
        </span>
      </div>
    </div>
  );
}

function UserCountWidget({ data, onRefresh }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    await onRefresh();
    setIsLoading(false);
  };

  // Specific logic for user count display
  const userCount = data?.count || 12547;
  const growth = data?.growth || 12;
  const isPositiveGrowth = growth > 0;

  return (
    <div className="user-count-widget dark-theme">
      <div className="widget-header">
        <h3>Total Users</h3>
        <button onClick={handleRefresh} disabled={isLoading} className="icon-btn">
          🔄
        </button>
      </div>
      
      <div className="metric-display">
        <div className="big-number">
          {userCount.toLocaleString()}
        </div>
        <div className={`trend ${isPositiveGrowth ? 'positive' : 'negative'}`}>
          {isPositiveGrowth ? '📈' : '📉'} {Math.abs(growth)}% vs last month
        </div>
      </div>
      
      <div className="user-breakdown">
        <div className="breakdown-item">
          <span className="label">Active Today</span>
          <span className="value">{Math.floor(userCount * 0.23).toLocaleString()}</span>
        </div>
        <div className="breakdown-item">
          <span className="label">New This Week</span>
          <span className="value">{Math.floor(userCount * 0.05).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function RecentOrdersWidget({ data, onExport }) {
  const [sortBy, setSortBy] = useState<'id' | 'customer' | 'amount'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock data - in real app would come from props
  const orders = [
    { id: '12345', customer: 'John Doe', amount: 299.99, status: 'completed' },
    { id: '12346', customer: 'Jane Smith', amount: 149.50, status: 'pending' },
    { id: '12347', customer: 'Bob Johnson', amount: 75.00, status: 'completed' },
    { id: '12348', customer: 'Alice Brown', amount: 199.99, status: 'processing' },
    { id: '12349', customer: 'Charlie Wilson', amount: 89.99, status: 'completed' }
  ];

  const sortedOrders = [...orders].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    const result = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return sortOrder === 'asc' ? result : -result;
  });

  const handleSort = (column: 'id' | 'customer' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <div className="recent-orders-widget">
      <div className="widget-header">
        <h3>Recent Orders</h3>
        <button onClick={onExport} className="export-btn">
          📊 Export
        </button>
      </div>
      
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th 
                className="sortable" 
                onClick={() => handleSort('id')}
              >
                Order ID
                {sortBy === 'id' && <span className="sort-indicator">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('customer')}
              >
                Customer
                {sortBy === 'customer' && <span className="sort-indicator">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSort('amount')}
              >
                Amount
                {sortBy === 'amount' && <span className="sort-indicator">
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </span>}
              </th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders.map(order => (
              <tr key={order.id}>
                <td className="order-id">#{order.id}</td>
                <td className="customer-name">{order.customer}</td>
                <td className="amount">${order.amount.toFixed(2)}</td>
                <td>
                  <span className={`status-badge status-${order.status}`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <span className="results-count">
          Showing 5 of 127 orders
        </span>
        <button className="view-all-btn">View All Orders →</button>
      </div>
    </div>
  );
}

// Simple, clear dashboard without over-abstraction
function Dashboard() {
  const handleRefreshSales = async () => {
    console.log('Refreshing sales data...');
    // Specific sales refresh logic
  };

  const handleRefreshUsers = async () => {
    console.log('Refreshing user count...');
    // Specific user count refresh logic
  };

  const handleExportOrders = () => {
    console.log('Exporting orders to CSV...');
    // Specific orders export logic
  };

  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>
      
      <div className="widgets-grid">
        <div className="widget-slot large">
          <SalesChart 
            data={{}} 
            onRefresh={handleRefreshSales}
          />
        </div>
        
        <div className="widget-slot small">
          <UserCountWidget 
            data={{}} 
            onRefresh={handleRefreshUsers}
          />
        </div>
        
        <div className="widget-slot medium">
          <RecentOrdersWidget 
            data={{}} 
            onExport={handleExportOrders}
          />
        </div>
      </div>
    </div>
  );
}

// ===== BONUS: When to Extract vs When to Copy =====

// ✅ GOOD: Extract when you have genuine reuse (3+ places)
function LoadingSpinner({ size = 'medium' }: { size?: 'small' | 'medium' | 'large' }) {
  return <div className={`spinner spinner-${size}`}>⟳</div>;
}

// ✅ GOOD: Copy when components are similar but have different purposes
function PrimaryButton({ onClick, children, disabled = false }) {
  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className="btn btn-primary"
    >
      {children}
    </button>
  );
}

function DangerButton({ onClick, children, disabled = false, confirmText }) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (confirmText && !showConfirm) {
      setShowConfirm(true);
    } else {
      onClick();
      setShowConfirm(false);
    }
  };

  return (
    <div className="danger-button-container">
      <button 
        onClick={handleClick}
        disabled={disabled}
        className="btn btn-danger"
      >
        {showConfirm ? `Confirm: ${confirmText}` : children}
      </button>
      {showConfirm && (
        <button 
          onClick={() => setShowConfirm(false)}
          className="btn btn-secondary btn-small"
        >
          Cancel
        </button>
      )}
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Copy Similar Components**: When components look similar but serve different purposes
   - EmailVerificationItem vs PhoneVerificationItem vs AddressVerificationItem
   - Each has unique styling, behavior, and help text

2. **Inline Form Fields**: For forms used in one place
   - No need for complex abstractions when requirements are specific
   - Easier to understand and modify

3. **Specific Widget Components**: Instead of universal abstractions
   - SalesChart has chart-specific logic and styling
   - UserCountWidget has metric-specific display and calculations
   - RecentOrdersWidget has table-specific sorting and formatting

4. **Benefits of Copying**:
   - Easier to understand and modify
   - No cognitive overhead of learning abstractions
   - Components can evolve independently
   - Less coupling between different use cases

5. **When to Extract**:
   - ✅ Genuine reuse across 3+ components
   - ✅ Complex logic that benefits from isolation
   - ✅ Testing or debugging would be easier
   - ✅ The abstraction actually simplifies the code

6. **When to Copy**:
   - ✅ Similar-looking but different-purpose components
   - ✅ One-off forms or layouts
   - ✅ Components that might evolve differently
   - ✅ When abstraction adds more complexity than it removes

DECISION FRAMEWORK:
Ask yourself:
- Is this used in 3+ places? → Consider extracting
- Do the use cases have different requirements? → Copy
- Would the abstraction be simpler than the copies? → Extract
- Are you solving a real problem or a hypothetical one? → Copy for hypothetical

ANTI-PATTERNS TO AVOID:
- ❌ Extracting because code "looks similar"
- ❌ Creating abstractions for 1-2 use cases
- ❌ Over-configurable components with dozens of props
- ❌ Premature optimization for "future flexibility"
- ❌ DRY for the sake of DRY without considering maintainability
*/