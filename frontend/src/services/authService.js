import axios from 'axios';

// Tạo một instance của axios với cấu hình chung cho backend
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Đảm bảo URL này đúng
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Hàm gọi API đăng nhập
 * @param {object} credentials - Chứa username và password
 * @returns {Promise} - Promise của axios request
 */
export const login = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

/**
 * Hàm gọi API đăng ký
 * @param {object} userData - Chứa username, password, fullName
 * @returns {Promise}
 */
export const register = (userData) => {
  return apiClient.post('/auth/register', userData);
};