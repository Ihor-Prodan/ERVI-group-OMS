import React from 'react';
import { Check } from 'lucide-react';
import './CustomCheckBox.css';

type CustomCheckboxProps = {
  label: React.ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
};

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  label,
  checked = false,
  onChange,
  error = false,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`custom-checkbox-wrapper ${className}`}>
      <label
        className={`custom-checkbox-label 
    ${disabled ? 'disabled' : ''} 
    ${error ? 'error' : ''}`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled}
          className="custom-checkbox-input"
        />
        <span className={`custom-checkbox-box ${error ? 'error' : ''} ${checked ? 'checked' : ''}`}>
          {checked && <Check size={16} strokeWidth={3} />}
        </span>
        <span className="custom-checkbox-text">{label}</span>
      </label>
    </div>
  );
};

export default CustomCheckbox;
