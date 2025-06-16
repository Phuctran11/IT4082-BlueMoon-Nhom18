import React, { useState, useEffect, useCallback, useMemo } from 'react';
import * as userService from '../services/userService';
import * as roleService from '../services/roleService';
import * as householdService from '../services/householdService';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import './UserManagementPage.css';

const UserManagementPage = () => {
  // =================================================================
  // STATE MANAGEMENT
  // =================================================================
  const { user: currentUser, updateAuthUser } = useAuth();

  // State cho dữ liệu
  const [users, setUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State cho các bộ lọc
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // State cho Modal Phân quyền
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleToAssign, setRoleToAssign] = useState('');


  const [allHouseholds, setAllHouseholds] = useState([]);
  const [isHouseholdModalOpen, setIsHouseholdModalOpen] = useState(false);
  const [householdToAssign, setHouseholdToAssign] = useState('');

  // =================================================================
  // DATA FETCHING & LOGIC
  // =================================================================

  // Hàm tải danh sách người dùng
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userService.getAllUsers();
      setUsers(response.data.data.filter(user => user.status !== 'deleted'));
    } catch (err) {
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect để tải dữ liệu ban đầu
  useEffect(() => {
    fetchUsers();
    const fetchRoles = async () => {
      try {
        const response = await roleService.getAllRoles();
        setAllRoles(response.data.data);
      } catch (err) {
        console.error("Lỗi tải vai trò:", err);
      }
    };
    fetchRoles();
  }, [fetchUsers]);

  useEffect(() => {
    const fetchHouseholds = async () => {
      try {
        const res = await householdService.getAllHouseholds();
        setAllHouseholds(res.data.data);
      } catch (err) { console.error("Lỗi tải hộ khẩu", err); }
    };
    fetchHouseholds();
  }, [fetchUsers]);

  // Logic lọc dữ liệu ở phía Frontend
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearchTerm = !term ||
        user.username.toLowerCase().includes(term) ||
        user.fullName.toLowerCase().includes(term) ||
        String(user.id).includes(term);
      const matchesRole = !selectedRoleFilter || user.Roles.some(role => role.name === selectedRoleFilter);
      const matchesStatus = !selectedStatus || user.status === selectedStatus;
      return matchesSearchTerm && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRoleFilter, selectedStatus, users]);

  // Logic lọc ra các vai trò có thể gán
  const assignableRoles = useMemo(() => {
    if (!currentUser || !allRoles) return [];
    if (currentUser.roles.includes('Admin')) return allRoles;
    if (currentUser.roles.includes('Tổ trưởng') || currentUser.roles.includes('Tổ phó')) {
      const managerAssignable = ['Tổ trưởng', 'Tổ phó', 'Cư dân'];
      return allRoles.filter(role => managerAssignable.includes(role.name));
    }
    return [];
  }, [allRoles, currentUser]);


  // =================================================================
  // EVENT HANDLERS
  // =================================================================

  const handleToggleLock = async (user) => {
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    const actionText = newStatus === 'locked' ? 'khóa' : 'mở khóa';
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản "${user.username}"?`)) {
      try {
        await userService.updateUserStatus(user.id, newStatus);
        alert(`Đã ${actionText} tài khoản thành công!`);
        fetchUsers();
      } catch (error) {
        alert('Thao tác thất bại: ' + (error.response?.data?.message || 'Lỗi server'));
      }
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Bạn có chắc chắn muốn XÓA tài khoản "${username}"? Thao tác này không thể hoàn tác.`)) {
      try {
        await userService.deleteUser(userId);
        alert('Xóa tài khoản thành công!');
        fetchUsers();
      } catch (error) {
        alert('Xóa thất bại: ' + (error.response?.data?.message || 'Lỗi server'));
      }
    }
  };

  const handleOpenAssignRoleModal = (user) => {
    setSelectedUser(user);
    setRoleToAssign('');
    setIsModalOpen(true);
  };


  const handleCloseModal = () => setIsModalOpen(false);

  const handleAssignRole = async () => {
    if (!roleToAssign) {
      alert('Vui lòng chọn một vai trò để gán.');
      return;
    }
    try {
      const response = await userService.assignRole(selectedUser.id, roleToAssign);
      const updatedUser = response.data.data;
      alert('Gán vai trò thành công!');
      handleCloseModal();
      if (currentUser && currentUser.id === updatedUser.id) {
        updateAuthUser(updatedUser);
      }
      fetchUsers();
    } catch (err) {
      alert('Gán vai trò thất bại: ' + (err.response?.data?.message || 'Lỗi server'));
    }
  };

  const handleOpenHouseholdModal = (user) => {
    setSelectedUser(user);
    // Lấy householdId hiện tại của user để hiển thị trên dropdown
    setHouseholdToAssign(user.householdId || '');
    setIsHouseholdModalOpen(true);
  };
  const handleCloseHouseholdModal = () => setIsHouseholdModalOpen(false);

  const handleAssignHousehold = async () => {
    try {
      // Gửi cả giá trị rỗng (để gỡ)
      await userService.assignHousehold(selectedUser.id, householdToAssign || null);
      alert('Cập nhật hộ khẩu thành công!');
      handleCloseHouseholdModal();
      fetchUsers();
    } catch (err) {
      alert('Thao tác thất bại: ' + (err.response?.data?.message || 'Lỗi server'));
    }
  };
  // =================================================================
  // RENDER
  // =================================================================

  if (loading) return <Spinner />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Quản lý Tài khoản Người dùng</h1>
      </div>

      {/* KHU VỰC LỌC */}
      <div className="filter-controls-container card">
        <input
          type="text"
          className="search-input"
          placeholder="Tìm theo ID, Tên, Username..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={selectedRoleFilter} onChange={(e) => setSelectedRoleFilter(e.target.value)}>
          <option value="">Tất cả vai trò</option>
          {allRoles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      {/* BẢNG DỮ LIỆU */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ và tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.fullName}</td>
                  <td>{user.Roles.map(r => r.name).join(', ')}</td>
                  <td>
                    {/* SỬA LỖI CÚ PHÁP Ở ĐÂY */}
                    <span className={`status-badge status-${user.status}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="action-cell">
                    <button
                      className={user.status === 'active' ? 'lock-btn' : 'unlock-btn'}
                      onClick={() => handleToggleLock(user)}
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                    <button className="assign-household-btn" onClick={() => handleOpenHouseholdModal(user)}>Gán Hộ</button>
                    <button
                      className="assign-btn"
                      onClick={() => handleOpenAssignRoleModal(user)}
                      disabled={assignableRoles.length === 0}
                    >
                      Phân quyền
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(user.id, user.username)}>Xóa</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center' }}>
                  Không có người dùng nào phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL GÁN HỘ KHẨU */}
      {isHouseholdModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Gán Hộ khẩu cho: {selectedUser.fullName}</h2>
              <button className="close-btn" onClick={handleCloseHouseholdModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="household-select">Chọn Hộ khẩu</label>
                <select id="household-select" value={householdToAssign} onChange={(e) => setHouseholdToAssign(e.target.value)}>
                  <option value="">-- Gỡ khỏi Hộ khẩu --</option>
                  {allHouseholds.map(h => (
                    <option key={h.id} value={h.id}>{h.apartmentCode} - {h.ownerName}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={handleCloseHouseholdModal}>Hủy</button>
              <button type="button" className="submit-btn" onClick={handleAssignHousehold}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PHÂN QUYỀN */}
      {isModalOpen && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Phân quyền cho: {selectedUser.fullName}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <p>
                <strong>Vai trò hiện tại:</strong> {selectedUser.Roles.map(r => r.name).join(', ') || 'Chưa có'}
              </p>
              <div className="form-group">
                <label htmlFor="role-select">Chọn vai trò để gán thêm:</label>
                <select id="role-select" value={roleToAssign} onChange={(e) => setRoleToAssign(e.target.value)}>
                  <option value="" disabled>-- Chọn vai trò --</option>
                  {assignableRoles.map(role => (
                    <option key={role.id} value={role.id}>{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-btn" onClick={handleCloseModal}>Hủy</button>
              <button type="button" className="submit-btn" onClick={handleAssignRole}>Xác nhận Gán</button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
};

export default UserManagementPage;