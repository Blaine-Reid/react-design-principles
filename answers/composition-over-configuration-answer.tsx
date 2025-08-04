// COMPOSITION OVER CONFIGURATION - CORRECT IMPLEMENTATIONS
// This file shows how to use JSX composition instead of prop configuration

import React, { ReactNode, createContext, useContext } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Use children and composition instead of content props
// WHY: JSX composition is more flexible and allows for rich content, styling, and interactivity

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  children: ReactNode;
  onClose?: () => void;
}

function Alert({ type, children, onClose }: AlertProps) {
  return (
    <div className={`alert alert-${type}`}>
      {children}
      {onClose && (
        <button onClick={onClose} className="close-btn">×</button>
      )}
    </div>
  );
}

// Composable sub-components for better flexibility
Alert.Icon = function AlertIcon({ children }: { children: ReactNode }) {
  return <span className="alert-icon">{children}</span>;
};

Alert.Title = function AlertTitle({ children }: { children: ReactNode }) {
  return <h3 className="alert-title">{children}</h3>;
};

Alert.Message = function AlertMessage({ children }: { children: ReactNode }) {
  return <p className="alert-message">{children}</p>;
};

// Clean, flexible usage with composition
function AlertExamples() {
  return (
    <div>
      <Alert type="success" onClose={() => {}}>
        <Alert.Icon>✅</Alert.Icon>
        <Alert.Title>Success!</Alert.Title>
        <Alert.Message>Your changes have been saved.</Alert.Message>
      </Alert>
      
      <Alert type="error">
        <Alert.Icon>❌</Alert.Icon>
        <Alert.Title>Error!</Alert.Title>
        <Alert.Message>
          Something went wrong. Please <a href="/support">contact support</a> if this continues.
        </Alert.Message>
      </Alert>
      
      {/* Complex content is now possible */}
      <Alert type="warning">
        <Alert.Icon>⚠️</Alert.Icon>
        <Alert.Title>Account Verification Required</Alert.Title>
        <div>
          <p>Please verify your email address to continue.</p>
          <button className="btn-primary">Verify Email</button>
          <button className="btn-secondary">Resend Email</button>
        </div>
      </Alert>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Use slot-based composition with compound components
// WHY: Each part of the modal is composable and can contain any content

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  size?: 'small' | 'medium' | 'large';
  children: ReactNode;
}

function Modal({ isOpen, onClose, size = 'medium', children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal modal-${size}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// Composable modal parts
Modal.Header = function ModalHeader({ 
  children, 
  showCloseButton = true, 
  onClose,
  className = '' 
}: { 
  children: ReactNode; 
  showCloseButton?: boolean; 
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={`modal-header ${className}`}>
      {children}
      {showCloseButton && onClose && (
        <button onClick={onClose} className="close-btn">×</button>
      )}
    </div>
  );
};

Modal.Body = function ModalBody({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return <div className={`modal-body ${className}`}>{children}</div>;
};

Modal.Footer = function ModalFooter({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string; 
}) {
  return <div className={`modal-footer ${className}`}>{children}</div>;
};

// Clean, flexible usage examples
function ModalExamples() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  return (
    <div>
      {/* Simple confirmation modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} size="small">
        <Modal.Header onClose={() => setShowDeleteModal(false)}>
          <h2>Confirm Delete</h2>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this item? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => setShowDeleteModal(false)} className="btn-secondary">
            Cancel
          </button>
          <button onClick={() => {
            // delete logic
            setShowDeleteModal(false);
          }} className="btn-danger">
            Delete
          </button>
        </Modal.Footer>
      </Modal>
      
      {/* Complex form modal */}
      <Modal isOpen={showFormModal} onClose={() => setShowFormModal(false)} size="large">
        <Modal.Header showCloseButton={false}>
          <div>
            <h1>Create New Project</h1>
            <p>Fill out the form below to create a new project</p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div className="form-group">
              <label>Project Name</label>
              <input type="text" placeholder="Enter project name" />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your project" rows={4} />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input type="date" />
              </div>
              <div className="form-group">
                <label>End Date</label>
                <input type="date" />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <div className="modal-footer-left">
            <button className="btn-tertiary">Save as Draft</button>
          </div>
          <div className="modal-footer-right">
            <button onClick={() => setShowFormModal(false)} className="btn-secondary">
              Cancel
            </button>
            <button className="btn-primary">Create Project</button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Use render props and composition for flexible form building
// WHY: Forms vary widely in layout, validation, and behavior - composition provides maximum flexibility

interface FormProps {
  onSubmit: (data: FormData) => void;
  children: ReactNode;
  className?: string;
}

function Form({ onSubmit, children, className }: FormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}

// Composable form components
Form.Header = function FormHeader({ children }: { children: ReactNode }) {
  return <div className="form-header">{children}</div>;
};

Form.Section = function FormSection({ 
  title, 
  children 
}: { 
  title?: string; 
  children: ReactNode; 
}) {
  return (
    <div className="form-section">
      {title && <h3 className="form-section-title">{title}</h3>}
      {children}
    </div>
  );
};

Form.Field = function FormField({ 
  label, 
  required, 
  error, 
  helpText, 
  children 
}: { 
  label: string; 
  required?: boolean; 
  error?: string; 
  helpText?: string; 
  children: ReactNode; 
}) {
  return (
    <div className="form-field">
      <label className={required ? 'required' : ''}>
        {label}
      </label>
      {children}
      {helpText && <small className="help-text">{helpText}</small>}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

Form.Actions = function FormActions({ children }: { children: ReactNode }) {
  return <div className="form-actions">{children}</div>;
};

// Enhanced input components that work with composition
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefix?: ReactNode;
  suffix?: ReactNode;
}

function Input({ prefix, suffix, className = '', ...props }: InputProps) {
  return (
    <div className="input-wrapper">
      {prefix && <span className="input-prefix">{prefix}</span>}
      <input className={`input ${className}`} {...props} />
      {suffix && <span className="input-suffix">{suffix}</span>}
    </div>
  );
}

function TextArea({ className = '', ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`textarea ${className}`} {...props} />;
}

function Select({ children, className = '', ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`select ${className}`} {...props}>
      {children}
    </select>
  );
}

// Flexible, composable form usage
function FormExamples() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (formData: FormData) => {
    const data = Object.fromEntries(formData);
    console.log('Form data:', data);
    // Handle submission
  };

  return (
    <Form onSubmit={handleSubmit} className="signup-form">
      <Form.Header>
        <h1>Create Your Account</h1>
        <p>Join thousands of users who trust our platform</p>
      </Form.Header>

      <Form.Section title="Personal Information">
        <div className="form-row">
          <Form.Field label="First Name" required error={errors.firstName}>
            <Input name="firstName" placeholder="Enter your first name" />
          </Form.Field>
          
          <Form.Field label="Last Name" required error={errors.lastName}>
            <Input name="lastName" placeholder="Enter your last name" />
          </Form.Field>
        </div>

        <Form.Field 
          label="Email Address" 
          required 
          error={errors.email}
          helpText="We'll never share your email with anyone else"
        >
          <Input 
            name="email" 
            type="email" 
            placeholder="you@example.com"
            prefix={<span>📧</span>}
          />
        </Form.Field>

        <Form.Field label="Password" required error={errors.password}>
          <Input 
            name="password" 
            type="password" 
            placeholder="Create a strong password"
            suffix={<button type="button">👁️</button>}
          />
        </Form.Field>
      </Form.Section>

      <Form.Section title="Location">
        <Form.Field label="Country" required>
          <Select name="country">
            <option value="">Select your country</option>
            <option value="us">United States</option>
            <option value="ca">Canada</option>
            <option value="uk">United Kingdom</option>
          </Select>
        </Form.Field>

        <Form.Field label="Bio" helpText="Tell us a bit about yourself">
          <TextArea 
            name="bio" 
            placeholder="Write a short bio..." 
            rows={3} 
          />
        </Form.Field>
      </Form.Section>

      <Form.Actions>
        <button type="button" className="btn-secondary">
          Save as Draft
        </button>
        <button type="submit" className="btn-primary">
          Create Account
        </button>
      </Form.Actions>
    </Form>
  );
}

// ===== BONUS: Advanced Pattern - Context + Composition =====
// 🔥 For components that need to share state, combine context with composition

interface CardContextValue {
  size: 'small' | 'medium' | 'large';
  variant: 'default' | 'outlined' | 'elevated';
}

const CardContext = createContext<CardContextValue>({ size: 'medium', variant: 'default' });

interface CardProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'outlined' | 'elevated';
  children: ReactNode;
  className?: string;
}

function Card({ size = 'medium', variant = 'default', children, className = '' }: CardProps) {
  return (
    <CardContext.Provider value={{ size, variant }}>
      <div className={`card card-${size} card-${variant} ${className}`}>
        {children}
      </div>
    </CardContext.Provider>
  );
}

Card.Header = function CardHeader({ children }: { children: ReactNode }) {
  const { size } = useContext(CardContext);
  return <div className={`card-header card-header-${size}`}>{children}</div>;
};

Card.Body = function CardBody({ children }: { children: ReactNode }) {
  const { size } = useContext(CardContext);
  return <div className={`card-body card-body-${size}`}>{children}</div>;
};

Card.Footer = function CardFooter({ children }: { children: ReactNode }) {
  const { variant } = useContext(CardContext);
  return <div className={`card-footer card-footer-${variant}`}>{children}</div>;
};

// Usage with automatic context sharing
function CardExamples() {
  return (
    <div>
      <Card size="large" variant="elevated">
        <Card.Header>
          <h2>Product Feature</h2>
          <span className="badge">New</span>
        </Card.Header>
        <Card.Body>
          <p>This is a great feature that will help you be more productive.</p>
          <img src="/feature-image.jpg" alt="Feature preview" />
        </Card.Body>
        <Card.Footer>
          <button className="btn-primary">Learn More</button>
          <button className="btn-secondary">Try It</button>
        </Card.Footer>
      </Card>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Children Over Props**: Use JSX children instead of content props
   - ✅ Good: <Alert>{content}</Alert>
   - ❌ Bad: <Alert content={content} />

2. **Compound Components**: Break complex components into composable parts
   - Modal.Header, Modal.Body, Modal.Footer
   - Form.Field, Form.Section, Form.Actions

3. **Slot-based Architecture**: Let consumers control layout and content
   - Components provide structure, consumers provide content
   - Maximum flexibility for different use cases

4. **Context + Composition**: Share state between composed components
   - Card context automatically provides size/variant to all children
   - Eliminates prop drilling in complex component hierarchies

5. **Benefits of Composition**:
   - More flexible than configuration props
   - Allows for rich content (JSX, interactivity, styling)
   - Better TypeScript support and intellisense
   - Easier to extend and customize
   - Self-documenting component relationships

WHEN TO USE COMPOSITION:
- ✅ When content needs layout, styling, or interactivity
- ✅ When you want flexible, reusable components
- ✅ When configuration props become unwieldy
- ✅ When different use cases need different structures

WHEN CONFIGURATION MIGHT BE OK:
- Simple, atomic components (Button with variant prop)
- When all possible variations are known and limited
- When composition would add unnecessary complexity

ANTI-PATTERNS TO AVOID:
- ❌ Passing JSX as props instead of using children
- ❌ Having dozens of configuration props
- ❌ Creating "god components" that do everything via props
- ❌ Using render props when simple composition would work
*/