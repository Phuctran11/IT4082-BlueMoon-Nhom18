// src/services/feeService.js

import axios from 'axios';

// Tạo một instance của axios với cấu hình chung
const apiClient = axios.create({
  // Sử dụng biến môi trường đã cấu hình
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Tự động đính kèm token vào mỗi request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- CÁC HÀM CRUD CHO LOẠI PHÍ ---

export const getAllFeeTypes = () => apiClient.get('/fee-types');

export const createFeeType = (feeTypeData) => apiClient.post('/fee-types', feeTypeData);

export const updateFeeType = (id, feeTypeData) => apiClient.put(`/fee-types/${id}`, feeTypeData);

export const deleteFeeType = (id) => apiClient.delete(`/fee-types/${id}`);