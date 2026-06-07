import React from 'react';
import { cn } from '../../lib/utils';

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, icon, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <select
          className={cn(
            'flex w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
            (!props.value || props.value === '') ? 'text-slate-400' : 'text-slate-900',
            icon && 'pl-10',
            error && 'border-rose-300 focus-visible:border-rose-500 focus-visible:ring-rose-500/20',
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </select>
        {/* Custom Chevron since appearance-none removes default arrow */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {error && (
          <p className="mt-1 text-xs text-rose-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
