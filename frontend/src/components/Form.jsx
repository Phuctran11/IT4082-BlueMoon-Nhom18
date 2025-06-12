import React from 'react';
import './Form.css';

export const FormGroup = ({ label, children, fullWidth }) => {
  return (
    <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
      {label && <label className="form-label">{label}</label>}
      {children}
    </div>
  );
};

export const FormRow = ({ children }) => {
  return <div className="form-row">{children}</div>;
};

export const FormActions = ({ children }) => {
  return <div className="form-actions">{children}</div>;
};

export const FormSection = ({ title, children }) => {
  return (
    <div className="form-section">
      {title && <h3 className="section-title">{title}</h3>}
      {children}
    </div>
  );
};

export const Form = ({ children, onSubmit }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {children}
    </form>
  );
}; 