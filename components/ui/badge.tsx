import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, variant = 'default', ...props }: HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'danger' | 'muted' }) {
  const variants = {
    default: 'bg-white/10 text-white', success: 'bg-green-500/15 text-green-300', warning: 'bg-amber-500/15 text-amber-300', danger: 'bg-red-500/15 text-red-300', muted: 'bg-white/5 text-white/50',
  };
  return <span className={cn('inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold', variants[variant], className)} {...props} />;
}
