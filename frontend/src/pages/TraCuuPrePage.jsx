import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TraCuuPrePage.css';

const TraCuuPrePage = () => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    tieuChiTraCuu: 'Số tiền',
    giaTriTraCuu: '200,000đ'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Navigate to search results page with the search criteria
    navigate('/tra-cuu-khoan-thu', { 
      state: { 
        searchCriteria: searchData.tieuChiTraCuu,
        searchValue: searchData.giaTriTraCuu 
      } 
    });
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
      <main className="tracuu-pre-main">
        <div className="crud-header">
          <button className="back-btn" onClick={() => navigate(-1)}>&lt; Quay lại</button>
          <h2 className="crud-title">Quản lý khoản thu / Tra cứu khoản thu</h2>
        </div>
        
        <div className="tracuu-pre-container">
          <form onSubmit={handleSubmit} className="tracuu-pre-form">
            <div className="form-group">
              <label htmlFor="tieuChiTraCuu">Tiêu chí tra cứu</label>
              <input
                type="text"
                id="tieuChiTraCuu"
                name="tieuChiTraCuu"
                value={searchData.tieuChiTraCuu}
                onChange={handleInputChange}
                className="search-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="giaTriTraCuu">Giá trị</label>
              <input
                type="text"
                id="giaTriTraCuu"
                name="giaTriTraCuu"
                value={searchData.giaTriTraCuu}
                onChange={handleInputChange}
                className="search-input"
              />
            </div>
            <button type="submit" className="tracuu-submit-btn">
              Tra cứu
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TraCuuPrePage; 