import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css'; // File CSS chúng ta sẽ tạo ở bước tiếp theo

// Import icons nếu bạn muốn (ví dụ dùng react-icons)
// import { FaTachometerAlt, FaFileInvoiceDollar, FaUsers } from 'react-icons/fa';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Sau khi logout, điều hướng người dùng về trang đăng nhập
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">BlueMoon</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          {/* 
            Sử dụng NavLink thay vì thẻ <a> để có class 'active' tự động
            giúp chúng ta biết người dùng đang ở trang nào.
          */}
          <li>
            <NavLink to="/dashboard">
              {/* <FaTachometerAlt />  */}
              <span>Thống kê</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/fee-types">
              {/* <FaFileInvoiceDollar /> */}
              <span>Quản lý phí</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/households">
              {/* <FaUsers /> */}
              <span>Quản lý dân cư</span>
            </NavLink>
          </li>
          {/* Thêm các link khác ở đây */}
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