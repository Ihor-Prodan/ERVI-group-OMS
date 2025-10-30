import React from 'react';
import './Button.css';

type ButtonVariant = 'primary' | 'secondary' | 'error';
type ButtonSize = 'sm' | 'md' | 'lg';

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset' | undefined;
};

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    disabled ? 'btn--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classes} onClick={onClick} disabled={disabled}>
      {text}
    </button>
  );
};

export default Button;
