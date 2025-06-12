import React from 'react';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  icon,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    loading ? 'button-loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="button-spinner"></span>
      ) : (
        <>
          {icon && <span className="button-icon">{icon}</span>}
          <span className="button-text">{children}</span>
        </>
      )}
    </button>
  );
};

export default Button; 