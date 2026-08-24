import React, { type ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  children, 
  ...props 
}: ButtonProps) {
  
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0b131e] disabled:opacity-50 disabled:pointer-events-none rounded shadow-sm';
  
  const variants = {
    primary: 'bg-primary-500 text-[#0b131e] hover:bg-primary-400 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-slate-800 text-white hover:bg-slate-700 focus:ring-slate-700 border border-transparent',
    outline: 'border border-primary-500 bg-transparent text-primary-500 hover:bg-primary-500/10 focus:ring-primary-500',
    ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 focus:ring-slate-700 shadow-none',
    danger: 'bg-red-900/50 text-red-400 hover:bg-red-900 focus:ring-red-900 border border-red-800',
  };
  
  const sizes = {
    sm: 'h-8 px-4 text-[10px]',
    md: 'h-10 px-5 py-2 text-xs',
    lg: 'h-12 px-6 text-sm',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
