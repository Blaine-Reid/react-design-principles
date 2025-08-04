// PREFER EXPLICITNESS OVER GENERALITY - CORRECT IMPLEMENTATIONS
// This file shows how to make code explicit and clear about what it does rather than trying to be too flexible

import React, { useState, useEffect } from 'react';

// ===== EASY - FIXED =====
// ✅ SOLUTION: Create specific, named functions instead of generic handlers
// WHY: Makes code self-documenting, easier to understand, and safer to modify
function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Explicit, single-purpose functions with clear names
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const result = await response.json();
      setUsers(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  const createUser = async (userData: { name: string; email: string }) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const newUser = await response.json();
      setUsers(prevUsers => [...prevUsers, newUser]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, updates: Partial<any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      const updatedUser = await response.json();
      setUsers(prevUsers => 
        prevUsers.map(user => user.id === userId ? updatedUser : user)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsLoading(false);
    }
  };

  const activateUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}/activate`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to activate user');
      }
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive: true } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to activate user');
    } finally {
      setIsLoading(false);
    }
  };

  const deactivateUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}/deactivate`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to deactivate user');
      }
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, isActive: false } : user
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate user');
    } finally {
      setIsLoading(false);
    }
  };

  const resetUserPassword = async (userId: string, sendEmail: boolean = true) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendEmail })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset password');
      }
      
      // Show success message without state update since password reset doesn't change user data
      alert('Password reset email sent successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInactiveUsers = async () => {
    const inactiveUsers = users.filter(user => !user.isActive);
    
    if (inactiveUsers.length === 0) {
      alert('No inactive users to delete');
      return;
    }
    
    if (!window.confirm(`Delete ${inactiveUsers.length} inactive users?`)) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const inactiveUserIds = inactiveUsers.map(user => user.id);
      
      const response = await fetch('/api/users/bulk-delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userIds: inactiveUserIds })
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete inactive users');
      }
      
      setUsers(prevUsers => prevUsers.filter(user => user.isActive));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete inactive users');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Explicit initialization - clear what's happening
  useEffect(() => {
    fetchUsers();
  }, []);

  if (error) {
    return (
      <div className="error-state">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={fetchUsers}>Try Again</button>
      </div>
    );
  }

  return (
    <div className="user-management">
      <header className="page-header">
        <h1>User Management</h1>
        <button 
          onClick={() => createUser({ 
            name: 'New User', 
            email: 'new@example.com' 
          })}
          disabled={isLoading}
        >
          Add New User
        </button>
      </header>
      
      {isLoading && <div className="loading">Loading...</div>}
      
      <div className="users-grid">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="user-actions">
              <button onClick={() => updateUser(user.id, { 
                name: user.name + ' (Updated)' 
              })}>
                Update Name
              </button>
              
              {user.isActive ? (
                <button onClick={() => deactivateUser(user.id)}>
                  Deactivate
                </button>
              ) : (
                <button onClick={() => activateUser(user.id)}>
                  Activate
                </button>
              )}
              
              <button onClick={() => resetUserPassword(user.id, true)}>
                Reset Password
              </button>
              
              <button 
                onClick={() => deleteUser(user.id)}
                className="danger"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <footer className="page-footer">
        <button 
          onClick={deleteInactiveUsers}
          className="danger"
          disabled={isLoading}
        >
          Delete All Inactive Users
        </button>
        <button onClick={fetchUsers} disabled={isLoading}>
          Refresh Users
        </button>
      </footer>
    </div>
  );
}

