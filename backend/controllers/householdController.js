const { Household, User } = require('../models');

// GET all households, include owner's name
exports.getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.findAll({
      order: [['apartmentCode', 'ASC']],
      include: {
        model: User,
        as: 'Owner', // Dùng alias đã định nghĩa trong model
        attributes: ['id', 'fullName'] // Chỉ lấy những thông tin cần thiết của chủ hộ
      }
    });
    res.status(200).json({ success: true, data: households });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// CREATE a new household
exports.createHousehold = async (req, res) => {
  try {
    const { apartmentCode, ownerId, area, status, address, apartmentType  } = req.body;
    if (!apartmentCode) {
      return res.status(400).json({ success: false, message: 'Mã căn hộ là bắt buộc.' });
    }
    const newHousehold = await Household.create({ apartmentCode, ownerId, area, status, address, apartmentType });
    res.status(201).json({ success: true, message: 'Tạo hộ khẩu thành công!', data: newHousehold });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// UPDATE a household
exports.updateHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu.' });
    }
    await household.update(req.body);
    res.status(200).json({ success: true, message: 'Cập nhật hộ khẩu thành công!', data: household });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

// DELETE a household
exports.deleteHousehold = async (req, res) => {
  try {
    const household = await Household.findByPk(req.params.id);
    if (!household) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hộ khẩu.' });
    }
    await household.destroy();
    res.status(200).json({ success: true, message: 'Xóa hộ khẩu thành công!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};