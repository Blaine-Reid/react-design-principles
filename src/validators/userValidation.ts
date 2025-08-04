// Example validation utilities that are extracted too early
// These demonstrate over-abstraction when validation is form-specific

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Email is invalid';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
    return 'Password must contain uppercase, lowercase, and numbers';
  }
  return null;
};

export const validateAge = (age: string): string | null => {
  const ageNum = parseInt(age);
  if (!age) return 'Age is required';
  if (isNaN(ageNum)) return 'Age must be a number';
  if (ageNum < 13) return 'Must be at least 13 years old';  
  if (ageNum > 120) return 'Please enter a valid age';
  return null;
};

export const validateRequired = (value: string, fieldName: string): string | null => {
  return value.trim() ? null : `${fieldName} is required`;
};

export const validateMinLength = (value: string, minLength: number, fieldName: string): string | null => {
  return value.length >= minLength ? null : `${fieldName} must be at least ${minLength} characters`;
};