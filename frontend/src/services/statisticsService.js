import apiClient from './api';

/**
 * Lấy dữ liệu thống kê hộ khẩu với các bộ lọc
 * @param {object} filters - Object chứa các tiêu chí lọc, ví dụ: { area: 'Block A' }
 * @returns {Promise}
 */
export const getHouseholdStats = (filters = {}) => {
  // Loại bỏ các filter rỗng trước khi gửi đi để URL được sạch sẽ
  const activeFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, value]) => value !== '')
  );
  return apiClient.get('/statistics/households', { params: activeFilters });
};