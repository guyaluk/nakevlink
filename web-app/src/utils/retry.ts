export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  shouldRetry?: (error: any) => boolean;
}

export class RetryError extends Error {
  public lastError: any;
  public attemptsMade: number;

  constructor(
    message: string,
    lastError: any,
    attemptsMade: number
  ) {
    super(message);
    this.name = 'RetryError';
    this.lastError = lastError;
    this.attemptsMade = attemptsMade;
  }
}

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    shouldRetry = (error) => {
      // Default retry logic for Firebase/network errors
      if (error?.code) {
        // Firebase-specific error codes that are retryable
        return [
          'unavailable',
          'deadline-exceeded', 
          'resource-exhausted',
          'internal',
          'aborted',
          'cancelled'
        ].some(code => error.code.includes(code));
      }
      
      // HTTP status codes that are retryable
      if (error?.status) {
        return [408, 429, 500, 502, 503, 504].includes(error.status);
      }
      
      // Network errors
      if (error?.message) {
        const message = error.message.toLowerCase();
        return message.includes('network') || 
               message.includes('timeout') ||
               message.includes('connection') ||
               message.includes('fetch');
      }
      
      return false;
    }
  } = options;

  let lastError: any;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      console.log(`Retry attempt ${attempt + 1} of ${maxAttempts}`);
      return await operation();
    } catch (error) {
      lastError = error;
      attempt++;

      console.warn(`Operation failed on attempt ${attempt}:`, error);

      // Don't retry if we've exhausted attempts or error is not retryable
      if (attempt >= maxAttempts || !shouldRetry(error)) {
        break;
      }

      // Calculate delay with exponential backoff and jitter
      const exponentialDelay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 0.1 * exponentialDelay; // 10% jitter
      const delay = Math.min(exponentialDelay + jitter, maxDelay);

      console.log(`Retrying in ${Math.round(delay)}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw new RetryError(
    `Operation failed after ${attempt} attempts`,
    lastError,
    attempt
  );
}

// Specialized retry for Firebase operations
export async function retryFirebaseOperation<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  return retryWithBackoff(operation, {
    maxAttempts: 3,
    baseDelay: 1000,
    maxDelay: 8000,
    shouldRetry: (error) => {
      // Firebase-specific retry logic
      if (error?.code) {
        const code = error.code;
        
        // Don't retry authentication or permission errors
        if (code.includes('permission-denied') || 
            code.includes('unauthenticated') ||
            code.includes('not-found')) {
          return false;
        }
        
        // Retry network and server errors
        return code.includes('unavailable') ||
               code.includes('deadline-exceeded') ||
               code.includes('resource-exhausted') ||
               code.includes('internal') ||
               code.includes('aborted') ||
               code.includes('cancelled');
      }
      
      // Retry network errors
      if (error?.message) {
        const message = error.message.toLowerCase();
        return message.includes('network') || 
               message.includes('timeout') ||
               message.includes('connection') ||
               message.includes('fetch') ||
               message.includes('bad request'); // Include 400 errors for emulator connection issues
      }
      
      return false;
    },
    ...options
  });
}