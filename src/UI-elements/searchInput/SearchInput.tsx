import React from 'react';
import './SearchInput.css';

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Search...',
  value,
  onChange,
  onSearch,
  disabled = false,
  error = false,
  className = '',
  onKeyDown,
}) => {
  const classes = [
    'search-input',
    disabled ? 'search-input--disabled' : '',
    error ? 'search-input--error' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <input
        type="text"
        className="search-input__field"
        placeholder={placeholder}
        value={value}
        onKeyDown={onKeyDown}
        onChange={onChange}
        disabled={disabled}
      />
      <button
        type="button"
        className="search-input__button"
        onClick={onSearch}
        disabled={disabled}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="search-input__icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;
