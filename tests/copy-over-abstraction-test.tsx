// COPY OVER ABSTRACTION TEST
// Fix the code violations below - each example abstracts too early instead of copying
// GOAL: Prefer copying JSX and logic until abstraction provides real benefit

import React, { useState } from 'react';

// ===== EASY =====
// Problem: Premature abstraction of simple, similar but not identical components
interface StatusItemProps {
  type: 'email' | 'phone' | 'address';
  value: string;
  isVerified: boolean;
  onVerify: () => void;
  onEdit: () => void;
}

function StatusItem({ type, value, isVerified, onVerify, onEdit }: StatusItemProps) {
  const getIcon = () => {
    switch (type) {
      case 'email': return '📧';
      case 'phone': return '📱';
      case 'address': return '🏠';
      default: return '❓';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'email': return 'Email Address';
      case 'phone': return 'Phone Number';
      case 'address': return 'Home Address';
      default: return 'Item';
    }
  };

  const getVerifyText = () => {
    switch (type) {
      case 'email': return 'Send Verification Email';
      case 'phone': return 'Send SMS Code';
      case 'address': return 'Mail Verification Letter';
      default: return 'Verify';
    }
  };

  return (
    <div className={`status-item status-item-${type}`}>
      <div className="status-header">
        <span className="icon">{getIcon()}</span>
        <h3>{getLabel()}</h3>
        {isVerified && <span className="verified-badge">✅ Verified</span>}
      </div>
      
      <div className="status-content">
        <p className="value">{value}</p>
        <div className="actions">
          <button onClick={onEdit} className="edit-btn">
            Edit {type === 'email' ? 'Email' : type === 'phone' ? 'Phone' : 'Address'}
          </button>
          {!isVerified && (
            <button onClick={onVerify} className="verify-btn">
              {getVerifyText()}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Usage of the over-abstracted component
function UserVerificationStatus() {
  return (
    <div>
      <StatusItem 
        type="email"
        value="user@example.com"
        isVerified={true}
        onVerify={() => {}}
        onEdit={() => {}}
      />
      <StatusItem 
        type="phone"
        value="+1 (555) 123-4567"
        isVerified={false}
        onVerify={() => {}}
        onEdit={() => {}}
      />
      <StatusItem 
        type="address"
        value="123 Main St, City, ST 12345"
        isVerified={false}
        onVerify={() => {}}
        onEdit={() => {}}
      />
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Over-engineered form field abstraction used in only 2-3 places
interface FormFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  validation?: (value: string) => string | null;
  options?: Array<{ value: string; label: string }>;
  helpText?: string;
  icon?: string;
  suffix?: string;
  maxLength?: number;
  rows?: number;
  autoComplete?: string;
}

function DynamicFormField({ 
  config, 
  value, 
  onChange, 
  error 
}: { 
  config: FormFieldConfig; 
  value: string; 
  onChange: (value: string) => void; 
  error?: string; 
}) {
  const { 
    name, 
    label, 
    type, 
    placeholder, 
    required, 
    options, 
    helpText, 
    icon, 
    suffix, 
    maxLength, 
    rows, 
    autoComplete 
  } = config;

  const renderInput = () => {
    const commonProps = {
      value,
      onChange: (e: any) => onChange(e.target.value),
      placeholder,
      maxLength,
      autoComplete,
      className: `form-input ${error ? 'error' : ''}`
    };

    switch (type) {
      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{placeholder || 'Select...'}</option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      
      case 'textarea':
        return <textarea {...commonProps} rows={rows || 3} />;
      
      default:
        return <input {...commonProps} type={type} />;
    }
  };

  return (
    <div className="form-field">
      <label className={required ? 'required' : ''}>
        {icon && <span className="field-icon">{icon}</span>}
        {label}
      </label>
      
      <div className="input-wrapper">
        {renderInput()}
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      
      {helpText && <small className="help-text">{helpText}</small>}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}

// Only used in one place - over-abstracted!
function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldConfigs: FormFieldConfig[] = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      placeholder: 'Enter your name',
      required: true,
      icon: '👤',
      validation: (value) => value.length < 2 ? 'Name must be at least 2 characters' : null
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      placeholder: 'your@email.com',
      required: true,
      icon: '📧',
      autoComplete: 'email',
      validation: (value) => !/\S+@\S+\.\S+/.test(value) ? 'Invalid email format' : null
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'select',
      placeholder: 'Choose a subject',
      required: true,
      options: [
        { value: 'support', label: 'Technical Support' },
        { value: 'billing', label: 'Billing Question' },
        { value: 'feature', label: 'Feature Request' }
      ]
    },
    {
      name: 'message',
      label: 'Message',
      type: 'textarea',
      placeholder: 'Describe your inquiry...',
      required: true,
      maxLength: 500,
      rows: 4,
      helpText: 'Please be as specific as possible',
      suffix: `${formData.message.length}/500`
    }
  ];

  const updateField = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const config = fieldConfigs.find(c => c.name === name);
    if (config?.validation) {
      const error = config.validation(value);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  };

  return (
    <form className="contact-form">
      <h2>Contact Us</h2>
      {fieldConfigs.map(config => (
        <DynamicFormField
          key={config.name}
          config={config}
          value={formData[config.name as keyof typeof formData]}
          onChange={(value) => updateField(config.name, value)}
          error={errors[config.name]}
        />
      ))}
      <button type="submit">Send Message</button>
    </form>
  );
}

// ===== HARD =====
// Problem: Massively over-abstracted dashboard widget system
interface WidgetConfig {
  id: string;
  type: 'chart' | 'stat' | 'list' | 'table' | 'metric';
  title: string;
  size: 'sm' | 'md' | 'lg';
  refreshInterval?: number;
  dataSource: string;
  displayOptions: {
    showHeader?: boolean;
    showRefresh?: boolean;
    showExport?: boolean;
    theme?: 'light' | 'dark';
    colorScheme?: string[];
  };
  chartOptions?: {
    chartType?: 'line' | 'bar' | 'pie' | 'area';
    xAxis?: string;
    yAxis?: string;
    groupBy?: string;
    aggregation?: 'sum' | 'avg' | 'count' | 'max' | 'min';
  };
  tableOptions?: {
    columns?: Array<{
      key: string;
      label: string;
      sortable?: boolean;
      filterable?: boolean;
      formatter?: (value: any) => string;
    }>;
    pagination?: boolean;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  };
  listOptions?: {
    itemTemplate?: string;
    groupBy?: string;
    sortBy?: string;
    showAvatars?: boolean;
    showTimestamps?: boolean;
  };
  metricOptions?: {
    prefix?: string;
    suffix?: string;
    precision?: number;
    showTrend?: boolean;
    trendPeriod?: string;
    formatter?: 'number' | 'currency' | 'percentage';
  };
  filters?: Array<{
    field: string;
    operator: string;
    value: any;
  }>;
}

function UniversalWidget({ 
  config, 
  data, 
  onRefresh, 
  onExport 
}: { 
  config: WidgetConfig; 
  data: any; 
  onRefresh: () => void; 
  onExport: () => void; 
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [localData, setLocalData] = useState(data);

  const { 
    id, 
    type, 
    title, 
    size, 
    displayOptions, 
    chartOptions, 
    tableOptions, 
    listOptions, 
    metricOptions 
  } = config;

  const handleRefresh = async () => {
    setIsLoading(true);
    await onRefresh();
    setIsLoading(false);
  };

  const renderHeader = () => {
    if (!displayOptions.showHeader) return null;
    
    return (
      <div className={`widget-header widget-header-${displayOptions.theme}`}>
        <h3>{title}</h3>
        <div className="widget-actions">
          {displayOptions.showRefresh && (
            <button onClick={handleRefresh} disabled={isLoading}>
              🔄 {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          )}
          {displayOptions.showExport && (
            <button onClick={onExport}>📊 Export</button>
          )}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (!chartOptions) return null;
    
    const { chartType, xAxis, yAxis, groupBy, aggregation } = chartOptions;
    
    // Simulated chart rendering logic
    return (
      <div className={`chart chart-${chartType}`}>
        <div className="chart-placeholder">
          {chartType?.toUpperCase()} Chart
          <br />
          X: {xAxis}, Y: {yAxis}
          <br />
          Group: {groupBy}, Agg: {aggregation}
        </div>
      </div>
    );
  };

  const renderTable = () => {
    if (!tableOptions?.columns) return null;
    
    const { columns, pagination, pageSize, sortBy, sortOrder } = tableOptions;
    
    return (
      <div className="widget-table">
        <table>
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} className={col.sortable ? 'sortable' : ''}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localData?.slice(0, pageSize || 10).map((row: any, index: number) => (
              <tr key={index}>
                {columns.map(col => (
                  <td key={col.key}>
                    {col.formatter ? col.formatter(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {pagination && <div className="pagination">Pagination controls...</div>}
      </div>
    );
  };

  const renderList = () => {
    if (!listOptions) return null;
    
    const { showAvatars, showTimestamps, groupBy } = listOptions;
    
    return (
      <div className="widget-list">
        {localData?.map((item: any, index: number) => (
          <div key={index} className="list-item">
            {showAvatars && <div className="avatar">👤</div>}
            <div className="item-content">{JSON.stringify(item)}</div>
            {showTimestamps && <div className="timestamp">{new Date().toLocaleString()}</div>}
          </div>
        ))}
      </div>
    );
  };

  const renderMetric = () => {
    if (!metricOptions) return null;
    
    const { prefix, suffix, precision, formatter, showTrend } = metricOptions;
    const value = localData?.value || 0;
    
    let formattedValue = value;
    if (formatter === 'currency') formattedValue = `$${value.toFixed(precision || 2)}`;
    if (formatter === 'percentage') formattedValue = `${value.toFixed(precision || 1)}%`;
    
    return (
      <div className="widget-metric">
        <div className="metric-value">
          {prefix}{formattedValue}{suffix}
        </div>
        {showTrend && (
          <div className="metric-trend">
            📈 +12% vs last period
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    switch (type) {
      case 'chart': return renderChart();
      case 'table': return renderTable();
      case 'list': return renderList();
      case 'metric': return renderMetric();
      default: return <div>Unsupported widget type: {type}</div>;
    }
  };

  return (
    <div 
      className={`universal-widget widget-${size} theme-${displayOptions.theme}`}
      id={id}
    >
      {renderHeader()}
      <div className="widget-content">
        {renderContent()}
      </div>
    </div>
  );
}

// Over-complex usage - only 3 widgets but massive abstraction overhead
function Dashboard() {
  const widgetConfigs: WidgetConfig[] = [
    {
      id: 'sales-chart',
      type: 'chart',
      title: 'Monthly Sales',
      size: 'lg',
      dataSource: '/api/sales',
      displayOptions: {
        showHeader: true,
        showRefresh: true,
        theme: 'light'
      },
      chartOptions: {
        chartType: 'line',
        xAxis: 'month',
        yAxis: 'revenue',
        aggregation: 'sum'
      }
    },
    {
      id: 'user-count',
      type: 'metric',
      title: 'Total Users',
      size: 'sm',
      dataSource: '/api/users/count',
      displayOptions: {
        showHeader: true,
        theme: 'dark'
      },
      metricOptions: {
        formatter: 'number',
        showTrend: true,
        precision: 0
      }
    },
    {
      id: 'recent-orders',
      type: 'table',
      title: 'Recent Orders',
      size: 'md',
      dataSource: '/api/orders',
      displayOptions: {
        showHeader: true,
        showExport: true
      },
      tableOptions: {
        columns: [
          { key: 'id', label: 'Order ID', sortable: true },
          { key: 'customer', label: 'Customer', sortable: true },
          { key: 'amount', label: 'Amount', formatter: (val) => `$${val}` }
        ],
        pagination: true,
        pageSize: 5
      }
    }
  ];

  return (
    <div className="dashboard">
      <h1>Analytics Dashboard</h1>
      <div className="widgets-grid">
        {widgetConfigs.map(config => (
          <UniversalWidget
            key={config.id}
            config={config}
            data={{}} // Mock data
            onRefresh={() => console.log(`Refreshing ${config.id}`)}
            onExport={() => console.log(`Exporting ${config.id}`)}
          />
        ))}
      </div>
    </div>
  );
}