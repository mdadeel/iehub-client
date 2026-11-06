import { useEffect, useState } from 'react';
import { HiWifi } from 'react-icons/hi';

/**
 * Tells the user the truth when the network drops, instead of letting every
 * action fail one toast at a time.
 */
const OfflineBanner = () => {
  const [offline, setOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false
  );

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-0 top-0 z-[80] flex items-center justify-center gap-2 bg-[#101417] px-4 py-1.5 text-center text-[12px] font-medium text-white"
    >
      <HiWifi className="h-3.5 w-3.5 rotate-45 text-accent-primary" />
      You are offline. Changes are not being saved — reconnect to continue.
    </div>
  );
};

export default OfflineBanner;
