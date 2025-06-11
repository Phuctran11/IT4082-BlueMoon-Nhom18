const { Household, Resident } = require('../models');

// GET all households
exports.getAllHouseholds = async (req, res) => {
  // Viết logic ở đây
  res.status(200).json({ message: 'Chức năng lấy tất cả hộ khẩu' });
};

// CREATE a new household
exports.createHousehold = async (req, res) => {
  // Viết logic ở đây
  res.status(201).json({ message: 'Chức năng tạo hộ khẩu mới' });
};

// Thêm các hàm khác: getHouseholdById, updateHousehold, deleteHousehold...