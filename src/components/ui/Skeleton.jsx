import { cn } from '@/lib/utils';

/**
 * One skeleton primitive, so loading states stop being hand-rolled
 * `animate-pulse` divs with drifting heights and radii.
 *
 * <Skeleton className="h-3 w-24" />
 */
const Skeleton = ({ className, rounded = 'rounded-sm' }) => (
  <div
    aria-hidden="true"
    className={cn('animate-pulse bg-surface-subtle', rounded, className)}
  />
);

export default Skeleton;
