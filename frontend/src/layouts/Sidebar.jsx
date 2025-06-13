import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css'; // Chúng ta sẽ tạo file CSS này ngay sau đây

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isAccountant = user?.roles?.includes('Kế toán');
  const isManager = user?.roles?.includes('Tổ trưởng') || user?.roles?.includes('Tổ phó');

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
          
          {isAccountant && (
            <>
              <li><NavLink to="/fee-types"><span>Quản lý Loại phí</span></NavLink></li>
              <li><NavLink to="/fee-periods"><span>Quản lý Đợt thu</span></NavLink></li>
            </>
          )}
          
          {isManager && (
            <li>
              <NavLink to="/households">
                <span>Quản lý dân cư</span>
              </NavLink>
            </li>
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

// DÒNG QUAN TRỌNG NHẤT LÀ ĐÂY:
export default Sidebar;