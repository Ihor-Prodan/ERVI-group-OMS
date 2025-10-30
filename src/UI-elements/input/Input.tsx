import React from 'react';
import './Input.css';

type CustomInputProps = {
  label: string;
  type?: React.HTMLInputTypeAttribute;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
  min?: string;
};

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  error = false,
  errorMessage = '',
  disabled = false,
  className = '',
  min,
}) => {
  return (
    <div className={`custom-input-wrapper ${className}`}>
      <label className={`custom-input-label ${error ? 'error' : ''}`}>
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        min={min}
        className={`custom-input-field ${error ? 'error' : ''}`}
      />

      {error && errorMessage && (
        <span className="custom-input-error">{errorMessage}</span>
      )}
    </div>
  );
};

export default CustomInput;
