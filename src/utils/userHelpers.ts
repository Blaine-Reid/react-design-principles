// Example utility that would be extracted too early
// This demonstrates premature abstraction - only used in one place

export const formatUserName = (firstName: string, lastName: string): string => {
  return `${firstName} ${lastName}`;
};

export const isVerified = (user: { badges: string[] }): boolean => {
  return user.badges.includes('verified');
};

export const getUserInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

export const getDisplayName = (user: { firstName: string; lastName: string; displayName?: string }): string => {
  return user.displayName || `${user.firstName} ${user.lastName}`;
};