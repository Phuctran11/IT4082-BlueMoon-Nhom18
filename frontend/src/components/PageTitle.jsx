import React from 'react';
import { Link } from 'react-router-dom';
import './PageTitle.css';

const PageTitle = ({
  title,
  subtitle,
  breadcrumbs = [],
  actions,
  className = '',
}) => {
  return (
    <div className={`page-title ${className}`}>
      <div className="page-title-content">
        <div className="page-title-left">
          {breadcrumbs.length > 0 && (
            <nav className="breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                  {index > 0 && (
                    <svg
                      className="breadcrumb-separator"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M6 4L10 8L6 12"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="breadcrumb-current">{crumb.label}</span>
                  ) : (
                    <Link to={crumb.path} className="breadcrumb-link">
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
          <h1 className="page-title-heading">{title}</h1>
          {subtitle && <p className="page-title-subtitle">{subtitle}</p>}
        </div>
        {actions && <div className="page-title-actions">{actions}</div>}
      </div>
    </div>
  );
};

export default PageTitle; 