import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './TraCuuKhoanThuPage.css';

const TraCuuKhoanThuPage = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState('Số tiền');
  const [searchValue, setSearchValue] = useState('200,000đ');

  // Dummy data - replace with API call using searchCriteria and searchValue
  const searchResults = [
    {
      tenKhoanThu: 'Dịch vụ trông xe',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
      tinhTrang: 'Đã thu'
    },
    {
      tenKhoanThu: 'Phí môi trường',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
      tinhTrang: 'Đã thu'
    },
    {
      tenKhoanThu: 'Dịch vụ bảo vệ',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
      tinhTrang: 'Đã thu'
    },
    {
      tenKhoanThu: 'Dịch vụ bể bơi',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
      tinhTrang: 'Đã thu'
    },
    {
      tenKhoanThu: 'Dịch vụ phòng tập',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
      tinhTrang: 'Đã thu'
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    // Add API call here
    console.log('Searching with:', { searchCriteria, searchValue });
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
          <button className="logout-btn" onClick={() => navigate('/')}>
            <span className="logout-icon">⎋</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </header>
      <main className="tracuu-main">
        <div className="crud-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
            <span>Quay lại</span>
          </button>
          <h2 className="crud-title">Quản lý khoản thu / Tra cứu khoản thu</h2>
        </div>
        
        <div className="tracuu-container">
          <div className="tracuu-filter">
            <div className="filter-group">
              <label>Tiêu chí tìm kiếm:</label>
              <select 
                value={searchCriteria} 
                onChange={(e) => setSearchCriteria(e.target.value)}
              >
                <option value="Số tiền">Số tiền</option>
                <option value="Tên khoản thu">Tên khoản thu</option>
                <option value="Loại">Loại</option>
                <option value="Ngày thu">Ngày thu</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Giá trị:</label>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Nhập giá trị tìm kiếm"
              />
            </div>
            <button className="tracuu-btn" onClick={handleSearch}>
              Tra cứu
            </button>
          </div>
          
          <div className="table-container">
            <table className="tracuu-table">
              <thead>
                <tr>
                  <th>Tên khoản thu</th>
                  <th>Loại</th>
                  <th>Ngày thu</th>
                  <th>Số tiền</th>
                  <th>Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((item, index) => (
                  <tr key={index}>
                    <td>{item.tenKhoanThu}</td>
                    <td>{item.loai}</td>
                    <td>{item.ngayThu}</td>
                    <td>{item.soTien}</td>
                    <td>{item.tinhTrang}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TraCuuKhoanThuPage; 