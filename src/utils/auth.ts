// Authentication utilities and token management

export interface AuthToken {
  token: string;
  expiry: number;
  user: any;
}

export const isTokenValid = (): boolean => {
  try {
    const token = localStorage.getItem('vitabu_auth_token');
    const expiry = localStorage.getItem('vitabu_token_expiry');
    
    if (!token || !expiry) return false;
    
    return Date.now() < parseInt(expiry);
  } catch (error) {
    console.warn('Error checking token validity:', error);
    return false;
  }
};

export const getCurrentUser = (): any | null => {
  try {
    if (!isTokenValid()) {
      clearAuthData();
      return null;
    }
    
    const userData = localStorage.getItem('vitabu_user');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.warn('Error getting current user:', error);
    clearAuthData();
    return null;
  }
};

export const clearAuthData = (): void => {
  try {
    localStorage.removeItem('vitabu_auth_token');
    localStorage.removeItem('vitabu_token_expiry');
    localStorage.removeItem('vitabu_user');
  } catch (error) {
    console.warn('Error clearing auth data:', error);
  }
};

export const refreshTokenIfNeeded = (): boolean => {
  try {
    const expiry = localStorage.getItem('vitabu_token_expiry');
    if (!expiry) return false;
    
    const expiryTime = parseInt(expiry);
    const now = Date.now();
    const timeUntilExpiry = expiryTime - now;
    
    // Refresh if token expires in less than 1 hour
    if (timeUntilExpiry < 60 * 60 * 1000 && timeUntilExpiry > 0) {
      // In a real app, this would make an API call to refresh the token
      const newExpiry = now + (24 * 60 * 60 * 1000); // Extend by 24 hours
      localStorage.setItem('vitabu_token_expiry', newExpiry.toString());
      return true;
    }
    
    return false;
  } catch (error) {
    console.warn('Error refreshing token:', error);
    return false;
  }
};

// Middleware for protected routes
export const requireAuth = (callback: () => void, onUnauthorized: () => void) => {
  if (isTokenValid()) {
    refreshTokenIfNeeded();
    callback();
  } else {
    clearAuthData();
    onUnauthorized();
  }
};

// 2FA utilities (for future implementation)
export const initiate2FA = async (method: 'email' | 'sms', contact: string): Promise<boolean> => {
  try {
    // Simulate API call to send 2FA code
    console.log(`Sending 2FA code via ${method} to ${contact}`);
    return true;
  } catch (error) {
    console.error('Error initiating 2FA:', error);
    return false;
  }
};

export const verify2FA = async (code: string): Promise<boolean> => {
  try {
    // Simulate API call to verify 2FA code
    return code === '123456'; // Mock verification
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return false;
  }
};