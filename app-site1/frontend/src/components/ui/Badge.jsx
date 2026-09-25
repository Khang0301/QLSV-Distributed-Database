import { cn } from '../../lib/cn.js';

export default function Badge({ tone = 'neutral', className, children }) {
  return <span className={cn('ui-badge', 'ui-badge-' + tone, className)}>{children}</span>;
}
