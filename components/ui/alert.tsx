import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Alert({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div role="note" className={cn('rounded-xl border border-green-500/20 bg-green-500/5 p-3 text-sm text-white/70', className)} {...props} />;
}