// ===== MEDIUM - FIXED =====
// ✅ SOLUTION: Create specific form components instead of one generic form
// WHY: Each form is explicit about its purpose, fields, and validation
interface ContactFormData {
  name: string;
  email: string;
  contactReason: 'support' | 'sales' | 'feedback';
  urgency?: 'low' | 'medium' | 'high';
  message: string;
  newsletter: boolean;
}

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    contactReason: 'support',
    urgency: 'medium',
    message: '',
    newsletter: false
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Explicit validation for each field
  const validateName = (name: string): string | null => {
    if (!name.trim()) {
      return 'Name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
      return 'Name must be less than 50 characters';
    }
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validateMessage = (message: string): string | null => {
    if (!message.trim()) {
      return 'Message is required';
    }
    if (message.trim().length < 10) {
      return 'Message must be at least 10 characters';
    }
    if (message.trim().length > 1000) {
      return 'Message must be less than 1000 characters';
    }
    return null;
  };

  // ✅ Explicit field update handlers
  const updateName = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    const error = validateName(name);
    setErrors(prev => ({ ...prev, name: error || undefined }));
  };

  const updateEmail = (email: string) => {
    setFormData(prev => ({ ...prev, email }));
    const error = validateEmail(email);
    setErrors(prev => ({ ...prev, email: error || undefined }));
  };

  const updateContactReason = (contactReason: ContactFormData['contactReason']) => {
    setFormData(prev => ({ 
      ...prev, 
      contactReason,
      // Reset urgency when changing reason
      urgency: contactReason === 'support' ? prev.urgency : undefined
    }));
  };

  const updateUrgency = (urgency: ContactFormData['urgency']) => {
    setFormData(prev => ({ ...prev, urgency }));
  };

  const updateMessage = (message: string) => {
    setFormData(prev => ({ ...prev, message }));
    const error = validateMessage(message);
    setErrors(prev => ({ ...prev, message: error || undefined }));
  };

  const updateNewsletter = (newsletter: boolean) => {
    setFormData(prev => ({ ...prev, newsletter }));
  };

  // ✅ Explicit form validation
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {};
    
    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const messageError = validateMessage(formData.message);
    if (messageError) newErrors.message = messageError;
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Explicit form submission
  const submitContactForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      alert('Message sent successfully!');
      resetForm();
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactReason: 'support',
      urgency: 'medium',
      message: '',
      newsletter: false
    });
    setErrors({});
  };

  return (
    <form onSubmit={submitContactForm} className="contact-form">
      <h2>Contact Us</h2>
      <p>Please fill out all required fields to get in touch with us.</p>
      
      <div className="form-group">
        <label htmlFor="name">
          Full Name <span className="required">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => updateName(e.target.value)}
          placeholder="Enter your full name"
          className={errors.name ? 'error' : ''}
          required
        />
        {errors.name && <div className="error-message">{errors.name}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="email">
          Email Address <span className="required">*</span>
        </label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => updateEmail(e.target.value)}
          placeholder="Enter your email address"
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="contactReason">
          Reason for Contact <span className="required">*</span>
        </label>
        <select
          id="contactReason"
          value={formData.contactReason}
          onChange={(e) => updateContactReason(e.target.value as ContactFormData['contactReason'])}
          required
        >
          <option value="support">Technical Support</option>
          <option value="sales">Sales Inquiry</option>
          <option value="feedback">Feedback</option>
        </select>
      </div>

      {formData.contactReason === 'support' && (
        <div className="form-group">
          <label>Urgency Level</label>
          <div className="radio-group">
            {(['low', 'medium', 'high'] as const).map(level => (
              <label key={level} className="radio-label">
                <input
                  type="radio"
                  name="urgency"
                  value={level}
                  checked={formData.urgency === level}
                  onChange={(e) => updateUrgency(e.target.value as ContactFormData['urgency'])}
                />
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="message">
          Message <span className="required">*</span>
        </label>
        <textarea
          id="message"
          value={formData.message}
          onChange={(e) => updateMessage(e.target.value)}
          placeholder="Enter your message (10-1000 characters)"
          rows={5}
          className={errors.message ? 'error' : ''}
          required
        />
        <div className="character-count">
          {formData.message.length}/1000 characters
        </div>
        {errors.message && <div className="error-message">{errors.message}</div>}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.newsletter}
            onChange={(e) => updateNewsletter(e.target.checked)}
          />
          Subscribe to our newsletter for updates and tips
        </label>
      </div>

      <div className="form-actions">
        <button type="button" onClick={resetForm} disabled={isSubmitting}>
          Reset Form
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}

// ✅ Additional specific form components for different use cases
interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const validateLoginEmail = (email: string): string | null => {
    if (!email.trim()) return 'Email is required';
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return 'Password is required';
    return null;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateLoginEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    
    const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
    if (emailError) newErrors.email = emailError;
    if (passwordError) newErrors.password = passwordError;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rememberMe: formData.rememberMe
        })
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      const { token } = await response.json();
      localStorage.setItem('authToken', token);
      window.location.href = '/dashboard';
    } catch (error) {
      setErrors({ email: 'Invalid email or password' });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Log In</h2>
      
      <div className="form-group">
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
          className={errors.email ? 'error' : ''}
          required
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
          className={errors.password ? 'error' : ''}
          required
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={formData.rememberMe}
            onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
          />
          Remember me
        </label>
      </div>

      <button type="submit" disabled={isLoggingIn}>
        {isLoggingIn ? 'Logging in...' : 'Log In'}
      </button>
    </form>
  );
}

