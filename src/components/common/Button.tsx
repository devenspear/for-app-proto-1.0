import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = `
    inline-flex items-center justify-center font-semibold
    rounded-xl transition-all duration-200 ease-out
    focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    active:scale-[0.98]
  `;

  const variantStyles = {
    primary: `
      bg-gradient-to-b from-primary-500 to-primary-600
      text-white shadow-soft
      hover:from-primary-600 hover:to-primary-700 hover:shadow-medium
      focus-visible:ring-primary-500
    `,
    secondary: `
      bg-neutral-100 text-neutral-700
      hover:bg-neutral-200
      focus-visible:ring-neutral-500
    `,
    outline: `
      border-2 border-neutral-200 text-neutral-700 bg-white
      hover:border-neutral-300 hover:bg-neutral-50
      focus-visible:ring-neutral-500
    `,
    ghost: `
      text-neutral-600 bg-transparent
      hover:bg-neutral-100 hover:text-neutral-900
      focus-visible:ring-neutral-500
    `,
    danger: `
      bg-gradient-to-b from-danger-500 to-danger-600
      text-white shadow-soft
      hover:from-danger-600 hover:to-danger-600 hover:shadow-medium
      focus-visible:ring-danger-500
    `,
  };

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span className="flex-shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading && (
        <span className="flex-shrink-0">{rightIcon}</span>
      )}
    </button>
  );
};
