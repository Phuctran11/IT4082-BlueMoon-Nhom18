const { Op } = require('sequelize');
const { Resident, Household } = require('../models');
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

    // Kiểm tra idCardNumber trùng nếu có
    if (data.idCardNumber) {
      const exists = await Resident.findOne({ where: { idCardNumber: data.idCardNumber } });
      if (exists) {
        return apiResponse.error(res, 'Số CCCD đã tồn tại trong hệ thống', 400);
      }
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

    if (data.idCardNumber && data.idCardNumber !== resident.idCardNumber) {
      const exists = await Resident.findOne({ where: { idCardNumber: data.idCardNumber } });
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


/**
 * Truy vấn nhân khẩu theo tiêu chí: fullName, householdCode, idCardNumber, relation
 */
exports.queryResidents = async (req, res) => {
  try {
    const { fullName, householdCode, idCardNumber, relation } = req.query;

    if (!fullName && !householdCode && !idCardNumber && !relation) {
      return apiResponse.error(res, 'Vui lòng nhập ít nhất một tiêu chí tìm kiếm.');
    }

    const residentWhere = {};

    if (fullName) {
      residentWhere.fullName = { [Op.iLike]: `%${fullName}%` };
    }

    if (idCardNumber) {
      if (!/^\d{12}$/.test(idCardNumber)) {
        return apiResponse.error(res, 'Số CCCD phải gồm 12 chữ số.');
      }
      residentWhere.idCardNumber = idCardNumber;
    }

    if (relation) {
      residentWhere.relationship = relation;
    }

    let householdIds = null;
    if (householdCode) {
      const households = await Household.findAll({
        where: { apartmentCode: householdCode },
        attributes: ['id'],
        raw: true,
      });
      if (!households.length) {
        return apiResponse.success(res, [], 'Không có kết quả phù hợp.');
      }
      householdIds = households.map(h => h.id);
      residentWhere.householdId = { [Op.in]: householdIds };
    }

    const residents = await Resident.findAll({
      where: residentWhere,
      include: [{
        model: Household,
        attributes: ['apartmentCode'],
      }],
      order: [['fullName', 'ASC']],
    });

    if (!residents.length) {
      return apiResponse.success(res, [], 'Không có kết quả phù hợp.');
    }

    return apiResponse.success(res, residents);
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi truy vấn nhân khẩu: ' + error.message);
  }
};

// Tra cuu nhân khẩu theo ID
exports.getResidentById = async (req, res) => {
  try {
    const id = req.params.id;
    const resident = await Resident.findByPk(id);
    if (!resident) {
      return apiResponse.error(res, 'Không tìm thấy nhân khẩu', 404);
    }
  return apiResponse.success(res, resident);

  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi khi lấy thông tin nhân khẩu: ' + error.message });
  }
};

// Lấy tất cả nhân khẩu
exports.getAllResidents = async (req, res) => {
  try {
    const residents = await Resident.findAll({
      include: [{
        model: Household,
        attributes: ['apartmentCode'],
      }],
      order: [['fullName', 'ASC']],
    });
    return apiResponse.success(res, residents);
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi lấy danh sách nhân khẩu: ' + error.message);
  }
};