import { cn } from '../../lib/cn.js';

export default function IconButton({ label, className, children, ...props }) {
  return <button className={cn('icon-action', className)} aria-label={label} title={label} {...props}>{children}</button>;
}
