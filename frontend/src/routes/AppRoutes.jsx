import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage'; // Import trang mới
import RegisterPage from '../pages/RegisterPage'; // Import trang mới
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => <div>Chào mừng đến Dashboard!</div>;
const NotFoundPage = () => <div>404 - Trang không tồn tại</div>;

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Nếu đã đăng nhập, vào /login sẽ bị điều hướng đến /dashboard */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <RegisterPage />} 
      />

      {/* Trang chủ: nếu chưa đăng nhập thì vào /login, nếu rồi thì vào /dashboard */}
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
      />

      {/* Các routes được bảo vệ */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Thêm các routes cần bảo vệ khác ở đây */}
      </Route>

      {/* Route cho trang không tồn tại */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;