// ===== HARD - FIXED =====
// ✅ SOLUTION: Create specific state management for specific domains
// WHY: Each state manager is explicit about what it manages and how

// User state management
interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface UserState {
  users: User[];
  isLoading: boolean;
  error: string | null;
  lastFetched: Date | null;
}

class UserStateManager {
  private state: UserState = {
    users: [],
    isLoading: false,
    error: null,
    lastFetched: null
  };
  
  private subscribers: Array<(state: UserState) => void> = [];

  // ✅ Explicit methods for user operations
  async fetchUsers(): Promise<void> {
    this.updateState({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users = await response.json();
      this.updateState({ 
        users, 
        isLoading: false, 
        lastFetched: new Date() 
      });
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async createUser(userData: Omit<User, 'id'>): Promise<void> {
    this.updateState({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create user');
      }
      
      const newUser = await response.json();
      this.updateState({ 
        users: [...this.state.users, newUser],
        isLoading: false 
      });
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    this.updateState({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update user');
      }
      
      const updatedUser = await response.json();
      this.updateState({ 
        users: this.state.users.map(user => 
          user.id === userId ? updatedUser : user
        ),
        isLoading: false 
      });
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  async deleteUser(userId: string): Promise<void> {
    this.updateState({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      this.updateState({ 
        users: this.state.users.filter(user => user.id !== userId),
        isLoading: false 
      });
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  // ✅ Explicit getters for specific data
  getUsers(): User[] {
    return this.state.users;
  }

  getActiveUsers(): User[] {
    return this.state.users.filter(user => user.isActive);
  }

  getInactiveUsers(): User[] {
    return this.state.users.filter(user => !user.isActive);
  }

  getUserById(id: string): User | undefined {
    return this.state.users.find(user => user.id === id);
  }

  isLoading(): boolean {
    return this.state.isLoading;
  }

  getError(): string | null {
    return this.state.error;
  }

  getLastFetched(): Date | null {
    return this.state.lastFetched;
  }

  // ✅ Explicit subscription management
  subscribe(callback: (state: UserState) => void): () => void {
    this.subscribers.push(callback);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private updateState(updates: Partial<UserState>): void {
    this.state = { ...this.state, ...updates };
    this.subscribers.forEach(callback => callback(this.state));
  }

  // ✅ Explicit persistence methods
  saveToLocalStorage(): void {
    try {
      localStorage.setItem('userState', JSON.stringify({
        users: this.state.users,
        lastFetched: this.state.lastFetched?.toISOString()
      }));
    } catch (error) {
      console.warn('Failed to save user state to localStorage:', error);
    }
  }

  loadFromLocalStorage(): void {
    try {
      const saved = localStorage.getItem('userState');
      if (saved) {
        const parsed = JSON.parse(saved);
        this.updateState({
          users: parsed.users || [],
          lastFetched: parsed.lastFetched ? new Date(parsed.lastFetched) : null
        });
      }
    } catch (error) {
      console.warn('Failed to load user state from localStorage:', error);
    }
  }
}

// Product state management (separate concern)
interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  inStock: boolean;
}

interface ProductState {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
}

class ProductStateManager {
  private state: ProductState = {
    products: [],
    categories: [],
    isLoading: false,
    error: null
  };
  
  private subscribers: Array<(state: ProductState) => void> = [];

  async fetchProducts(): Promise<void> {
    this.updateState({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const products = await response.json();
      const categories = [...new Set(products.map((p: Product) => p.category))] as string[];
      
      this.updateState({ 
        products, 
        categories,
        isLoading: false 
      });
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  getProductsByCategory(category: string): Product[] {
    return this.state.products.filter(product => product.category === category);
  }

  getInStockProducts(): Product[] {
    return this.state.products.filter(product => product.inStock);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.state.products.filter(product =>
      product.name.toLowerCase().includes(lowerQuery)
    );
  }

  subscribe(callback: (state: ProductState) => void): () => void {
    this.subscribers.push(callback);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private updateState(updates: Partial<ProductState>): void {
    this.state = { ...this.state, ...updates };
    this.subscribers.forEach(callback => callback(this.state));
  }
}

// UI state management (separate concern)
interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  notifications: Array<{
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
    timestamp: Date;
  }>;
  modal: {
    isOpen: boolean;
    type: string | null;
    props: any;
  };
}

class UIStateManager {
  private state: UIState = {
    theme: 'light',
    sidebarOpen: true,
    notifications: [],
    modal: {
      isOpen: false,
      type: null,
      props: null
    }
  };
  
  private subscribers: Array<(state: UIState) => void> = [];

  setTheme(theme: 'light' | 'dark'): void {
    this.updateState({ theme });
  }

  toggleSidebar(): void {
    this.updateState({ sidebarOpen: !this.state.sidebarOpen });
  }

  openSidebar(): void {
    this.updateState({ sidebarOpen: true });
  }

  closeSidebar(): void {
    this.updateState({ sidebarOpen: false });
  }

  addNotification(message: string, type: UIState['notifications'][0]['type']): void {
    const notification = {
      id: `notification-${Date.now()}`,
      message,
      type,
      timestamp: new Date()
    };
    
    this.updateState({
      notifications: [...this.state.notifications, notification]
    });
  }

  removeNotification(id: string): void {
    this.updateState({
      notifications: this.state.notifications.filter(n => n.id !== id)
    });
  }

  clearAllNotifications(): void {
    this.updateState({ notifications: [] });
  }

  openModal(type: string, props: any = null): void {
    this.updateState({
      modal: {
        isOpen: true,
        type,
        props
      }
    });
  }

  closeModal(): void {
    this.updateState({
      modal: {
        isOpen: false,
        type: null,
        props: null
      }
    });
  }

  subscribe(callback: (state: UIState) => void): () => void {
    this.subscribers.push(callback);
    
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index > -1) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private updateState(updates: Partial<UIState>): void {
    this.state = { ...this.state, ...updates };
    this.subscribers.forEach(callback => callback(this.state));
  }
}

// ✅ Usage with explicit, focused state managers
function AppWithExplicitStateManagement() {
  const [userManager] = useState(() => new UserStateManager());
  const [productManager] = useState(() => new ProductStateManager());
  const [uiManager] = useState(() => new UIStateManager());
  
  const [users, setUsers] = useState(userManager.getUsers());
  const [isLoadingUsers, setIsLoadingUsers] = useState(userManager.isLoading());
  const [userError, setUserError] = useState(userManager.getError());

  useEffect(() => {
    // ✅ Explicit subscription to user state changes
    const unsubscribeUsers = userManager.subscribe((state) => {
      setUsers(state.users);
      setIsLoadingUsers(state.isLoading);
      setUserError(state.error);
    });

    // ✅ Explicit subscription to UI state changes  
    const unsubscribeUI = uiManager.subscribe((state) => {
      document.body.className = state.theme;
    });

    // ✅ Explicit initial data loading
    userManager.loadFromLocalStorage();
    userManager.fetchUsers();
    productManager.fetchProducts();

    return () => {
      unsubscribeUsers();
      unsubscribeUI();
    };
  }, [userManager, productManager, uiManager]);

  // ✅ Explicit action handlers
  const handleCreateUser = () => {
    userManager.createUser({
      name: 'New User',
      email: 'new@example.com',
      isActive: true
    });
  };

  const handleDeleteUser = (userId: string) => {
    userManager.deleteUser(userId);
  };

  const handleToggleTheme = () => {
    const currentTheme = (uiManager as any)['state'].theme; // Access private state for demo
    uiManager.setTheme(currentTheme === 'light' ? 'dark' : 'light');
  };

  const handleShowSuccess = () => {
    uiManager.addNotification('Operation completed successfully!', 'success');
  };

  return (
    <div className="app">
      <header>
        <h1>App with Explicit State Management</h1>
        <button onClick={handleToggleTheme}>Toggle Theme</button>
        <button onClick={handleShowSuccess}>Show Success</button>
      </header>

      <main>
        <section className="users-section">
          <h2>Users</h2>
          <button onClick={handleCreateUser}>Add User</button>
          
          {userError && <div className="error">{userError}</div>}
          {isLoadingUsers && <div className="loading">Loading users...</div>}
          
          <div className="users-list">
            {users.map(user => (
              <div key={user.id} className="user-item">
                <span>{user.name} ({user.email})</span>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* 
KEY PRINCIPLES DEMONSTRATED:

1. **Explicit Function Names**: Replace generic handlers with specific, descriptive functions
   - `fetchUsers()`, `createUser()`, `deleteUser()` instead of `handleAction('fetch')`
   - Each function has a single, clear responsibility
   - Function names describe exactly what they do

2. **Specific Components**: Create focused components instead of generic ones
   - `ContactForm`, `LoginForm` instead of `GenericForm`
   - Each component is explicit about its fields and validation
   - Business logic is clear and domain-specific

3. **Domain-Specific State Management**: Create focused state managers
   - `UserStateManager`, `ProductStateManager`, `UIStateManager`
   - Each manager handles a specific domain with explicit methods
   - No generic dispatch or reducer patterns

4. **Clear APIs**: Methods and props are self-documenting
   - `addNotification(message, type)` instead of `dispatch({ type: 'ADD', payload: {} })`
   - `getActiveUsers()` instead of `select('users.active')`
   - Type safety ensures correct usage

5. **Explicit Error Handling**: Each operation handles its own errors
   - Specific error messages for each operation
   - Clear error states and recovery actions
   - No generic error handling that obscures the source

EXPLICITNESS CHECKLIST:
✅ Function names clearly describe what they do
✅ Components have focused, single responsibilities  
✅ State management is domain-specific, not generic
✅ APIs are self-documenting and type-safe
✅ Error handling is specific to each operation
✅ Business logic is clear and not hidden behind abstractions
✅ Each piece of code has an obvious purpose
✅ No "magic" strings or generic patterns

BENEFITS OF EXPLICITNESS:
- Code is self-documenting and easier to understand
- Easier to find and fix bugs
- Safer refactoring (changes have clear scope)
- Better IDE support and autocomplete
- Easier onboarding for new developers
- Less cognitive overhead when reading code
- More predictable behavior

WHEN TO AVOID GENERALITY:
- When the abstraction doesn't provide clear value
- When the generic solution is more complex than specific ones
- When you need to handle many special cases
- When debugging becomes harder due to indirection
- When the API becomes unclear or hard to use
- When you find yourself constantly extending the generic system
*/