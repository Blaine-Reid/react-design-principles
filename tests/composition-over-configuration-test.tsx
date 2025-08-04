// COMPOSITION OVER CONFIGURATION TEST
// Fix the code violations below - each example uses prop configuration instead of JSX composition
// GOAL: Use children, slots, and composition patterns instead of passing configuration props

import React, { ReactNode, useState } from 'react';

// ===== EASY =====
// Problem: Simple component using props for content instead of children
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  showIcon?: boolean;
  showCloseButton?: boolean;
  onClose?: () => void;
}

function Alert({ type, title, message, showIcon, showCloseButton, onClose }: AlertProps) {
  const icons = {
    success: '✅',
    error: '❌', 
    warning: '⚠️',
    info: 'ℹ️'
  };

  return (
    <div className={`alert alert-${type}`}>
      {showIcon && <span className="icon">{icons[type]}</span>}
      <div className="content">
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      {showCloseButton && (
        <button onClick={onClose} className="close-btn">×</button>
      )}
    </div>
  );
}

// Usage of the problematic Alert
function AlertExamples() {
  return (
    <div>
      <Alert 
        type="success" 
        title="Success!" 
        message="Your changes have been saved."
        showIcon
        showCloseButton
        onClose={() => {}}
      />
      <Alert 
        type="error" 
        title="Error!" 
        message="Something went wrong. Please try again."
        showIcon
      />
    </div>
  );
}

// ===== MEDIUM =====
// Problem: Modal component with too many configuration props
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showCloseButton?: boolean;
  headerContent?: ReactNode;
  bodyContent?: ReactNode;
  footerContent?: ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  size?: 'small' | 'medium' | 'large';
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
}

