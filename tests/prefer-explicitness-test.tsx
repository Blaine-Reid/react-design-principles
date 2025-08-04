// PREFER EXPLICITNESS OVER GENERALITY TEST
// Fix the code violations below - each example uses overly generic patterns that hide intent
// GOAL: Make code explicit and clear about what it does rather than trying to be too flexible

import React, { useState, useEffect } from 'react';

// ===== EASY =====
// Problem: Generic handler that obscures what actions are actually being performed
type User = {
  id: string;
  name: string;
  email: string;
  isActive?: boolean;
  // Add other fields as needed
};

function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Generic handler that tries to do everything
  const handleAction = async (action: any, data: any, options: any = {}) => {
    setIsLoading(true);
    
    try {
      let url, method, body;
      
      // Hidden complexity - you have to read all this code to understand what actions are possible
      switch (action) {
        case 'fetch':
          url = '/api/users';
          method = 'GET';
          break;
        case 'create':
          url = '/api/users';
          method = 'POST';
          body = JSON.stringify(data);
          break;
        case 'update':
          url = `/api/users/${data.id}`;
          method = options.partial ? 'PATCH' : 'PUT';
          body = JSON.stringify(data);
          break;
        case 'delete':
          url = `/api/users/${data.id}`;
          method = 'DELETE';
          break;
        case 'bulk-delete':
          url = '/api/users/bulk';
          method = 'DELETE';
          body = JSON.stringify({ ids: data });
          break;
        case 'activate':
          url = `/api/users/${data.id}/activate`;
          method = 'POST';
          break;
        case 'deactivate':
          url = `/api/users/${data.id}/deactivate`;
          method = 'POST';
          break;
        case 'reset-password':
          url = `/api/users/${data.id}/reset-password`;
          method = 'POST';
          body = JSON.stringify({ sendEmail: options.sendEmail });
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        body
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action}`);
      }

      const result = await response.json();
      
      // More generic handling that obscures the actual business logic
      if (action === 'fetch') {
        setUsers(result);
      } else if (['create', 'update'].includes(action)) {
        setUsers(prev => {
          if (action === 'create') {
            return [...prev, result];
          } else {
            return prev.map(user => user.id === result.id ? result : user);
          }
        });
      } else if (action === 'delete') {
        setUsers(prev => prev.filter(user => user.id !== data.id));
      } else if (action === 'bulk-delete') {
        setUsers(prev => prev.filter(user => !data.includes(user.id)));
      } else if (['activate', 'deactivate'].includes(action)) {
        setUsers(prev => prev.map(user => 
          user.id === data.id 
            ? { ...user, isActive: action === 'activate' }
            : user
        ));
      }
      
    } catch (error) {
      console.error(`Error performing ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleAction('fetch'); // What does this do? You have to look at the function!
  }, []);

  return (
    <div>
      <h1>User Management</h1>
      
      <button onClick={() => handleAction('create', { 
        name: 'New User', 
        email: 'new@example.com' 
      })}>
        Add User
      </button>
      
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <div className="actions">
            <button onClick={() => handleAction('update', { 
              ...user, 
              name: user.name + ' (Updated)' 
            }, { partial: true })}>
              Update
            </button>
            
            <button onClick={() => handleAction(
              user.isActive ? 'deactivate' : 'activate', 
              { id: user.id }
            )}>
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
            
            <button onClick={() => handleAction('reset-password', 
              { id: user.id }, 
              { sendEmail: true }
            )}>
              Reset Password
            </button>
            
            <button onClick={() => handleAction('delete', { id: user.id })}>
              Delete
            </button>
          </div>
        </div>
      ))}
      
      <button onClick={() => handleAction('bulk-delete', 
        users.filter(u => !u.isActive).map(u => u.id)
      )}>
        Delete All Inactive
      </button>
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Over-generic form component that tries to handle every possible use case
function GenericForm({ 
  config, 
  onSubmit, 
  onFieldChange,
  validationRules,
  initialData = {},
  layout = 'vertical',
  theme = 'default'
}: {
  config: any;
  onSubmit: any;
  onFieldChange?: any;
  validationRules?: any;
  initialData?: any;
  layout?: string;
  theme?: string;
}) {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  // Generic field renderer that's hard to understand and customize
  const renderField = (fieldConfig: any, index: number) => {
    const { 
      name, 
      type = 'text', 
      label, 
      placeholder, 
      options = [], 
      validation = {},
      conditional = {},
      styling = {},
      behavior = {}
    } = fieldConfig;

    // Complex conditional logic buried in generic renderer
    if (conditional.dependsOn) {
      const dependentValue = formData[conditional.dependsOn];
      if (conditional.showWhen && !conditional.showWhen.includes(dependentValue)) {
        return null;
      }
      if (conditional.hideWhen && conditional.hideWhen.includes(dependentValue)) {
        return null;
      }
    }

    // Generic styling application
    const fieldStyles = {
      ...styling.field,
      ...(theme === 'dark' ? styling.dark : styling.light),
      ...(errors[name] ? styling.error : {}),
      ...(layout === 'horizontal' ? styling.horizontal : styling.vertical)
    };

    const labelStyles = {
      ...styling.label,
      ...(validation.required ? styling.required : {})
    };

    // Mega switch statement to handle all field types
    let fieldElement;
    switch (type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        fieldElement = (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            placeholder={placeholder}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            onBlur={behavior.validateOnBlur ? () => validateField(name) : undefined}
            onFocus={behavior.clearErrorOnFocus ? () => clearFieldError(name) : undefined}
            disabled={behavior.disabled}
            readOnly={behavior.readOnly}
            maxLength={validation.maxLength}
            minLength={validation.minLength}
            pattern={validation.pattern}
            required={validation.required}
          />
        );
        break;
        
      case 'textarea':
        fieldElement = (
          <textarea
            name={name}
            value={formData[name] || ''}
            placeholder={placeholder}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            rows={behavior.rows || 3}
            cols={behavior.cols}
            disabled={behavior.disabled}
            readOnly={behavior.readOnly}
            maxLength={validation.maxLength}
            required={validation.required}
          />
        );
        break;
        
      case 'select':
        fieldElement = (
          <select
            name={name}
            value={formData[name] || ''}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            disabled={behavior.disabled}
            required={validation.required}
            multiple={behavior.multiple}
          >
            {!validation.required && <option value="">Select...</option>}
            {options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
        break;
        
      case 'checkbox':
        fieldElement = (
          <input
            type="checkbox"
            name={name}
            checked={formData[name] || false}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.checked)}
            disabled={behavior.disabled}
            required={validation.required}
          />
        );
        break;
        
      case 'radio':
        fieldElement = (
          <div>
            {options.map(option => (
              <label key={option.value}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={(e) => handleFieldChange(name, e.target.value)}
                  disabled={behavior.disabled}
                  required={validation.required}
                />
                {option.label}
              </label>
            ))}
          </div>
        );
        break;
        
      case 'file':
        fieldElement = (
          <input
            type="file"
            name={name}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.files?.[0])}
            accept={validation.accept}
            multiple={behavior.multiple}
            disabled={behavior.disabled}
            required={validation.required}
          />
        );
        break;
        
      case 'date':
      case 'datetime-local':
      case 'time':
        fieldElement = (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            min={validation.min}
            max={validation.max}
            disabled={behavior.disabled}
            required={validation.required}
          />
        );
        break;
        
      case 'number':
      case 'range':
        fieldElement = (
          <input
            type={type}
            name={name}
            value={formData[name] || ''}
            style={fieldStyles}
            onChange={(e) => handleFieldChange(name, e.target.value)}
            min={validation.min}
            max={validation.max}
            step={validation.step}
            disabled={behavior.disabled}
            required={validation.required}
          />
        );
        break;
        
      default:
        console.warn(`Unknown field type: ${type}`);
        fieldElement = <div>Unsupported field type: {type}</div>;
    }

    return (
      <div key={name} style={styling.fieldContainer}>
        {label && (
          <label htmlFor={name} style={labelStyles}>
            {label}
            {validation.required && <span style={styling.requiredIndicator}>*</span>}
          </label>
        )}
        {fieldElement}
        {errors[name] && (
          <div style={styling.errorMessage}>{errors[name]}</div>
        )}
        {fieldConfig.helpText && (
          <div style={styling.helpText}>{fieldConfig.helpText}</div>
        )}
      </div>
    );
  };

  const handleFieldChange = (name: any, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    onFieldChange?.(name, value, formData);
    
    // Generic validation trigger
    if (validationRules?.[name]?.validateOnChange) {
      validateField(name, value);
    }
  };

  const validateField = (name: any, value = formData[name]) => {
    // Generic validation logic
    const rules = validationRules?.[name] || {};
    let error = null;
    
    if (rules.required && (!value || value.toString().trim() === '')) {
      error = rules.requiredMessage || 'This field is required';
    } else if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
      error = rules.patternMessage || 'Invalid format';
    } else if (rules.minLength && value.length < rules.minLength) {
      error = rules.minLengthMessage || `Minimum ${rules.minLength} characters`;
    } else if (rules.maxLength && value.length > rules.maxLength) {
      error = rules.maxLengthMessage || `Maximum ${rules.maxLength} characters`;
    } else if (rules.custom && !rules.custom(value, formData)) {
      error = rules.customMessage || 'Invalid value';
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };

  const clearFieldError = (name: any) => {
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    
    // Generic validation for all fields
    let isValid = true;
    config.fields.forEach(field => {
      if (!validateField(field.name)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: layout === 'horizontal' ? 'row' : 'column',
        gap: '1rem',
        ...config.styling?.form
      }}
    >
      {config.title && <h2 style={config.styling?.title}>{config.title}</h2>}
      {config.description && <p style={config.styling?.description}>{config.description}</p>}
      
      {config.fields.map(renderField)}
      
      <div style={config.styling?.buttonContainer}>
        {config.showResetButton && (
          <button 
            type="button" 
            onClick={() => setFormData(initialData)}
            style={config.styling?.resetButton}
          >
            Reset
          </button>
        )}
        <button 
          type="submit"
          style={config.styling?.submitButton}
        >
          {config.submitText || 'Submit'}
        </button>
      </div>
    </form>
  );
}

