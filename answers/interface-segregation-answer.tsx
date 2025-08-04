// INTERFACE SEGREGATION - CORRECT IMPLEMENTATIONS  
// This file shows how to create focused prop interfaces where components only receive what they need

import React, { useState } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Create focused interface that only includes what the component needs
// WHY: Reduces coupling, improves reusability, and makes components easier to test

// Instead of passing entire User object, define minimal interface
interface UserCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}

function UserCard({ 
  id,
  firstName,
  lastName,
  email,
  showEditButton = true, 
  showDeleteButton = true, 
  onEdit, 
  onDelete, 
  className 
}: UserCardProps) {
  // ✅ Component only receives exactly what it needs
  // No unused props, clear dependencies, easy to test
  return (
    <div className={`user-card ${className || ''}`}>
      <h3>{firstName} {lastName}</h3>
      <p>{email}</p>
      
      <div className="actions">
        {showEditButton && onEdit && (
          <button onClick={() => onEdit(id)}>Edit</button>
        )}
        {showDeleteButton && onDelete && (
          <button onClick={() => onDelete(id)}>Delete</button>
        )}
      </div>
    </div>
  );
}

// Helper function to extract needed props from full user object
function extractUserCardProps(user: any): Omit<UserCardProps, 'onEdit' | 'onDelete' | 'showEditButton' | 'showDeleteButton'> {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email
  };
}

// Usage demonstrating the solution
function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  
  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          {...extractUserCardProps(user)} // Extract only needed props
          onEdit={(id) => console.log('Edit user', id)}
          onDelete={(id) => console.log('Delete user', id)}
        />
      ))}
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Create specific interfaces for different widget types
// WHY: Each widget gets only the props it needs, making them more focused and testable

// Base widget interface for common properties
interface BaseWidgetProps {
  widgetId: string;
  title: string;
  description?: string;
  className?: string;
}

// Specific interface for stats widget
interface StatsWidgetProps extends BaseWidgetProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    revenue: number;
  };
  onRefresh?: () => void;
  showRefreshButton?: boolean;
}

// Specific interface for chart widget  
interface ChartWidgetProps extends BaseWidgetProps {
  chartData: any;
  chartType?: 'line' | 'bar' | 'pie';
  showExportButton?: boolean;
  onExport?: (format: string) => void;
}

// Specific interface for orders widget
interface OrdersWidgetProps extends BaseWidgetProps {
  orders: Array<{ id: string; total: number; customerName: string }>;
  userPermissions?: {
    canViewOrders: boolean;
    subscriptionLevel: string;
  };
  maxItems?: number;
}

// ✅ Stats widget with focused interface
function StatsWidget({ 
  title, 
  stats, 
  onRefresh, 
  showRefreshButton = false,
  className 
}: StatsWidgetProps) {
  return (
    <div className={`stats-widget ${className || ''}`}>
      <h3>{title}</h3>
      <div className="stats">
        <div>Total Users: {stats.totalUsers}</div>
        <div>Active Users: {stats.activeUsers}</div>
        <div>Revenue: ${stats.revenue}</div>
      </div>
      {showRefreshButton && onRefresh && (
        <button onClick={onRefresh}>Refresh</button>
      )}
    </div>
  );
}

// ✅ Chart widget with focused interface
function ChartWidget({ 
  title, 
  chartData, 
  chartType = 'line',
  showExportButton = false, 
  onExport,
  className 
}: ChartWidgetProps) {
  return (
    <div className={`chart-widget ${className || ''}`}>
      <h3>{title}</h3>
      <div className="chart-placeholder">
        {chartType.toUpperCase()} Chart: {JSON.stringify(chartData)}
      </div>
      {showExportButton && onExport && (
        <button onClick={() => onExport('png')}>Export PNG</button>
      )}
      {showExportButton && onExport && (
        <button onClick={() => onExport('pdf')}>Export PDF</button>
      )}
    </div>
  );
}

