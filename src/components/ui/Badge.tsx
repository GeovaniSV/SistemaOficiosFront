import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80',
        secondary: 'border-transparent bg-slate-100 text-slate-900 hover:bg-slate-100/80',
        destructive: 'border-transparent bg-rose-100 text-rose-700',
        outline: 'text-slate-950',
        success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'border-transparent bg-amber-50 text-amber-700 border border-amber-200',
        info: 'border-transparent bg-blue-50 text-blue-700 border border-blue-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
