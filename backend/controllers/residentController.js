const Resident = require('../models/Resident');
const apiResponse = require('../utils/apiResponse');

// Lấy danh sách nhân khẩu theo hộ khẩu
exports.getResidentsByHousehold = async (req, res) => {
  try {
    const householdId = req.params.householdId;
    const residents = await Resident.findAll({ where: { householdId } });
    return apiResponse.success(res, residents);
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi lấy danh sách nhân khẩu: ' + error.message);
  }
};

// Tạo nhân khẩu mới
exports.createResident = async (req, res) => {
  try {
    const data = req.body;

    // Kiểm tra cccd trùng
    const exists = await Resident.findOne({ where: { cccd: data.cccd } });
    if (exists) {
      return apiResponse.error(res, 'Số CCCD đã tồn tại trong hệ thống', 400);
    }

    const resident = await Resident.create(data);
    return apiResponse.success(res, resident, 'Thêm nhân khẩu thành công');
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi tạo nhân khẩu: ' + error.message);
  }
};

// Cập nhật nhân khẩu
exports.updateResident = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const resident = await Resident.findByPk(id);
    if (!resident) {
      return apiResponse.error(res, 'Không tìm thấy nhân khẩu', 404);
    }

    // Nếu cập nhật CCCD, kiểm tra trùng
    if (data.cccd && data.cccd !== resident.cccd) {
      const exists = await Resident.findOne({ where: { cccd: data.cccd } });
      if (exists) {
        return apiResponse.error(res, 'Số CCCD đã tồn tại trong hệ thống', 400);
      }
    }

    await resident.update(data);
    return apiResponse.success(res, resident, 'Cập nhật nhân khẩu thành công');
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi cập nhật nhân khẩu: ' + error.message);
  }
};

// Xóa nhân khẩu
exports.deleteResident = async (req, res) => {
  try {
    const id = req.params.id;

    const resident = await Resident.findByPk(id);
    if (!resident) {
      return apiResponse.error(res, 'Không tìm thấy nhân khẩu', 404);
    }

    await resident.destroy();
    return apiResponse.success(res, null, 'Xóa nhân khẩu thành công');
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi xóa nhân khẩu: ' + error.message);
  }
};
