import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateKhoanThuPage.css';

const CreateKhoanThuPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    loaiKhoanThu: 'Bắt buộc',
    maKhoanThu: 'PE025502',
    tenKhoanThu: '',
    soTien: '',
    ngayThuTu: '23/4/25',
    ngayThuDen: '23/5/25',
    doiTuongApDung: []
  });

  // Dummy data for preview table
  const previewData = [
    { hoGiaDinh: 'Hộ A', soTien: '50,000đ' },
    { hoGiaDinh: 'Hộ B', soTien: '55,000đ' },
    { hoGiaDinh: 'Hộ C', soTien: '50,000đ' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/crud-khoan-thu');
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
      <main className="create-form-main">
        <div className="crud-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <span className="back-icon">←</span>
            <span>Quay lại</span>
          </button>
          <h2 className="crud-title">Quản lý khoản thu / CRUD khoản thu / Tạo khoản thu</h2>
        </div>
        
        <form className="create-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Loại khoản thu</label>
              <select 
                name="loaiKhoanThu"
                value={formData.loaiKhoanThu}
                onChange={handleInputChange}
              >
                <option value="Bắt buộc">Bắt buộc</option>
                <option value="Không bắt buộc">Không bắt buộc</option>
              </select>
            </div>
            <div className="form-group">
              <label>Mã khoản thu</label>
              <input 
                type="text" 
                value={formData.maKhoanThu}
                disabled 
                className="disabled-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Tên khoản thu</label>
              <input
                type="text"
                name="tenKhoanThu"
                value={formData.tenKhoanThu}
                onChange={handleInputChange}
                placeholder="Nhập tên khoản thu"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Ngày thu</label>
              <div className="date-range">
                <span>Từ</span>
                <input
                  type="text"
                  name="ngayThuTu"
                  value={formData.ngayThuTu}
                  onChange={handleInputChange}
                />
                <span>Đến</span>
                <input
                  type="text"
                  name="ngayThuDen"
                  value={formData.ngayThuDen}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Số tiền</label>
              <div className="amount-input">
                <input
                  type="text"
                  name="soTien"
                  value={formData.soTien}
                  onChange={handleInputChange}
                  placeholder="Nhập số tiền"
                />
                <div className="amount-actions">
                  <button type="button" className="amount-action-btn">VNĐ</button>
                  <button type="button" className="amount-action-btn">Cố định</button>
                </div>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group full-width">
              <label>Đối tượng áp dụng</label>
              <button type="button" className="select-target-btn">
                <span className="lightning-icon">⚡</span>
                <span>Truy vấn hộ khẩu</span>
              </button>
            </div>
          </div>

          <div className="preview-section">
            <h3>Xem trước</h3>
            <div className="table-container">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th>Hộ gia đình</th>
                    <th>Số tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((item, index) => (
                    <tr key={index}>
                      <td>{item.hoGiaDinh}</td>
                      <td>{item.soTien}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Hoàn thành tạo khoản thu
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default CreateKhoanThuPage; 