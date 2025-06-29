// Local storage utilities for persisting user data during listing flow

export interface ListingFormData {
  title: string;
  subject: string;
  grade: string;
  term: string;
  condition: string;
  originalPrice: string;
  askingPrice: string;
  description: string;
  images: string[];
  flipThroughVideo: string;
  location: string;
  availableForExchange: boolean;
  exchangeWishlist: string[];
  userEmail?: string;
  userPhone?: string;
}

export interface UserPreferences {
  location: string;
  preferredSubjects: string[];
  commonGrades: string[];
  exchangePreferences: string[];
}

const LISTING_FORM_KEY = 'vitabu_listing_form';
const USER_PREFERENCES_KEY = 'vitabu_user_preferences';
const LAST_LOCATION_KEY = 'vitabu_last_location';

export const saveListingFormData = (data: Partial<ListingFormData>) => {
  try {
    const existing = getListingFormData();
    const updated = { ...existing, ...data };
    localStorage.setItem(LISTING_FORM_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save listing form data:', error);
  }
};

export const getListingFormData = (): Partial<ListingFormData> => {
  try {
    const data = localStorage.getItem(LISTING_FORM_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to load listing form data:', error);
    return {};
  }
};

export const clearListingFormData = () => {
  try {
    localStorage.removeItem(LISTING_FORM_KEY);
  } catch (error) {
    console.warn('Failed to clear listing form data:', error);
  }
};

export const saveUserPreferences = (preferences: Partial<UserPreferences>) => {
  try {
    const existing = getUserPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save user preferences:', error);
  }
};

export const getUserPreferences = (): Partial<UserPreferences> => {
  try {
    const data = localStorage.getItem(USER_PREFERENCES_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.warn('Failed to load user preferences:', error);
    return {};
  }
};

export const saveLastLocation = (location: string) => {
  try {
    localStorage.setItem(LAST_LOCATION_KEY, location);
  } catch (error) {
    console.warn('Failed to save last location:', error);
  }
};

export const getLastLocation = (): string => {
  try {
    return localStorage.getItem(LAST_LOCATION_KEY) || '';
  } catch (error) {
    console.warn('Failed to load last location:', error);
    return '';
  }
};

// Auto-save functionality with debouncing
let saveTimeout: NodeJS.Timeout;

export const autoSaveListingForm = (data: Partial<ListingFormData>, delay: number = 1000) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    saveListingFormData(data);
  }, delay);
};

// Session management for non-logged-in users
export const isSessionActive = (): boolean => {
  try {
    const sessionStart = sessionStorage.getItem('vitabu_session_start');
    if (!sessionStart) {
      sessionStorage.setItem('vitabu_session_start', Date.now().toString());
      return true;
    }
    
    const sessionAge = Date.now() - parseInt(sessionStart);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    return sessionAge < maxAge;
  } catch (error) {
    return true;
  }
};

export const clearExpiredData = () => {
  if (!isSessionActive()) {
    clearListingFormData();
    try {
      sessionStorage.removeItem('vitabu_session_start');
    } catch (error) {
      console.warn('Failed to clear session data:', error);
    }
  }
};