function Modal({
  isOpen,
  onClose,
  title,
  showHeader = true,
  showFooter = true,
  showCloseButton = true,
  headerContent,
  bodyContent,
  footerContent,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryAction,
  onSecondaryAction,
  size = 'medium',
  headerClassName,
  bodyClassName,
  footerClassName
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal modal-${size}`}>
        {showHeader && (
          <div className={`modal-header ${headerClassName || ''}`}>
            {headerContent || <h2>{title}</h2>}
            {showCloseButton && (
              <button onClick={onClose} className="close-btn">×</button>
            )}
          </div>
        )}
        
        <div className={`modal-body ${bodyClassName || ''}`}>
          {bodyContent}
        </div>
        
        {showFooter && (
          <div className={`modal-footer ${footerClassName || ''}`}>
            {footerContent || (
              <>
                {secondaryButtonText && (
                  <button onClick={onSecondaryAction} className="btn-secondary">
                    {secondaryButtonText}
                  </button>
                )}
                {primaryButtonText && (
                  <button onClick={onPrimaryAction} className="btn-primary">
                    {primaryButtonText}
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Problematic usage of Modal
function ModalExamples() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Delete"
        bodyContent={<p>Are you sure you want to delete this item?</p>}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onPrimaryAction={() => {
          // delete logic
          setShowModal(false);
        }}
        onSecondaryAction={() => setShowModal(false)}
        size="small"
      />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        showHeader={false}
        headerContent={
          <div>
            <h1>Custom Header</h1>
            <p>With subtitle</p>
          </div>
        }
        bodyContent={
          <div>
            <p>Complex body content</p>
            <form>
              <input placeholder="Name" />
              <textarea placeholder="Description" />
            </form>
          </div>
        }
        footerContent={
          <div>
            <button>Save Draft</button>
            <button>Publish</button>
            <button>Cancel</button>
          </div>
        }
        size="large"
      />
    </div>
  );
}

// ===== HARD =====
// Problem: Complex form builder with extensive configuration
interface FormField {
  name: string;
  type: 'text' | 'email' | 'password' | 'textarea' | 'select' | 'checkbox' | 'radio';
  label: string;
  placeholder?: string;
  required?: boolean;
  validation?: (value: any) => string | null;
  options?: Array<{ value: string; label: string }>;
  defaultValue?: any;
  className?: string;
  helpText?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

interface FormBuilderProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  submitButtonText?: string;
  resetButtonText?: string;
  showResetButton?: boolean;
  formTitle?: string;
  formDescription?: string;
  showFormHeader?: boolean;
  formClassName?: string;
  fieldGroupClassName?: string;
  buttonGroupClassName?: string;
  validationMode?: 'onSubmit' | 'onChange' | 'onBlur';
  showProgressBar?: boolean;
  allowSaveProgress?: boolean;
  onSaveProgress?: (data: Record<string, any>) => void;
  saveProgressText?: string;
}

function FormBuilder({
  fields,
  onSubmit,
  submitButtonText = 'Submit',
  resetButtonText = 'Reset',
  showResetButton = false,
  formTitle,
  formDescription,
  showFormHeader = false,
  formClassName,
  fieldGroupClassName,
  buttonGroupClassName,
  validationMode = 'onSubmit',
  showProgressBar = false,
  allowSaveProgress = false,
  onSaveProgress,
  saveProgressText = 'Save Progress'
}: FormBuilderProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [progress, setProgress] = useState(0);

  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (validationMode === 'onChange') {
      validateField(name, value);
    }
    
    if (showProgressBar) {
      const completedFields = Object.keys(formData).filter(key => formData[key]).length;
      setProgress((completedFields / fields.length) * 100);
    }
  };

  const validateField = (name: string, value: any) => {
    const field = fields.find(f => f.name === name);
    if (field?.validation) {
      const error = field.validation(value);
      setErrors(prev => ({ ...prev, [name]: error || '' }));
    }
  };

  const renderField = (field: FormField) => {
    const { name, type, label, placeholder, required, options, className, helpText, prefix, suffix } = field;
    const value = formData[name] || field.defaultValue || '';
    const error = errors[name];

    return (
      <div key={name} className={`field-group ${fieldGroupClassName || ''}`}>
        <label className={required ? 'required' : ''}>
          {label}
        </label>
        
        <div className="field-wrapper">
          {prefix && <span className="field-prefix">{prefix}</span>}
          
          {type === 'select' ? (
            <select
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              className={`${className || ''} ${error ? 'error' : ''}`}
              onBlur={validationMode === 'onBlur' ? (e) => validateField(name, e.target.value) : undefined}
            >
              <option value="">{placeholder || 'Select...'}</option>
              {options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              placeholder={placeholder}
              className={`${className || ''} ${error ? 'error' : ''}`}
              onBlur={validationMode === 'onBlur' ? (e) => validateField(name, e.target.value) : undefined}
            />
          ) : type === 'checkbox' ? (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(name, e.target.checked)}
              className={`${className || ''} ${error ? 'error' : ''}`}
            />
          ) : (
            <input
              type={type}
              value={value}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              placeholder={placeholder}
              className={`${className || ''} ${error ? 'error' : ''}`}
              onBlur={validationMode === 'onBlur' ? (e) => validateField(name, e.target.value) : undefined}
            />
          )}
          
          {suffix && <span className="field-suffix">{suffix}</span>}
        </div>
        
        {helpText && <small className="help-text">{helpText}</small>}
        {error && <span className="error-text">{error}</span>}
      </div>
    );
  };

  return (
    <form className={formClassName} onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }}>
      {showFormHeader && (
        <div className="form-header">
          {formTitle && <h2>{formTitle}</h2>}
          {formDescription && <p>{formDescription}</p>}
        </div>
      )}
      
      {showProgressBar && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
      
      <div className="form-fields">
        {fields.map(renderField)}
      </div>
      
      <div className={`button-group ${buttonGroupClassName || ''}`}>
        {allowSaveProgress && (
          <button type="button" onClick={() => onSaveProgress?.(formData)}>
            {saveProgressText}
          </button>
        )}
        {showResetButton && (
          <button type="button" onClick={() => setFormData({})}>
            {resetButtonText}
          </button>
        )}
        <button type="submit">
          {submitButtonText}
        </button>
      </div>
    </form>
  );
}

// Problematic usage of FormBuilder
function FormExamples() {
  const formFields: FormField[] = [
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true,
      validation: (value) => !value?.includes('@') ? 'Invalid email' : null,
      prefix: <span>📧</span>
    },
    {
      name: 'password',
      type: 'password',
      label: 'Password',
      required: true,
      helpText: 'Must be at least 8 characters',
      suffix: <button type="button">👁️</button>
    },
    {
      name: 'country',
      type: 'select',
      label: 'Country',
      options: [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'uk', label: 'United Kingdom' }
      ]
    }
  ];

  return (
    <FormBuilder
      fields={formFields}
      onSubmit={(data) => console.log(data)}
      formTitle="Sign Up"
      formDescription="Create your account"
      showFormHeader
      submitButtonText="Create Account"
      showResetButton
      resetButtonText="Clear Form"
      validationMode="onChange"
      showProgressBar
      allowSaveProgress
      onSaveProgress={(data) => localStorage.setItem('formProgress', JSON.stringify(data))}
      saveProgressText="Save & Continue Later"
      formClassName="signup-form"
      fieldGroupClassName="form-group"
      buttonGroupClassName="form-actions"
    />
  );
}