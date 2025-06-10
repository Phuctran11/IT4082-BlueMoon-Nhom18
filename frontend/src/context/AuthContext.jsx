import React, { createContext, useState, useContext, useEffect } from 'react';
import * as authService from '../services/authService'; // Import service

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Trạng thái loading để kiểm tra token lúc đầu

  useEffect(() => {
    // Khi app khởi động, kiểm tra xem có token trong localStorage không
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setIsAuthenticated(true);
    }
    setLoading(false); // Kết thúc kiểm tra
  }, []);

  const login = async (username, password) => {
    try {
      const response = await authService.login({ username, password });
      const { token, user } = response.data;

      // Lưu vào state và localStorage
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return response;
    } catch (error) {
      // Ném lỗi ra để component có thể bắt và hiển thị
      throw error;
    }
  };

  const logout = () => {
    // Xóa khỏi state và localStorage
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // 3. Cung cấp state và các hàm cho các component con
  const value = {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 4. Tạo một custom hook để dễ dàng sử dụng context
export const useAuth = () => {
  return useContext(AuthContext);
};