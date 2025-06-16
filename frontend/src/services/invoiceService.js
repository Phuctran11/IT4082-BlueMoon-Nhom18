// frontend/src/services/invoiceService.js
import apiClient from './api';

export const generateInvoicesForPeriod = (feePeriodId) => {
  // Gọi đến API route mới
  return apiClient.post(`/invoices/generate-from-period/${feePeriodId}`);
};