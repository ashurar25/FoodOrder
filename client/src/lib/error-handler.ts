// Global error handling utilities
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);
    
    // Prevent the default behavior (logging to console) for known issues
    if (event.reason && typeof event.reason === 'object') {
      const reason = event.reason as any;
      
      // Handle Firebase auth errors gracefully
      if (reason.code && reason.code.startsWith('auth/')) {
        console.log('Firebase auth error handled:', reason.code);
        event.preventDefault();
        return;
      }
      
      // Handle frame reading errors from Vite plugins
      if (reason.message && reason.message.includes('frame')) {
        console.log('Frame reading error handled');
        event.preventDefault();
        return;
      }
    }
  });

  // Handle general JavaScript errors
  window.addEventListener('error', (event) => {
    // Handle frame reading errors specifically
    if (event.message && event.message.includes('frame')) {
      console.log('Frame reading error handled:', event.message);
      event.preventDefault();
      return;
    }
    
    // Handle Firebase errors
    if (event.message && event.message.includes('Firebase')) {
      console.log('Firebase error handled:', event.message);
      event.preventDefault();
      return;
    }
  });
}

// Safe wrapper for potentially problematic operations
export function safeExecute<T>(fn: () => T, fallback?: T): T | undefined {
  try {
    return fn();
  } catch (error) {
    console.warn('Safe execution caught error:', error);
    return fallback;
  }
}

// Safe wrapper for async operations
export async function safeExecuteAsync<T>(fn: () => Promise<T>, fallback?: T): Promise<T | undefined> {
  try {
    return await fn();
  } catch (error) {
    console.warn('Safe async execution caught error:', error);
    return fallback;
  }
}