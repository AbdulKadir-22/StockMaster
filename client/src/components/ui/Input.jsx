// FILE: stockmaster-frontend/src/components/ui/Input.jsx
import React from 'react';
import './Input.css';

const Input = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  error, 
  placeholder,
  ...props 
}) => {
  return (
    <div className={`input-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={name} className="input-label">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default Input;