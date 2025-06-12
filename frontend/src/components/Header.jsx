import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ user }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    // Implement logout logic here
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <div className="logo" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="BlueMoon Logo" />
            <span className="logo-text">BlueMoon</span>
          </div>
        </div>

        <div className="header-right">
          {user && (
            <div className="user-menu">
              <button
                className="user-button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} />
                  ) : (
                    <span>{user.name[0].toUpperCase()}</span>
                  )}
                </div>
                <span className="user-name">{user.name}</span>
                <svg
                  className={`dropdown-arrow ${dropdownOpen ? 'open' : ''}`}
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M2.5 4.5L6 8L9.5 4.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="dropdown-menu">
                  <button
                    className="dropdown-item"
                    onClick={() => navigate('/profile')}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M13.3 14V12.7C13.3 11.1 11.9 9.7 10.3 9.7H5.7C4.1 9.7 2.7 11.1 2.7 12.7V14"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <circle
                        cx="8"
                        cy="5"
                        r="3"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Profile
                  </button>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        d="M6 14H3.3C2.6 14 2 13.4 2 12.7V3.3C2 2.6 2.6 2 3.3 2H6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.7 11.3L14 8L10.7 4.7"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 8H6"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 