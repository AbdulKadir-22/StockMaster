// FILE: stockmaster-frontend/src/components/ui/Button.jsx
import React from 'react';
import './Button.css';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  isLoading = false, 
  disabled, 
  children, 
  className = '',
  ...props 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const loadingClass = isLoading ? 'btn--loading' : '';
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${loadingClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? 'Processing...' : children}
    </button>
  );
};

export default Button;