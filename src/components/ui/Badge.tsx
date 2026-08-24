import React, { type HTMLAttributes } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
}

export function Badge({ variant = 'default', className = '', children, ...props }: BadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
}

// Special badges for CarScore
export function ConfidenceBadge({ score, className = '' }: { score: number, className?: string }) {
  let variant: BadgeProps['variant'] = 'default';
  
  if (score >= 90) variant = 'success';
  else if (score >= 70) variant = 'info';
  else if (score >= 50) variant = 'warning';
  else variant = 'danger';

  return (
    <Badge variant={variant} className={className}>
      {score}% Confidence
    </Badge>
  );
}
