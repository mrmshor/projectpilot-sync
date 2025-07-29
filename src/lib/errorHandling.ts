// Error boundary utilities
export class AppError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleStorageError = (error: any, operation: string): void => {
  console.error(`Storage ${operation} failed:`, error);
  
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'QuotaExceededError':
        console.warn('Storage quota exceeded - cleaning up old data');
        // Attempt to clear some storage
        try {
          const keys = Object.keys(localStorage);
          keys.forEach(key => {
            if (key.startsWith('temp_') || key.startsWith('cache_')) {
              localStorage.removeItem(key);
            }
          });
        } catch (e) {
          console.error('Failed to cleanup storage:', e);
        }
        break;
      case 'SecurityError':
        console.warn('Storage access denied - private browsing mode?');
        break;
      default:
        console.warn('Unknown storage error:', error.name);
    }
  }
};

export const safeJSONParse = <T>(data: string | null, fallback: T): T => {
  if (!data || data.trim() === '') return fallback;
  
  try {
    const parsed = JSON.parse(data);
    // Additional validation to ensure parsed data is valid
    if (parsed === null || parsed === undefined) {
      return fallback;
    }
    return parsed;
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
};

export const safeJSONStringify = (data: any): string | null => {
  try {
    return JSON.stringify(data);
  } catch (error) {
    console.error('JSON stringify error:', error);
    return null;
  }
};

// Crypto UUID fallback for older browsers
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback for older browsers
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};