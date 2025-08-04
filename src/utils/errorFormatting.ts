// Example error formatting utility extracted too early
// This shows premature abstraction for simple formatting logic

export const formatErrorMessage = (error: string): string => {
  return `⚠️ ${error}`;
};

export const formatSuccessMessage = (message: string): string => {
  return `✅ ${message}`;
};

export const formatWarningMessage = (message: string): string => {
  return `⚠️ ${message}`;
};

export const formatInfoMessage = (message: string): string => {
  return `ℹ️ ${message}`;
};

export const capitalizeError = (error: string): string => {
  return error.charAt(0).toUpperCase() + error.slice(1);
};