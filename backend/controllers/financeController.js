// THAY ĐỔI Ở ĐÂY: Import model và service
const { FeeType } = require('../models');
const invoiceService = require('../services/invoiceService');

// CREATE a new FeeType
exports.createFeeType = async (req, res) => {
  try {
    const { name, unit, price, description } = req.body;
    if (!name || !unit || !price) {
      return res.status(400).json({ success: false, message: 'Tên, đơn vị và đơn giá là bắt buộc.' });
    }
    const newFeeType = await FeeType.create({ name, unit, price, description });
    res.status(201).json({ success: true, message: 'Tạo loại phí thành công!', data: newFeeType });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// GET all FeeTypes
exports.getAllFeeTypes = async (req, res) => {
  try {
    const feeTypes = await FeeType.findAll({ order: [['name', 'ASC']] });
    res.status(200).json({ success: true, data: feeTypes });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// GET a single FeeType by ID
exports.getFeeTypeById = async (req, res) => {
  try {
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
    }
    res.status(200).json({ success: true, data: feeType });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// UPDATE a FeeType
exports.updateFeeType = async (req, res) => {
  try {
    const { name, unit, price, description } = req.body;
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
    }
    await feeType.update({ name, unit, price, description });
    res.status(200).json({ success: true, message: 'Cập nhật loại phí thành công!', data: feeType });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// DELETE a FeeType
exports.deleteFeeType = async (req, res) => {
  try {
    const feeType = await FeeType.findByPk(req.params.id);
    if (!feeType) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy loại phí.' });
    }
    await feeType.destroy();
    res.status(200).json({ success: true, message: 'Xóa loại phí thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// GENERATE INVOICES for a FeePeriod
exports.generateInvoices = async (req, res) => {
  try {
    const { feePeriodId } = req.params;
    const { feeTypeId } = req.body;

    if (!feeTypeId) {
      return res.status(400).json({ success: false, message: 'Vui lòng chọn một loại phí để áp dụng.' });
    }

    const result = await invoiceService.generateInvoicesForPeriod(feePeriodId, feeTypeId);

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};