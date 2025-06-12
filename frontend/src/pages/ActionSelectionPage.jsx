import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ActionSelectionPage.css';

const ActionSelectionPage = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="action-selection-root">
      <header className="action-header">
        <div className="header-left">
          <img src="/logo.png" alt="BlueMoon" className="logo" />
          <span className="brand-text">BlueMoon</span>
        </div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-building">Chung cư ABC</div>
            <div className="user-details">
              <span className="user-icon">👤</span>
              <span className="user-name">Nguyen A</span>
              <span className="user-role">Admin</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">⎋</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>
      <main className="action-main">
        <h2 className="action-title">Lựa chọn tác vụ</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => navigate('/manage-khoan-thu')}>
            Quản lý khoản thu
          </button>
          <button className="action-btn" onClick={() => navigate('/manage-dot-thu')}>
            Quản lý đợt thu phí
          </button>
        </div>
      </main>
    </div>
  );
};

export default ActionSelectionPage; 