// Usage showing how complex the configuration becomes
function ContactFormExample() {
  const formConfig = {
    title: 'Contact Form',
    description: 'Please fill out all required fields',
    fields: [
      {
        name: 'name',
        type: 'text',
        label: 'Full Name',
        placeholder: 'Enter your full name',
        validation: { required: true, minLength: 2, maxLength: 50 },
        styling: { field: { width: '100%' } },
        behavior: { validateOnBlur: true, clearErrorOnFocus: true }
      },
      {
        name: 'email',
        type: 'email',
        label: 'Email Address',
        placeholder: 'Enter your email',
        validation: { 
          required: true, 
          pattern: '^[^@]+@[^@]+\\.[^@]+$',
          patternMessage: 'Please enter a valid email address'
        },
        styling: { field: { width: '100%' } },
        behavior: { validateOnBlur: true }
      },
      {
        name: 'contactReason',
        type: 'select',
        label: 'Reason for Contact',
        validation: { required: true },
        options: [
          { value: 'support', label: 'Technical Support' },
          { value: 'sales', label: 'Sales Inquiry' },
          { value: 'feedback', label: 'Feedback' }
        ]
      },
      {
        name: 'urgency',
        type: 'radio',
        label: 'Urgency Level',
        conditional: {
          dependsOn: 'contactReason',
          showWhen: ['support']
        },
        options: [
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' }
        ]
      },
      {
        name: 'message',
        type: 'textarea',
        label: 'Message',
        placeholder: 'Enter your message',
        validation: { required: true, minLength: 10, maxLength: 1000 },
        behavior: { rows: 5 }
      },
      {
        name: 'newsletter',
        type: 'checkbox',
        label: 'Subscribe to newsletter'
      }
    ],
    showResetButton: true,
    submitText: 'Send Message',
    styling: {
      form: { maxWidth: '600px', margin: '0 auto' },
      fieldContainer: { marginBottom: '1rem' },
      errorMessage: { color: 'red', fontSize: '0.8rem' }
    }
  };

  const validationRules = {
    name: {
      required: true,
      minLength: 2,
      maxLength: 50,
      validateOnChange: false
    },
    email: {
      required: true,
      pattern: '^[^@]+@[^@]+\\.[^@]+$',
      validateOnChange: true
    },
    message: {
      required: true,
      minLength: 10,
      maxLength: 1000
    }
  };

  return (
    <GenericForm
      config={formConfig}
      validationRules={validationRules}
      onSubmit={(data) => console.log('Form submitted:', data)}
      onFieldChange={(name, value) => console.log('Field changed:', name, value)}
      layout="vertical"
      theme="default"
    />
  );
}