// ✅ Orders widget with focused interface
function RecentOrdersWidget({ 
  title, 
  orders, 
  userPermissions,
  maxItems = 5,
  className 
}: OrdersWidgetProps) {
  const canViewOrders = userPermissions?.canViewOrders || 
                       userPermissions?.subscriptionLevel === 'premium';
  
  return (
    <div className={`orders-widget ${className || ''}`}>
      <h3>{title}</h3>
      {canViewOrders ? (
        <ul>
          {orders.slice(0, maxItems).map(order => (
            <li key={order.id}>
              {order.id} - {order.customerName} - ${order.total}
            </li>
          ))}
        </ul>
      ) : (
        <p>Upgrade to premium to view orders</p>
      )}
    </div>
  );
}

// Usage with properly segregated props
function Dashboard() {
  // Sample data that would come from API/state
  const dashboardData = {
    stats: {
      totalUsers: 1250,
      activeUsers: 890,
      revenue: 45600
    },
    chartData: { 
      labels: ['Jan', 'Feb', 'Mar'], 
      values: [100, 150, 200] 
    },
    orders: [
      { id: '001', customerName: 'John Doe', total: 99.99 },
      { id: '002', customerName: 'Jane Smith', total: 149.50 }
    ],
    userPermissions: {
      canViewOrders: true,
      subscriptionLevel: 'premium'
    }
  };

  return (
    <div className="dashboard">
      {/* ✅ Each widget gets exactly what it needs */}
      <StatsWidget
        widgetId="stats"
        title="Statistics"
        stats={dashboardData.stats}
        showRefreshButton={true}
        onRefresh={() => console.log('refresh stats')}
      />
      
      <ChartWidget
        widgetId="chart"
        title="Analytics Chart"
        chartData={dashboardData.chartData}
        chartType="bar"
        showExportButton={true}
        onExport={(format) => console.log('export chart as', format)}
      />
      
      <RecentOrdersWidget
        widgetId="orders"
        title="Recent Orders"
        orders={dashboardData.orders}
        userPermissions={dashboardData.userPermissions}
        maxItems={3}
      />
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Create specific form interfaces instead of one mega interface
// WHY: Each form type has focused props, easier to maintain and understand

// Common form props
interface BaseFormProps {
  formId: string;
  title: string;
  description?: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  disabled?: boolean;
  className?: string;
}

// Contact form specific props
interface ContactFormProps extends BaseFormProps {
  initialData?: {
    firstName?: string;
    email?: string;
    message?: string;
  };
  onFieldChange?: (field: string, value: string) => void;
  showMessageField?: boolean;
  maxMessageLength?: number;
}

// Business registration form specific props  
interface BusinessFormProps extends BaseFormProps {
  initialData?: {
    companyName?: string;
    industry?: string;
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  showProgressBar?: boolean;
  industries?: Array<{ value: string; label: string }>;
  onStepChange?: (step: number) => void;
}

// Payment form specific props
interface PaymentFormProps extends BaseFormProps {
  initialData?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    cardholderName?: string;
  };
  onPaymentDataChange?: (paymentData: any) => void;
  acceptedCardTypes?: string[];
  showSecurityInfo?: boolean;
  requiresBillingAddress?: boolean;
}

// ✅ Focused contact form
function ContactForm({ 
  title, 
  initialData, 
  onSubmit, 
  onFieldChange,
  showMessageField = true,
  maxMessageLength = 500,
  disabled = false,
  className 
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    email: initialData?.email || '',
    message: initialData?.message || ''
  });
  
  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onFieldChange?.(field, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <h2>{title}</h2>
      
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => handleFieldChange('firstName', e.target.value)}
        disabled={disabled}
        required
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => handleFieldChange('email', e.target.value)}
        disabled={disabled}
        required
      />
      
      {showMessageField && (
        <textarea
          placeholder="Message"
          value={formData.message}
          onChange={(e) => handleFieldChange('message', e.target.value)}
          maxLength={maxMessageLength}
          disabled={disabled}
          required
        />
      )}
      
      <button type="submit" disabled={disabled}>
        Send Message
      </button>
    </form>
  );
}

