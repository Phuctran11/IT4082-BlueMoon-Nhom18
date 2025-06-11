import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ThongKePrePage.css';

const ThongKePrePage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Q1/2024');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to statistics page with the selected category
    navigate('/thong-ke-khoan-thu', { state: { category: selectedCategory } });
  };

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
      <main className="thongke-pre-main">
        <div className="crud-header">
          <button className="back-btn" onClick={() => navigate(-1)}>&lt; Quay lại</button>
          <h2 className="crud-title">Quản lý khoản thu / Thống kê khoản thu</h2>
        </div>
        
        <div className="thongke-pre-container">
          <form onSubmit={handleSubmit} className="thongke-pre-form">
            <div className="form-group">
              <label htmlFor="category">Thời gian thống kê</label>
              <input
                type="text"
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-input"
              />
            </div>
            <button type="submit" className="thongke-submit-btn">
              Thống kê
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ThongKePrePage; 