// ===== HARD =====
// Problem: Over-engineered state management system that tries to be everything
class GenericStateManager {
  state: any;
  subscribers: any[];
  middleware: any[];
  reducers: any;
  actions: any;
  selectors: any;
  persistence: any;
  devTools: boolean;
  history: any[] | null;
  maxHistorySize: number;

  constructor(config: any = {}) {
    this.state = config.initialState || {};
    this.subscribers = [];
    this.middleware = config.middleware || [];
    this.reducers = config.reducers || {};
    this.actions = config.actions || {};
    this.selectors = config.selectors || {};
    this.persistence = config.persistence || {};
    this.devTools = config.devTools !== false;
    this.history = config.history ? [] : null;
    this.maxHistorySize = config.maxHistorySize || 50;
    
    this.setupPersistence();
    this.setupDevTools();
  }

  // Generic dispatch that tries to handle all possible action types
  dispatch(action: any): any {
    if (typeof action === 'string') {
      // Handle string actions
      action = { type: action };
    } else if (typeof action === 'function') {
      // Handle thunk actions
      return action(this.dispatch.bind(this), this.getState.bind(this));
    } else if (!action.type) {
      throw new Error('Action must have a type');
    }

    const prevState = this.state;
    
    // Apply middleware in generic way
    let dispatch = this.dispatch.bind(this);
    this.middleware.slice().reverse().forEach((middleware: any) => {
      dispatch = middleware(this)(dispatch);
    });

    // Generic reducer application
    if (this.reducers[action.type]) {
      this.state = this.reducers[action.type](this.state, action);
    } else if (action.reducer) {
      // Allow inline reducers
      this.state = action.reducer(this.state, action);
    } else {
      // Default handling for generic actions
      this.state = this.genericReducer(this.state, action);
    }

    // History tracking
    if (this.history) {
      this.history.push({
        action,
        prevState,
        newState: this.state,
        timestamp: Date.now()
      });
      
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
      }
    }

