// INTERFACE SEGREGATION TEST
// Fix the code violations below - each example has components that depend on props they don't use
// GOAL: Create focused prop interfaces where components only receive what they need

import React, { useState } from 'react';
import type { User, Product } from '../src/types';

// ===== EASY =====
// Problem: Component receives entire user object but only uses a few properties
interface UserCardProps {
  user: User; // Contains 20+ properties but only uses 3-4
  showEditButton?: boolean;
  showDeleteButton?: boolean;
  onEdit?: (userId: string) => void;
  onDelete?: (userId: string) => void;
  className?: string;
}

function UserCard({ 
  user, 
  showEditButton = true, 
  showDeleteButton = true, 
  onEdit, 
  onDelete, 
  className 
}: UserCardProps) {
  // Component only uses: user.id, user.firstName, user.lastName, user.email
  // But receives entire User object with many unused properties
  return (
    <div className={`user-card ${className || ''}`}>
      <h3>{user.firstName} {user.lastName}</h3>
      <p>{user.email}</p>
      
      <div className="actions">
        {showEditButton && onEdit && (
          <button onClick={() => onEdit(user.id)}>Edit</button>
        )}
        {showDeleteButton && onDelete && (
          <button onClick={() => onDelete(user.id)}>Delete</button>
        )}
      </div>
    </div>
  );
}

// Usage demonstrating the problem
function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  
  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user} // Passing entire user object
          onEdit={(id) => console.log('Edit user', id)}
          onDelete={(id) => console.log('Delete user', id)}
        />
      ))}
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Dashboard widget component with massive props interface
interface DashboardWidgetProps {
  // Widget configuration
  widgetId: string;
  title: string;
  description?: string;
  
  // Data props (most widgets don't use all of these)
  user: User;
  products: Product[];
  orders: any[];
  analytics: any;
  settings: any;
  notifications: any[];
  permissions: any;
  theme: any;
  
  // Display options (most widgets don't use all of these)
  showHeader?: boolean;
  showFooter?: boolean;
  showBorder?: boolean;
  showShadow?: boolean;
  showRefreshButton?: boolean;
  showExportButton?: boolean;
  showHelpButton?: boolean;
  showFullscreenButton?: boolean;
  
  // Styling props (most widgets don't use all of these)
  width?: string;
  height?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  
  // Event handlers (most widgets don't use all of these)
  onRefresh?: () => void;
  onExport?: (format: string) => void;
  onHelp?: () => void;
  onFullscreen?: () => void;
  onClose?: () => void;
  onMove?: (position: { x: number; y: number }) => void;
  onResize?: (size: { width: number; height: number }) => void;
  
  // Feature flags (most widgets don't use all of these)
  enableDragDrop?: boolean;
  enableResize?: boolean;
  enableRefresh?: boolean;
  enableExport?: boolean;
  enableAnimation?: boolean;
  enableTooltips?: boolean;
  enableKeyboardNav?: boolean;
}

// Simple stats widget that only needs a fraction of these props
function StatsWidget(props: DashboardWidgetProps) {
  // This widget only uses: title, user.id, analytics.stats, onRefresh
  // But receives 30+ props it doesn't need
  
  return (
    <div className="stats-widget">
      <h3>{props.title}</h3>
      <div className="stats">
        <div>Total Users: {props.analytics?.stats?.totalUsers || 0}</div>
        <div>Active Users: {props.analytics?.stats?.activeUsers || 0}</div>
        <div>Revenue: ${props.analytics?.stats?.revenue || 0}</div>
      </div>
      {props.onRefresh && (
        <button onClick={props.onRefresh}>Refresh</button>
      )}
    </div>
  );
}

// Chart widget that uses different props than stats widget
function ChartWidget(props: DashboardWidgetProps) {
  // This widget only uses: title, analytics.chartData, showExportButton, onExport
  // But receives 30+ props it doesn't need
  
  return (
    <div className="chart-widget">
      <h3>{props.title}</h3>
      <div className="chart-placeholder">
        Chart goes here with data: {JSON.stringify(props.analytics?.chartData)}
      </div>
      {props.showExportButton && props.onExport && (
        <button onClick={() => props.onExport('png')}>Export</button>
      )}
    </div>
  );
}

