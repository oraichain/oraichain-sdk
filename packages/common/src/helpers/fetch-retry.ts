export type RetryOptions = {
  retry?: number;
  timeout?: number;
  callback?: (retry: number) => void;
};

export const fetchRetry = async (
  url: RequestInfo | URL,
  options: RequestInit & RetryOptions = {}
) => {
  let retry = options.retry ?? 3;
  const { callback, timeout = 30000, ...init } = options;
  init.signal = AbortSignal.timeout(timeout);
  while (retry > 0) {
    try {
      return await fetch(url, init);
    } catch (e) {
      callback?.(retry);
      retry--;
      if (retry === 0) {
        throw e;
      }
    }
  }
};
