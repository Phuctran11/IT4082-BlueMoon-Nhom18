import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageKhoanThuPage.css';

const ManageKhoanThuPage = () => {
  const navigate = useNavigate();
  return (
    <div className="action-selection-root">
      <header className="action-header">
        <div className="header-left">BlueMoon</div>
        <div className="header-right">
          <div className="user-info">
            <div className="user-building">Chung cư ABC</div>
            <div className="user-details">
              <span className="user-icon">👤</span>
              <span className="user-name">Nguyen A</span>
              <span className="user-role">Kế toán</span>
            </div>
          </div>
          <button className="logout-btn">⎋ Logout</button>
        </div>
      </header>
      <main className="action-main">
        <div className="manage-header-row">
          <button className="back-btn" onClick={() => navigate(-1)}>&lt; Quay lại</button>
          <h2 className="action-title" style={{marginBottom: 0}}>Quản lý khoản thu</h2>
        </div>
        <div className="action-buttons" style={{marginTop: '2.5rem'}}>
          <button className="action-btn" onClick={() => navigate('/crud-khoan-thu')}>CRUD khoản thu</button>
          <button className="action-btn" onClick={() => navigate('/thong-ke-pre')}>Thống kê khoản thu</button>
          <button className="action-btn" onClick={() => navigate('/tra-cuu-pre')}>Tra cứu khoản thu</button>
        </div>
      </main>
    </div>
  );
};

export default ManageKhoanThuPage; 