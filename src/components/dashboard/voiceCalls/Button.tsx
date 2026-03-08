'use client';

import { forwardRef } from 'react';

type Variant = 'primary' | 'secondary';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
  secondary:
    'bg-white text-gray-800 font-medium border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className = '', children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={`rounded-xl px-5 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
