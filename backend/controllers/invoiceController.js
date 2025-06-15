// backend/controllers/invoiceController.js
const invoiceService = require('../services/invoiceService');

exports.generateInvoices = async (req, res) => {
  try {
    const { feePeriodId } = req.params;
    const result = await invoiceService.generateInvoicesForPeriod(feePeriodId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Lỗi server khi tạo hóa đơn.' });
  }
};