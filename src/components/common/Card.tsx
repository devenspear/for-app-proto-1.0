import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  padding = 'none',
}) => {
  const baseStyles = `
    bg-white rounded-2xl border border-neutral-100
    shadow-soft overflow-hidden
  `;

  const hoverStyles = hoverable
    ? 'hover-lift cursor-pointer hover:border-neutral-200'
    : '';

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${paddingStyles[padding]} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}> = ({ children, className = '', action }) => (
  <div className={`px-5 py-4 border-b border-neutral-100 flex items-center justify-between ${className}`}>
    <div>{children}</div>
    {action && <div>{action}</div>}
  </div>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-5 py-5 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => (
  <div className={`px-5 py-4 border-t border-neutral-100 bg-neutral-50/50 ${className}`}>
    {children}
  </div>
);
