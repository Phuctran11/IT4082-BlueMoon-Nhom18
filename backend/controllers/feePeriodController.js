const { FeePeriod } = require('../models');

exports.getAllFeePeriods = async (req, res) => {
  try {
    const periods = await FeePeriod.findAll({ order: [['startDate', 'DESC']] });
    res.status(200).json({ success: true, data: periods });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.getFeePeriodById = async (req, res) => {
  try {
    const period = await FeePeriod.findByPk(req.params.id);
    if (!period) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đợt thu phí.' });
    }
    res.status(200).json({ success: true, data: period });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

exports.createFeePeriod = async (req, res) => {
  try {
    const { name, startDate, endDate } = req.body;
    const newPeriod = await FeePeriod.create({ name, startDate, endDate });
    res.status(201).json({ success: true, data: newPeriod });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};