// Recent orders widget with yet different prop usage
function RecentOrdersWidget(props: DashboardWidgetProps) {
  // This widget only uses: title, orders, user.permissions
  // But receives 30+ props it doesn't need
  
  const canViewOrders = props.user?.subscriptionLevel === 'premium';
  
  return (
    <div className="orders-widget">
      <h3>{props.title}</h3>
      {canViewOrders ? (
        <ul>
          {props.orders?.slice(0, 5).map((order, index) => (
            <li key={index}>{order.id} - ${order.total}</li>
          ))}
        </ul>
      ) : (
        <p>Upgrade to premium to view orders</p>
      )}
    </div>
  );
}

// Usage showing how all widgets get the same massive props object
function Dashboard() {
  const dashboardData = {
    user: {} as User,
    products: [] as Product[],
    orders: [],
    analytics: { stats: {}, chartData: {} },
    settings: {},
    notifications: [],
    permissions: {},
    theme: {}
  };

  const commonProps: Omit<DashboardWidgetProps, 'widgetId' | 'title'> = {
    ...dashboardData,
    showHeader: true,
    showRefreshButton: true,
    enableDragDrop: true,
    onRefresh: () => console.log('refresh'),
    onExport: (format) => console.log('export', format),
    // ... many more props that most widgets don't use
  };

  return (
    <div className="dashboard">
      <StatsWidget
        widgetId="stats"
        title="Statistics"
        {...commonProps} // Passing all props to every widget!
      />
      <ChartWidget
        widgetId="chart"
        title="Analytics Chart"
        {...commonProps} // Passing all props to every widget!
      />
      <RecentOrdersWidget
        widgetId="orders"
        title="Recent Orders"
        {...commonProps} // Passing all props to every widget!
      />
    </div>
  );
}

// ===== HARD =====
// Problem: Complex form component with unfocused interface
interface MegaFormProps {
  // Form configuration
  formId: string;
  title: string;
  description?: string;
  
  // All possible form data (most forms don't use all of these)
  personalInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    dateOfBirth?: string;
  };
  
  businessInfo?: {
    companyName?: string;
    industry?: string;
    taxId?: string;
    employees?: number;
  };
  
  addressInfo?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  
  preferenceInfo?: {
    newsletter?: boolean;
    notifications?: boolean;
    theme?: string;
    language?: string;
  };
  
  paymentInfo?: {
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    billingAddress?: any;
  };
  
  // All possible validation rules (most forms don't use all of these)
  validationRules?: {
    personalInfo?: any;
    businessInfo?: any;
    addressInfo?: any;
    preferenceInfo?: any;
    paymentInfo?: any;
  };
  
  // All possible display options (most forms don't use all of these)
  showPersonalSection?: boolean;
  showBusinessSection?: boolean;
  showAddressSection?: boolean;
  showPreferenceSection?: boolean;
  showPaymentSection?: boolean;
  showProgressBar?: boolean;
  showStepNumbers?: boolean;
  showSaveButton?: boolean;
  showResetButton?: boolean;
  showCancelButton?: boolean;
  
  // All possible event handlers (most forms don't use all of these)
  onPersonalInfoChange?: (info: any) => void;
  onBusinessInfoChange?: (info: any) => void;
  onAddressInfoChange?: (info: any) => void;
  onPreferenceInfoChange?: (info: any) => void;
  onPaymentInfoChange?: (info: any) => void;
  onSave?: (data: any) => void;
  onReset?: () => void;
  onCancel?: () => void;
  onStepChange?: (step: number) => void;
  onValidationError?: (errors: any) => void;
  
  // All possible styling (most forms don't use all of these)
  containerClassName?: string;
  sectionClassName?: string;
  fieldClassName?: string;
  buttonClassName?: string;
  errorClassName?: string;
  containerStyle?: React.CSSProperties;
  sectionStyle?: React.CSSProperties;
  fieldStyle?: React.CSSProperties;
  buttonStyle?: React.CSSProperties;
}

