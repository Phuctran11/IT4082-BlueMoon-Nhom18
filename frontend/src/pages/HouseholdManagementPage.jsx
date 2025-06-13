import React, { useState, useEffect } from 'react';
import * as householdService from '../services/householdService';
import Spinner from '../components/common/Spinner';
import './HouseholdManagementPage.css'; // Sẽ tạo file CSS sau

const HouseholdManagementPage = () => {
  const [households, setHouseholds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHousehold, setCurrentHousehold] = useState(null);
  const [formData, setFormData] = useState({
    apartmentCode: '',
    ownerId: '',
    area: '',
    status: 'occupied',
    address: '',
    apartmentType: ''
  });

  useEffect(() => {
    fetchHouseholds();
  }, []);

  const fetchHouseholds = async () => {
    try {
      setLoading(true);
      const response = await householdService.getAllHouseholds();
      setHouseholds(response.data.data);
    } catch (err) {
      setError('Không thể tải dữ liệu hộ khẩu.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenModal = (household = null) => {
    if (household) {
      setCurrentHousehold(household);
      setFormData({
        apartmentCode: household.apartmentCode,
        ownerId: household.ownerId || '',
        area: household.area || '',
        status: household.status,
        address: household.address || '',
        apartmentType: household.apartmentType || ''
      });
    } else {
      setCurrentHousehold(null);
      setFormData({ apartmentCode: '', ownerId: '', area: '', status: 'occupied', address: '', apartmentType: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentHousehold) {
        await householdService.updateHousehold(currentHousehold.id, formData);
      } else {
        await householdService.createHousehold(formData);
      }
      handleCloseModal();
      fetchHouseholds();
    } catch (err) {
      alert('Thao tác thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) {
      try {
        await householdService.deleteHousehold(id);
        fetchHouseholds();
      } catch (err) {
        alert('Xóa thất bại: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý hộ khẩu</h1>
        <div className="action-bar">
          <button className="add-btn" onClick={() => handleOpenModal()}>Thêm Hộ khẩu</button>
        </div>
      </div>
      <div className="table-container">
        {/* SỬA Ở ĐÂY: Dùng class mới và cấu trúc bảng đúng */}
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã căn hộ</th>
              <th>Chủ hộ</th>
              <th>Địa chỉ</th>
              <th>Loại căn hộ</th>
              <th>Diện tích (m²)</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {households.length > 0 ? (
              households.map(h => (
                <tr key={h.id}>
                  <td>{h.apartmentCode}</td>
                  <td>{h.Owner?.fullName || '(Chưa có)'}</td>
                  <td>{h.address || '-'}</td>
                  <td>{h.apartmentType || '-'}</td>
                  <td>{h.area || '-'}</td>
                  <td>{h.status}</td>
                  <td className="action-cell">
                    <button className="edit-btn" onClick={() => handleOpenModal(h)}>Sửa</button>
                    <button className="delete-btn" onClick={() => handleDelete(h.id)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center' }}>Không có dữ liệu hộ khẩu.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{currentHousehold ? 'Chỉnh sửa Hộ khẩu' : 'Thêm Hộ khẩu mới'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Mã căn hộ</label>
                <input name="apartmentCode" value={formData.apartmentCode} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>ID Chủ hộ (Tùy chọn)</label>
                <input type="number" name="ownerId" value={formData.ownerId} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Địa chỉ</label>
                <input name="address" value={formData.address} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Loại căn hộ</label>
                <input name="apartmentType" value={formData.apartmentType} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Diện tích (m²)</label>
                <input type="number" step="0.01" name="area" value={formData.area} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="occupied">Đang ở</option>
                  <option value="vacant">Trống</option>
                </select>
              </div>
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
                <button type="submit" className="submit-btn">{currentHousehold ? 'Cập nhật' : 'Thêm mới'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HouseholdManagementPage;