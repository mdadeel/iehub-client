/**
 * Fire-and-forget client error reporting.
 * Never throws, never blocks rendering — a failed report must not become a
 * second failure. Endpoint contract: BACKEND-TODO.md §7.
 */
const endpoint = '/api/telemetry/client-error';

export const reportClientError = (error, info = {}) => {
  try {
    const payload = {
      message: String(error?.message || error || 'Unknown error'),
      stack: String(error?.stack || '').slice(0, 4000),
      componentStack: String(info?.componentStack || '').slice(0, 4000),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      correlationId:
        typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : undefined,
      at: new Date().toISOString(),
    };

    const body = JSON.stringify(payload);
    // sendBeacon survives a tab that is being closed; fetch is the fallback.
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const sent = navigator.sendBeacon(endpoint, new Blob([body], { type: 'application/json' }));
      if (sent) return;
    }
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* telemetry must never break the app */
  }
};
