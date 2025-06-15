import apiClient from './api';

export const getAllUsers = (params = {}) => {
  // Axios sẽ tự động chuyển object params thành query string, ví dụ: ?username=test&status=active
  return apiClient.get('/users', { params });
};

export const assignRole = (userId, roleId) => apiClient.post(`/users/${userId}/assign-role`, { roleId });

// Dùng PATCH vì chúng ta chỉ cập nhật một phần của resource (trạng thái)
export const updateUserStatus = (userId, status) => apiClient.patch(`/users/${userId}/status`, { status });

export const deleteUser = (userId) => apiClient.delete(`/users/${userId}`);