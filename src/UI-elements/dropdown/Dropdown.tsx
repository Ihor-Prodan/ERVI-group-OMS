import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import './Dropdown.css';

type Option = {
  value: string | number;
  label: string;
};

type CustomDropdownProps = {
  label: string;
  options: Option[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
};

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  error = false,
  errorMessage = '',
  disabled = false,
  className = '',
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    if (disabled) return;
    onChange?.(option.value);
    setOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={`custom-dropdown-wrapper ${className}`}>
      <div className="custom-dropdown-header">
        <label className={`custom-dropdown-label ${error ? 'error' : ''}`}>
          {label}
        </label>
        {error && errorMessage && (
          <span className="custom-dropdown-error">{errorMessage}</span>
        )}
      </div>

      <div
        className={`custom-dropdown-field ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => !disabled && setOpen(!open)}
      >
        <span className={`custom-dropdown-value ${!value ? 'placeholder' : ''}`}>
          {options.find((o) => o.value === value)?.label || placeholder}
        </span>
        <ChevronDown className={`custom-dropdown-icon ${open ? 'open' : ''}`} size={20} />
      </div>

      {open && (
        <ul className="custom-dropdown-menu">
          {options.map((option) => (
            <li
              key={option.value}
              className={`custom-dropdown-option ${
                option.value === value ? 'selected' : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              <span>{option.label}</span>
              {option.value === value && <Check size={18} className="custom-dropdown-check" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