    // Notify subscribers
    this.subscribers.forEach((callback: any) => callback(this.state, prevState, action));
    
    // DevTools integration
    if (this.devTools && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      (window as any).__REDUX_DEVTOOLS_EXTENSION__.send(action, this.state);
    }

    // Auto-persistence
    if (this.persistence.auto) {
      this.persist();
    }

    return this.state;
  }

  // Generic reducer that tries to handle common patterns
  genericReducer(state: any, action: any): any {
    const { type, payload, path, merge, transform } = action;
    
    if (path) {
      // Handle nested updates with path notation
      return this.setPath(state, path, payload);
    } else if (merge) {
      // Handle object merging
      return { ...state, ...payload };
    } else if (transform) {
      // Handle state transformations
      return transform(state, payload);
    } else {
      // Default behavior based on action type naming conventions
      switch (true) {
        case type.endsWith('_SET'):
          const key = type.replace('_SET', '').toLowerCase();
          return { ...state, [key]: payload };
          
        case type.endsWith('_UPDATE'):
          const updateKey = type.replace('_UPDATE', '').toLowerCase();
          return { 
            ...state, 
            [updateKey]: { ...state[updateKey], ...payload }
          };
          
        case type.endsWith('_ADD'):
          const addKey = type.replace('_ADD', '').toLowerCase();
          return {
            ...state,
            [addKey]: [...(state[addKey] || []), payload]
          };
          
        case type.endsWith('_REMOVE'):
          const removeKey = type.replace('_REMOVE', '').toLowerCase();
          return {
            ...state,
            [removeKey]: (state[removeKey] || []).filter((item: any) => 
              item.id !== payload.id && item !== payload
            )
          };
          
        case type.endsWith('_RESET'):
          const resetKey = type.replace('_RESET', '').toLowerCase();
          return { ...state, [resetKey]: null };
          
        case type === 'RESET_ALL':
          return {};
          
        default:
          console.warn(`No reducer found for action type: ${type}`);
          return state;
      }
    }
  }

  // Generic path setter for nested updates
  setPath(state: any, path: any, value: any): any {
    const keys = path.split('.');
    const result = { ...state };
    let current = result;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    
    current[keys[keys.length - 1]] = value;
    return result;
  }

  // Generic selector application
  select(selectorName: any, ...args: any[]): any {
    if (this.selectors[selectorName]) {
      return this.selectors[selectorName](this.state, ...args);
    } else {
      // Generic path-based selection
      return this.getPath(this.state, selectorName);
    }
  }

  getPath(state: any, path: any): any {
    return path.split('.').reduce((current: any, key: any) => current?.[key], state);
  }

  // Generic subscription management
  subscribe(callback: any, filter?: any): any {
    const wrappedCallback = filter 
      ? (state: any, prevState: any, action: any) => {
          if (filter(state, prevState, action)) {
            callback(state, prevState, action);
          }
        }
      : callback;
      
    this.subscribers.push(wrappedCallback);
    
    return () => {
      const index = this.subscribers.indexOf(wrappedCallback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  getState() {
    return this.state;
  }

  // Generic persistence
  setupPersistence() {
    if (this.persistence.key) {
      try {
        const saved = localStorage.getItem(this.persistence.key);
        if (saved) {
          this.state = { ...this.state, ...JSON.parse(saved) };
        }
      } catch (error) {
        console.warn('Failed to load persisted state:', error);
      }
    }
  }

  persist() {
    if (this.persistence.key) {
      try {
        const toSave = this.persistence.transform 
          ? this.persistence.transform(this.state)
          : this.state;
        localStorage.setItem(this.persistence.key, JSON.stringify(toSave));
      } catch (error) {
        console.warn('Failed to persist state:', error);
      }
    }
  }

  setupDevTools() {
    if (this.devTools && (window as any).__REDUX_DEVTOOLS_EXTENSION__) {
      (window as any).__REDUX_DEVTOOLS_EXTENSION__.connect();
    }
  }

  // Time travel debugging
  replayAction(index: any) {
    if (this.history && this.history[index]) {
      const { action, prevState } = this.history[index];
      this.state = prevState;
      this.dispatch(action);
    }
  }

  // Generic batch operations
  batch(actions: any[]) {
    const originalState = this.state;
    try {
      actions.forEach((action: any) => this.dispatch(action));
    } catch (error) {
      this.state = originalState;
      throw error;
    }
  }
}

// Usage showing how complex and unclear this becomes
function AppWithGenericStateManager() {
  const [stateManager] = useState(() => new GenericStateManager({
    initialState: {
      users: [],
      products: [],
      ui: {
        loading: false,
        errors: {},
        notifications: []
      }
    },
    persistence: {
      key: 'app-state',
      auto: true
    },
    reducers: {
      // You still need specific reducers anyway!
      FETCH_USERS_SUCCESS: (state: any, action: any) => ({
        ...state,
        users: action.payload
      })
    },
    middleware: [
      // Generic logging middleware
      (store: any) => (next: any) => (action: any) => {
        console.log('Action:', action);
        const result = next(action);
        console.log('New state:', store.getState());
        return result;
      }
    ]
  }));

  useEffect(() => {
    // Generic subscription - unclear what changes we're listening for
    const unsubscribe = stateManager.subscribe((newState: any, prevState: any, action: any) => {
      console.log('State changed:', action.type);
    });

    return unsubscribe;
  }, [stateManager]);

  // Generic action dispatching - unclear what these actually do
  const handleUserAction = (actionType: any, userData: any) => {
    stateManager.dispatch({
      type: `USER_${actionType.toUpperCase()}`,
      payload: userData
    });
  };

  return (
    <div>
      <h1>App with Generic State Manager</h1>
      <button onClick={() => handleUserAction('add', { name: 'John' })}>
        Add User
      </button>
      <button onClick={() => stateManager.dispatch({ type: 'UI_LOADING_SET', payload: true })}>
        Set Loading
      </button>
      <button onClick={() => stateManager.dispatch({
        type: 'NESTED_UPDATE',
        path: 'ui.errors.form',
        payload: 'Validation failed'
      })}>
        Set Nested Error
      </button>
    </div>
  );
}