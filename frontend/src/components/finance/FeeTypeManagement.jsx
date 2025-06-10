import React, { useState, useEffect, useMemo } from 'react';
import * as feeService from '../../services/feeService';
import './FeeTypeManagement.css'; // Sử dụng file CSS mới

const FeeTypeManagement = () => {
  // State quản lý dữ liệu
  const [feeTypes, setFeeTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFeeType, setCurrentFeeType] = useState(null); // null: tạo mới, object: chỉnh sửa

  // State quản lý Form
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    price: '',
    description: '',
  });

  // 1. Tải dữ liệu ban đầu
  useEffect(() => {
    fetchFeeTypes();
  }, []);

  const fetchFeeTypes = async () => {
    try {
      const response = await feeService.getAllFeeTypes();
      setFeeTypes(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách loại phí:', error);
      alert('Không thể tải danh sách loại phí.');
    }
  };

  // 2. Lọc dữ liệu dựa trên ô tìm kiếm
  const filteredFeeTypes = useMemo(() => {
    if (!searchTerm) return feeTypes;
    return feeTypes.filter(fee =>
      fee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, feeTypes]);


  // 3. Xử lý các hành động với Modal
  const handleOpenModal = (feeType = null) => {
    if (feeType) { // Chế độ chỉnh sửa
      setCurrentFeeType(feeType);
      setFormData({
        name: feeType.name,
        unit: feeType.unit,
        price: feeType.price,
        description: feeType.description || '',
      });
    } else { // Chế độ tạo mới
      setCurrentFeeType(null);
      setFormData({ name: '', unit: '', price: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentFeeType(null);
  };

  // 4. Xử lý Form
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentFeeType) {
        await feeService.updateFeeType(currentFeeType.id, formData);
        alert('Cập nhật loại phí thành công!');
      } else {
        await feeService.createFeeType(formData);
        alert('Tạo mới loại phí thành công!');
      }
      handleCloseModal();
      fetchFeeTypes(); // Tải lại danh sách
    } catch (error) {
      alert('Lỗi: ' + (error.response?.data?.message || 'Thao tác thất bại.'));
    }
  };

  // 5. Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa loại phí này?')) {
      try {
        await feeService.deleteFeeType(id);
        alert('Xóa loại phí thành công!');
        fetchFeeTypes();
      } catch (error) {
        alert('Lỗi: ' + (error.response?.data?.message || 'Không thể xóa loại phí.'));
      }
    }
  };


  return (
    <div className="page-container">
      {/* Phần tiêu đề và thanh chức năng */}
      <div className="page-header">
        <h1>Quản lý phí</h1>
        <div className="action-bar">
          <button className="add-btn" onClick={() => handleOpenModal()}>Thêm</button>
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm theo tên phí..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Phần bảng hiển thị dữ liệu */}
      <div className="table-container">
        <table className="fee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên phí</th>
              <th>Đơn vị</th>
              <th>Đơn giá</th>
              <th>Chú thích</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredFeeTypes.map((fee) => (
              <tr key={fee.id}>
                <td>{fee.id}</td>
                <td>{fee.name}</td>
                <td>{fee.unit}</td>
                <td>{Number(fee.price).toLocaleString('vi-VN')}</td>
                <td>{fee.description}</td>
                <td className="action-cell">
                  <button className="edit-btn" onClick={() => handleOpenModal(fee)}>Sửa</button>
                  <button className="delete-btn" onClick={() => handleDelete(fee.id)}>Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal để Thêm/Sửa */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentFeeType ? 'Chỉnh sửa Loại phí' : 'Thêm Loại phí mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tên loại phí</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Đơn vị tính</label>
                <input name="unit" value={formData.unit} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Đơn giá</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Chú thích</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">{currentFeeType ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeTypeManagement;