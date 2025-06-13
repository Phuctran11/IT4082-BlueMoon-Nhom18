import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RoleBasedGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();

  // Kiểm tra xem vai trò của user có trong danh sách được phép không
  const hasPermission = user?.roles?.some(role => allowedRoles.includes(role));

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!hasPermission) return <Navigate to="/unauthorized" replace />; // Chuyển đến trang không có quyền

  return <Outlet />;
};

export default RoleBasedGuard;