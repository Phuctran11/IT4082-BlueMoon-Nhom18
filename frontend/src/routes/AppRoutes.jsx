import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedGuard from './RoleBasedGuard';

// Pages
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import UserManagementPage from '../pages/UserManagementPage';
import HouseholdManagementPage from '../pages/HouseholdManagementPage';
import FeeTypeManagement from '../pages/FeeTypeManagement';
import FeePeriodManagement from '../pages/FeePeriodManagement';
import FeePeriodDetailPage from '../pages/FeePeriodDetailPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          
          <Route path="dashboard" element={<DashboardPage />} />

          {/* SỬ DỤNG CẤU TRÚC LỒNG NHAU Ở ĐÂY */}

          {/* Nhóm route cho Quản lý Cộng đồng */}
          <Route element={<RoleBasedGuard allowedRoles={['Tổ trưởng', 'Tổ phó']} />}>
            <Route path="households" element={<HouseholdManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
          </Route>

          {/* Nhóm route cho Quản lý Tài chính */}
          <Route element={<RoleBasedGuard allowedRoles={['Kế toán']} />}>
            <Route path="fee-types" element={<FeeTypeManagement />} />
            <Route path="fee-periods" element={<FeePeriodManagement />} />
            <Route path="fee-periods/:id" element={<FeePeriodDetailPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      
      <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;