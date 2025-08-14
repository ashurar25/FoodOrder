// Global error handling utilities
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);

    // Show user-friendly error message for network errors
    if (event.reason?.name === 'NetworkError' || event.reason?.message?.includes('fetch')) {
      console.warn('Network error detected, user may need to check connection');
    }

    // Prevent the default behavior (which would log to console)
    event.preventDefault();
  });

  // Handle JavaScript runtime errors
  window.addEventListener('error', (event) => {
    console.error('JavaScript error:', event.error);

    // Don't break the app for minor errors
    if (event.error?.name === 'ChunkLoadError') {
      console.warn('Chunk load error, may need to refresh page');
      // Optionally show a toast notification
    }
  });

  // Handle resource loading errors (images, scripts, etc.)
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      console.warn('Resource loading error:', event.target);
    }
  }, true);
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