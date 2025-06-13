import apiClient from './api';

export const getAllHouseholds = () => apiClient.get('/households');
export const createHousehold = (data) => apiClient.post('/households', data);
export const updateHousehold = (id, data) => apiClient.put(`/households/${id}`, data);
export const deleteHousehold = (id) => apiClient.delete(`/households/${id}`);