// ✅ Focused business registration form
function BusinessRegistrationForm({ 
  title, 
  initialData, 
  onSubmit,
  showProgressBar = false,
  industries = [],
  onStepChange,
  disabled = false,
  className 
}: BusinessFormProps) {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    industry: initialData?.industry || '',
    street: initialData?.street || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    zipCode: initialData?.zipCode || ''
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  
  const handleStepChange = (step: number) => {
    setCurrentStep(step);
    onStepChange?.(step);
  };
  
  return (
    <form className={className}>
      <h2>{title}</h2>
      
      {showProgressBar && (
        <div className="progress-bar">
          Step {currentStep} of 2
          <div className="progress-steps">
            <button 
              type="button" 
              onClick={() => handleStepChange(1)}
              className={currentStep === 1 ? 'active' : ''}
            >
              Business Info
            </button>
            <button 
              type="button" 
              onClick={() => handleStepChange(2)}
              className={currentStep === 2 ? 'active' : ''}
            >
              Address
            </button>
          </div>
        </div>
      )}
      
      {currentStep === 1 && (
        <div className="business-info-step">
          <input
            type="text"
            placeholder="Company Name"
            value={formData.companyName}
            onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
            disabled={disabled}
            required
          />
          
          <select
            value={formData.industry}
            onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
            disabled={disabled}
            required
          >
            <option value="">Select Industry</option>
            {industries.length > 0 ? (
              industries.map(industry => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))
            ) : (
              <>
                <option value="tech">Technology</option>
                <option value="finance">Finance</option>
                <option value="healthcare">Healthcare</option>
                <option value="retail">Retail</option>
              </>
            )}
          </select>
          
          <button type="button" onClick={() => handleStepChange(2)}>
            Next: Address
          </button>
        </div>
      )}
      
      {currentStep === 2 && (
        <div className="address-step">
          <input
            type="text"
            placeholder="Street Address"
            value={formData.street}
            onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))}
            disabled={disabled}
            required
          />
          
          <div className="city-state-row">
            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              disabled={disabled}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={formData.state}
              onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
              disabled={disabled}
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={formData.zipCode}
              onChange={(e) => setFormData(prev => ({ ...prev, zipCode: e.target.value }))}
              disabled={disabled}
              required
            />
          </div>
          
          <div className="form-actions">
            <button type="button" onClick={() => handleStepChange(1)}>
              Back
            </button>
            <button type="submit" onClick={() => onSubmit?.(formData)} disabled={disabled}>
              Register Business
            </button>
          </div>
        </div>
      )}
    </form>
  );
}

// ✅ Focused payment form
function PaymentForm({ 
  title, 
  initialData, 
  onSubmit,
  onPaymentDataChange,
  acceptedCardTypes = ['visa', 'mastercard', 'amex'],
  showSecurityInfo = true,
  requiresBillingAddress = false,
  disabled = false,
  className 
}: PaymentFormProps) {
  const [paymentData, setPaymentData] = useState({
    cardNumber: initialData?.cardNumber || '',
    expiryDate: initialData?.expiryDate || '',
    cvv: initialData?.cvv || '',
    cardholderName: initialData?.cardholderName || ''
  });
  
  const handlePaymentChange = (field: string, value: string) => {
    const newData = { ...paymentData, [field]: value };
    setPaymentData(newData);
    onPaymentDataChange?.(newData);
  };
  
  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };
  
  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
  };
  
  return (
    <form className={className}>
      <h2>{title}</h2>
      
      {showSecurityInfo && (
        <div className="security-info">
          <p>🔒 Your payment information is encrypted and secure</p>
          <p>Accepted cards: {acceptedCardTypes.join(', ').toUpperCase()}</p>
        </div>
      )}
      
      <input
        type="text"
        placeholder="Cardholder Name"
        value={paymentData.cardholderName}
        onChange={(e) => handlePaymentChange('cardholderName', e.target.value)}
        disabled={disabled}
        required
      />
      
      <input
        type="text"
        placeholder="Card Number"
        value={formatCardNumber(paymentData.cardNumber)}
        onChange={(e) => handlePaymentChange('cardNumber', e.target.value.replace(/\s/g, ''))}
        maxLength={19}
        disabled={disabled}
        required
      />
      
      <div className="payment-row">
        <input
          type="text"
          placeholder="MM/YY"
          value={formatExpiryDate(paymentData.expiryDate)}
          onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
          maxLength={5}
          disabled={disabled}
          required
        />
        <input
          type="text"
          placeholder="CVV"
          value={paymentData.cvv}
          onChange={(e) => handlePaymentChange('cvv', e.target.value.replace(/\D/g, ''))}
          maxLength={4}
          disabled={disabled}
          required
        />
      </div>
      
      {requiresBillingAddress && (
        <div className="billing-address">
          <h4>Billing Address</h4>
          {/* Billing address fields would go here */}
          <p>Billing address fields...</p>
        </div>
      )}
      
      <button 
        type="submit" 
        onClick={() => onSubmit?.(paymentData)} 
        disabled={disabled}
      >
        Save Payment Method
      </button>
    </form>
  );
}

