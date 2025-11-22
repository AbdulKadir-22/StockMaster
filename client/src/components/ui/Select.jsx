// FILE: stockmaster-frontend/src/components/ui/Select.jsx
import React from 'react';
import './Select.css';

const Select = ({ 
  label, 
  name, 
  value, 
  onChange, 
  options = [], 
  error,
  placeholder = 'Select an option',
  ...props 
}) => {
  return (
    <div className={`select-group ${error ? 'has-error' : ''}`}>
      {label && (
        <label htmlFor={name} className="select-label">
          {label}
        </label>
      )}
      <div className="select-wrapper">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="select-field"
          aria-invalid={!!error}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <span className="select-error">{error}</span>}
    </div>
  );
};

export default Select;