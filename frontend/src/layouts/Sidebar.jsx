import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // --- SỬA ĐỔI LOGIC KIỂM TRA QUYỀN HẠN TẠI ĐÂY ---

  // Biến isAdmin để tiện tái sử dụng
  const isAdmin = user?.roles?.includes('Admin');

  // Người dùng có thể quản lý tài chính nếu họ là 'Kế toán' HOẶC là 'Admin'
  const canManageFinance = user?.roles?.includes('Kế toán') || isAdmin;

  // Người dùng có thể quản lý cộng đồng nếu họ là 'Tổ trưởng', 'Tổ phó' HOẶC là 'Admin'
  const canManageCommunity = user?.roles?.includes('Tổ trưởng') || user?.roles?.includes('Tổ phó') || isAdmin;


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">BlueMoon</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/dashboard">
              <span>Thống kê</span>
            </NavLink>
          </li>
          
          {/* SỬ DỤNG BIẾN KIỂM TRA MỚI */}
          {canManageFinance && (
            <>
              <li><NavLink to="/fee-types"><span>Quản lý Loại phí</span></NavLink></li>
              <li><NavLink to="/fee-periods"><span>Quản lý Đợt thu</span></NavLink></li>
            </>
          )}
          
          {canManageCommunity && (
            <>
              <li>
                <NavLink to="/households">
                  {/* Đổi tên cho nhất quán với các menu khác */}
                  <span>Quản lý Hộ khẩu</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/users">
                  <span>Quản lý Tài khoản</span>
                </NavLink>
              </li>
            </> 
          )}
        </ul>
      </nav>
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;