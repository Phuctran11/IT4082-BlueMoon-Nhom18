import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import FeeTypeManagement from '../pages/FeeTypeManagement'; // Xem xét lại vị trí file này
import ProtectedRoute from './ProtectedRoute';
import MainLayout from '../layouts/MainLayout';
import FeePeriodDetailPage from '../pages/FeePeriodDetailPage';

// --- THÊM DÒNG NÀY ---
import FeePeriodManagement from '../pages/FeePeriodManagement'; // Import component mới

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/fee-types" element={<FeeTypeManagement />} />
          {/* Dòng này bây giờ sẽ không còn lỗi */}
          <Route path="/fee-periods" element={<FeePeriodManagement />} />
          <Route path="/fee-periods/:id" element={<FeePeriodDetailPage />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Route>
      
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;