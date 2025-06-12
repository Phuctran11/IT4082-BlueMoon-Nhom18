import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ThongKeKhoanThuPage.css';

const ThongKeKhoanThuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const category = location.state?.category || 'Q1/2024';

  // Dummy data - replace with API call
  const statisticsData = [
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
      <main className="thongke-main">
        <div className="crud-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
            <span>Quay lại</span>
          </button>
          <h2 className="crud-title">Quản lý khoản thu / Thống kê khoản thu / {category}</h2>
        </div>
        
        <div className="thongke-container">
          <div className="thongke-filter">
            <label>Thời gian thống kê:</label>
            <select value={category} onChange={(e) => navigate(location.pathname, { state: { category: e.target.value } })}>
              <option value="Q1/2024">Q1/2024</option>
              <option value="Q2/2024">Q2/2024</option>
              <option value="Q3/2024">Q3/2024</option>
              <option value="Q4/2024">Q4/2024</option>
            </select>
          </div>
          
          <div className="table-container">
            <table className="thongke-table">
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
                {statisticsData.map((item, index) => (
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

export default ThongKeKhoanThuPage; 