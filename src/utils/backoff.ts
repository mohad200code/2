/**
 * Reusable exponential backoff utility for robust client-side API integrations.
 * Automatically retries failed asynchronous tasks (such as network fetches) with
 * increasing delays and randomized jitter to prevent resource starvation.
 */
export async function withExponentialBackoff<T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000,
  maxDelay = 10000,
  factor = 2,
  shouldRetry?: (error: any) => boolean
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;
      
      const canRetry = attempt <= retries;
      const isRetryable = shouldRetry ? shouldRetry(error) : true;
      
      if (!canRetry || !isRetryable) {
        throw error;
      }
      
      // Compute exponential backoff time with ±150ms randomized jitter
      const calculatedDelay = Math.min(delay * Math.pow(factor, attempt - 1), maxDelay);
      const jitter = (Math.random() - 0.5) * 300;
      const sleepTime = Math.max(50, calculatedDelay + jitter);
      
      console.warn(
        `[BACKOFF RETRY] Attempt ${attempt}/${retries} failed. Retrying in ${sleepTime.toFixed(0)}ms. Error:`,
        error?.message || error
      );
      
      await new Promise((resolve) => setTimeout(resolve, sleepTime));
    }
  }
}