// Usage with properly segregated form props
function FormExamples() {
  return (
    <div className="form-examples">
      {/* ✅ Each form gets exactly the props it needs */}
      <ContactForm
        formId="contact"
        title="Contact Us"
        showMessageField={true}
        maxMessageLength={300}
        onSubmit={(data) => console.log('Contact form:', data)}
        onFieldChange={(field, value) => console.log('Field changed:', field, value)}
      />
      
      <BusinessRegistrationForm
        formId="business"
        title="Register Your Business"
        showProgressBar={true}
        industries={[
          { value: 'saas', label: 'Software as a Service' },
          { value: 'ecommerce', label: 'E-commerce' },
          { value: 'consulting', label: 'Consulting' }
        ]}
        onSubmit={(data) => console.log('Business form:', data)}
        onStepChange={(step) => console.log('Step:', step)}
      />
      
      <PaymentForm
        formId="payment"
        title="Payment Information"
        acceptedCardTypes={['visa', 'mastercard']}
        showSecurityInfo={true}
        requiresBillingAddress={false}
        onSubmit={(data) => console.log('Payment form:', data)}
        onPaymentDataChange={(data) => console.log('Payment data:', data)}
      />
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Single Responsibility for Props**: Each prop interface serves one specific purpose
   - UserCardProps only contains user display data and actions
   - StatsWidgetProps only contains stats-related data
   - ContactFormProps only contains contact form needs

2. **No Unused Dependencies**: Components never receive props they don't use
   - Reduces coupling between components and data sources
   - Makes components easier to test and reason about
   - Prevents unnecessary re-renders

3. **Composition over Large Interfaces**: Build focused interfaces from smaller pieces
   - BaseFormProps provides common form functionality
   - Specific form props extend the base with their unique needs
   - Widget props follow similar pattern

4. **Clear Component Contracts**: Props clearly document what each component needs
   - Easy to understand component requirements
   - TypeScript helps enforce correct usage
   - Refactoring becomes safer

5. **Improved Testability**: Focused interfaces make testing easier
   - Mock only the props actually used
   - Test scenarios are clearer
   - Less setup required for tests

INTERFACE SEGREGATION CHECKLIST:
✅ Components only receive props they actually use  
✅ Prop interfaces are focused on single responsibilities
✅ Large interfaces are broken into smaller, specific ones
✅ Common functionality is shared through composition
✅ Component dependencies are clear and minimal
✅ Props are typed specifically, not with generic objects
✅ Unused props are eliminated from interfaces
✅ Related props are grouped logically

BENEFITS OF PROPER INTERFACE SEGREGATION:
- Reduced coupling between components
- Easier testing and mocking
- Better TypeScript inference and checking
- Clearer component responsibilities
- Improved reusability across different contexts
- Safer refactoring and maintenance
- Better performance (fewer unnecessary prop changes)
*/