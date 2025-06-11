import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage'; // Import trang mới
import RegisterPage from '../pages/RegisterPage'; // Import trang mới
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import ManageKhoanThuPage from '../pages/ManageKhoanThuPage';
import CRUDKhoanThuPage from '../pages/CRUDKhoanThuPage';
import CreateKhoanThuPage from '../pages/CreateKhoanThuPage';
import ThongKePrePage from '../pages/ThongKePrePage';
import ThongKeKhoanThuPage from '../pages/ThongKeKhoanThuPage';
import TraCuuPrePage from '../pages/TraCuuPrePage';
import TraCuuKhoanThuPage from '../pages/TraCuuKhoanThuPage';

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
        <Route path="/manage-khoan-thu" element={<ManageKhoanThuPage />} />
        <Route path="/crud-khoan-thu" element={<CRUDKhoanThuPage />} />
        <Route path="/create-khoan-thu" element={<CreateKhoanThuPage />} />
        <Route path="/thong-ke-pre" element={<ThongKePrePage />} />
        <Route path="/thong-ke-khoan-thu" element={<ThongKeKhoanThuPage />} />
        <Route path="/tra-cuu-pre" element={<TraCuuPrePage />} />
        <Route path="/tra-cuu-khoan-thu" element={<TraCuuKhoanThuPage />} />
        {/* Thêm các routes cần bảo vệ khác ở đây */}
      </Route>

      {/* Route cho trang không tồn tại */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;