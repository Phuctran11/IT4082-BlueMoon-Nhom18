import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CRUDKhoanThuPage.css';

const CRUDKhoanThuPage = () => {
  const navigate = useNavigate();
  // Dummy data - replace with actual API call
  const [khoanThuList, setKhoanThuList] = useState([
    {
      id: 1,
      tenKhoanThu: 'Dịch vụ trông xe',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
    },
    {
      id: 2,
      tenKhoanThu: 'Phí môi trường',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
    },
    {
      id: 3,
      tenKhoanThu: 'Dịch vụ bảo vệ',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
    },
    {
      id: 4,
      tenKhoanThu: 'Dịch vụ bể bơi',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
    },
    {
      id: 5,
      tenKhoanThu: 'Dịch vụ phòng tập',
      loai: 'Bắt buộc',
      ngayThu: '12/4/25',
      soTien: '200,000đ',
    },
  ]);

  const handleView = (id) => {
    // Handle view action
    console.log('View item:', id);
  };

  const handleEdit = (id) => {
    // Handle edit action
    console.log('Edit item:', id);
  };

  const handleDelete = (id) => {
    // Handle delete action
    console.log('Delete item:', id);
  };

  const handleCreateNew = () => {
    navigate('/create-khoan-thu');
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
      <main className="crud-main">
        <div className="crud-header">
          <button className="back-btn" onClick={() => navigate(-1)}>&lt; Quay lại</button>
          <h2 className="crud-title">Quản lý khoản thu / CRUD khoản thu</h2>
        </div>
        <div className="table-container">
          <table className="crud-table">
            <thead>
              <tr>
                <th>Tên khoản thu</th>
                <th>Loại</th>
                <th>Ngày thu</th>
                <th>Số tiền</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {khoanThuList.map((item) => (
                <tr key={item.id}>
                  <td>{item.tenKhoanThu}</td>
                  <td>{item.loai}</td>
                  <td>{item.ngayThu}</td>
                  <td>{item.soTien}</td>
                  <td>
                    <div className="action-buttons">
                      <button onClick={() => handleView(item.id)} className="icon-button view-btn" title="Xem">
                        👁️
                      </button>
                      <button onClick={() => handleEdit(item.id)} className="icon-button edit-btn" title="Sửa">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="icon-button delete-btn" title="Xóa">
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="crud-footer">
          <button className="create-btn" onClick={handleCreateNew}>
            Tạo khoản thu
          </button>
        </div>
      </main>
    </div>
  );
};

export default CRUDKhoanThuPage; 