// Simple contact form that only needs a fraction of these props
function ContactFormSimple(props: MegaFormProps) {
  // This form only uses: title, personalInfo (firstName, email), onSave
  // But receives 50+ props it doesn't need
  
  const [formData, setFormData] = useState({
    firstName: props.personalInfo?.firstName || '',
    email: props.personalInfo?.email || ''
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (props.onSave) {
      props.onSave({ personalInfo: formData });
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>{props.title}</h2>
      <input
        type="text"
        placeholder="First Name"
        value={formData.firstName}
        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
      />
      <button type="submit">Send Message</button>
    </form>
  );
}

// Business registration form that uses different props
function BusinessRegistrationForm(props: MegaFormProps) {
  // This form only uses: title, businessInfo, addressInfo, onSave, showProgressBar
  // But receives 50+ props it doesn't need
  
  const [businessData, setBusinessData] = useState({
    companyName: props.businessInfo?.companyName || '',
    industry: props.businessInfo?.industry || '',
    street: props.addressInfo?.street || '',
    city: props.addressInfo?.city || ''
  });
  
  return (
    <form>
      <h2>{props.title}</h2>
      {props.showProgressBar && <div className="progress-bar">Step 1 of 2</div>}
      
      <input
        type="text"
        placeholder="Company Name"
        value={businessData.companyName}
        onChange={(e) => setBusinessData(prev => ({ ...prev, companyName: e.target.value }))}
      />
      <select
        value={businessData.industry}
        onChange={(e) => setBusinessData(prev => ({ ...prev, industry: e.target.value }))}
      >
        <option value="">Select Industry</option>
        <option value="tech">Technology</option>
        <option value="finance">Finance</option>
      </select>
      <input
        type="text"
        placeholder="Street Address"
        value={businessData.street}
        onChange={(e) => setBusinessData(prev => ({ ...prev, street: e.target.value }))}
      />
      <input
        type="text"
        placeholder="City"
        value={businessData.city}
        onChange={(e) => setBusinessData(prev => ({ ...prev, city: e.target.value }))}
      />
    </form>
  );
}

// Payment form that uses yet different props
function PaymentFormComplex(props: MegaFormProps) {
  // This form only uses: title, paymentInfo, onPaymentInfoChange, onSave
  // But receives 50+ props it doesn't need
  
  const [paymentData, setPaymentData] = useState({
    cardNumber: props.paymentInfo?.cardNumber || '',
    expiryDate: props.paymentInfo?.expiryDate || '',
    cvv: props.paymentInfo?.cvv || ''
  });
  
  const handlePaymentChange = (field: string, value: string) => {
    const newData = { ...paymentData, [field]: value };
    setPaymentData(newData);
    
    if (props.onPaymentInfoChange) {
      props.onPaymentInfoChange(newData);
    }
  };
  
  return (
    <form>
      <h2>{props.title}</h2>
      <input
        type="text"
        placeholder="Card Number"
        value={paymentData.cardNumber}
        onChange={(e) => handlePaymentChange('cardNumber', e.target.value)}
      />
      <input
        type="text"
        placeholder="MM/YY"
        value={paymentData.expiryDate}
        onChange={(e) => handlePaymentChange('expiryDate', e.target.value)}
      />
      <input
        type="text"
        placeholder="CVV"
        value={paymentData.cvv}
        onChange={(e) => handlePaymentChange('cvv', e.target.value)}
      />
      {props.onSave && (
        <button onClick={() => props.onSave({ paymentInfo: paymentData })}>
          Save Payment Info
        </button>
      )}
    </form>
  );
}

// Usage showing how all forms get the same massive props object
function FormExamples() {
  const allFormData = {
    personalInfo: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
    businessInfo: { companyName: 'Acme Corp' },
    addressInfo: { street: '123 Main St', city: 'Anytown' },
    paymentInfo: { cardNumber: '****' }
  };
  
  const commonFormProps: Omit<MegaFormProps, 'formId' | 'title'> = {
    ...allFormData,
    showPersonalSection: true,
    showBusinessSection: true,
    showAddressSection: true,
    showPaymentSection: true,
    showProgressBar: true,
    onSave: (data) => console.log('save', data),
    onPersonalInfoChange: (info) => console.log('personal change', info),
    onBusinessInfoChange: (info) => console.log('business change', info),
    onPaymentInfoChange: (info) => console.log('payment change', info),
    // ... many more props that most forms don't use
  };
  
  return (
    <div>
      <ContactFormSimple
        formId="contact"
        title="Contact Us"
        {...commonFormProps} // Passing all props to every form!
      />
      <BusinessRegistrationForm
        formId="business"
        title="Register Business"
        {...commonFormProps} // Passing all props to every form!
      />
      <PaymentFormComplex
        formId="payment"
        title="Payment Information"
        {...commonFormProps} // Passing all props to every form!
      />
    </div>
  );
}