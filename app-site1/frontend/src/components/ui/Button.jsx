import { cn } from '../../lib/cn.js';

export default function Button({ variant = 'secondary', size = 'md', className, children, ...props }) {
  return <button
    className={cn('ui-button', 'ui-button-' + variant, 'ui-button-' + size, className)}
    {...props}
  >{children}</button>;
}
