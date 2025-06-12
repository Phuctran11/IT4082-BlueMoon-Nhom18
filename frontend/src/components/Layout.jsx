import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M3.33 8.33L10 3.33L16.67 8.33V16.67H3.33V8.33Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Residents',
      path: '/residents',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M16.67 17.5V15.83C16.67 13.99 15.18 12.5 13.33 12.5H6.67C4.83 12.5 3.33 13.99 3.33 15.83V17.5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="10"
            cy="6.67"
            r="3.33"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Statistics',
      path: '/statistics',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M15.83 16.67H4.17V5"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.83 7.5L10 13.33L7.5 10.83L4.17 14.17"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      label: 'Settings',
      path: '/settings',
      icon: (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.17 10C16.17 10.57 16.08 11.13 15.92 11.67L17.92 13.25C18.08 13.38 18.13 13.63 18 13.83L16.33 16.67C16.21 16.87 15.96 16.92 15.75 16.83L13.42 15.83C12.75 16.33 12 16.71 11.17 16.92L10.83 19.42C10.79 19.63 10.63 19.83 10.42 19.83H7.08C6.87 19.83 6.71 19.63 6.67 19.42L6.33 16.92C5.5 16.71 4.75 16.33 4.08 15.83L1.75 16.83C1.54 16.92 1.29 16.87 1.17 16.67L-0.5 13.83C-0.63 13.63 -0.58 13.38 -0.42 13.25L1.58 11.67C1.42 11.13 1.33 10.57 1.33 10C1.33 9.43 1.42 8.87 1.58 8.33L-0.42 6.75C-0.58 6.62 -0.63 6.37 -0.5 6.17L1.17 3.33C1.29 3.13 1.54 3.08 1.75 3.17L4.08 4.17C4.75 3.67 5.5 3.29 6.33 3.08L6.67 0.58C6.71 0.37 6.87 0.17 7.08 0.17H10.42C10.63 0.17 10.79 0.37 10.83 0.58L11.17 3.08C12 3.29 12.75 3.67 13.42 4.17L15.75 3.17C15.96 3.08 16.21 3.13 16.33 3.33L18 6.17C18.13 6.37 18.08 6.62 17.92 6.75L15.92 8.33C16.08 8.87 16.17 9.43 16.17 10Z"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="layout">
      <Header />
      <div className="layout-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
            >
              <path
                d={
                  sidebarOpen
                    ? 'M12.5 15L7.5 10L12.5 5'
                    : 'M7.5 15L12.5 10L7.5 5'
                }
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <nav className="sidebar-nav">
            {navigationItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                className={`nav-item ${
                  location.pathname === item.path ? 'active' : ''
                }`}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </a>
            ))}
          </nav>
        </aside>
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};

export default Layout; 