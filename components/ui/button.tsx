import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'secondary' | 'ghost' | 'danger'; size?: 'sm' | 'md' | 'lg' }>(function Button({ className, variant = 'default', size = 'md', ...props }, ref) {
  const variants = {
    default: 'bg-green-500 text-black hover:bg-green-400',
    secondary: 'bg-white/10 text-white hover:bg-white/15',
    ghost: 'bg-transparent text-white/70 hover:bg-white/10 hover:text-white',
    danger: 'bg-red-500/15 text-red-300 hover:bg-red-500/25',
  };
  const sizes = { sm: 'h-8 px-3 text-xs', md: 'h-10 px-4 text-sm', lg: 'h-12 px-5 text-base' };
  return <button ref={ref} className={cn('inline-flex items-center justify-center rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-50', variants[variant], sizes[size], className)} {...props} />;
});
