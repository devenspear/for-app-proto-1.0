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
  style,
  ...props
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 600,
    borderRadius: '0.75rem',
    transition: 'all 0.2s ease-out',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.5 : 1,
    border: 'none',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(to bottom, #4f46e5, #4338ca)',
      color: '#ffffff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    },
    secondary: {
      background: '#e4e4e7',
      color: '#3f3f46',
    },
    outline: {
      background: '#ffffff',
      color: '#3f3f46',
      border: '2px solid #d4d4d8',
    },
    ghost: {
      background: 'transparent',
      color: '#52525b',
    },
    danger: {
      background: 'linear-gradient(to bottom, #ef4444, #dc2626)',
      color: '#ffffff',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    },
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.5rem 0.875rem', fontSize: '0.875rem', gap: '0.375rem' },
    md: { padding: '0.625rem 1.25rem', fontSize: '0.875rem', gap: '0.5rem' },
    lg: { padding: '0.75rem 1.5rem', fontSize: '1rem', gap: '0.5rem' },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      className={className}
      disabled={disabled || isLoading}
      style={combinedStyles}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : leftIcon ? (
        <span style={{ flexShrink: 0 }}>{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {rightIcon && !isLoading && (
        <span style={{ flexShrink: 0 }}>{rightIcon}</span>
      )}
    </button>
  );
};
