// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';

// Guards
import ProtectedRoute from './ProtectedRoute';
import RoleBasedGuard from './RoleBasedGuard';

// Pages
import HouseholdManagementPage from '../pages/HouseholdManagementPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import FeeTypeManagement from '../pages/FeeTypeManagement'; // Di chuyển vào pages
import FeePeriodManagement from '../pages/FeePeriodManagement';
import FeePeriodDetailPage from '../pages/FeePeriodDetailPage';
import UnauthorizedPage from '../pages/UnauthorizedPage'; // Trang báo lỗi không có quyền

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
          {/* Routes chung cho tất cả user đã đăng nhập */}
          <Route path="dashboard" element={<DashboardPage />} />

          {/* Routes cho Tổ trưởng/Tổ phó */}
          <Route element={<RoleBasedGuard allowedRoles={['Tổ trưởng', 'Tổ phó']} />}>
            <Route path="households" element={<HouseholdManagementPage />} />
          </Route>

          {/* Routes chỉ dành cho Kế toán */}
          <Route element={<RoleBasedGuard allowedRoles={['Kế toán']} />}>
            <Route path="fee-types" element={<FeeTypeManagement />} />
            <Route path="fee-periods" element={<FeePeriodManagement />} />
            <Route path="fee-periods/:id" element={<FeePeriodDetailPage />} />
          </Route>

          {/* Routes cho Tổ trưởng/Tổ phó (ví dụ) */}
          {/* <Route element={<RoleBasedGuard allowedRoles={['Tổ trưởng', 'Tổ phó']} />}>
            <Route path="households" element={<HouseholdManagementPage />} />
          </Route> */}

          {/* Redirect mặc định */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      
      {/* Fallback Route */}
      <Route path="*" element={<div>404 - Trang không tồn tại</div>} />
    </Routes>
  );
};

export default AppRoutes;