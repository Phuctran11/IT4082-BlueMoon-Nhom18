const { Op } = require('sequelize');
const Resident = require('../models/Resident');
const Household = require('../models/Household');
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



// Hàm tính tuổi
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Hàm nhóm tuổi
function getAgeGroup(age) {
  if (age < 18) return '<18';
  if (age <= 35) return '18-35';
  if (age <= 60) return '36-60';
  return '>60';
}

// Hàm thống kê nhân khẩu (thêm mới)
exports.statisticsResidents = async (req, res) => {
  try {
    const { block, floor, gender, ageGroup } = req.query;

    // Điều kiện lọc hộ khẩu
    const householdWhere = {};
    if (block) householdWhere.block = block;
    if (floor) householdWhere.floor = floor;

    const households = await Household.findAll({
      where: householdWhere,
      attributes: ['id'],
      raw: true,
    });

    if (households.length === 0) {
      return apiResponse.success(res, [], 'Không có kết quả phù hợp');
    }

    const householdIds = households.map(h => h.id);

    // Lấy nhân khẩu theo hộ khẩu
    let residents = await Resident.findAll({
      where: {
        householdId: { [Op.in]: householdIds },
      },
      attributes: ['birthDate', 'gender'],
      raw: true,
    });

    if (residents.length === 0) {
      return apiResponse.success(res, [], 'Không có kết quả phù hợp');
    }

    // Lọc theo giới tính nếu có
    if (gender) {
      residents = residents.filter(r => r.gender === gender);
    }

    // Tính tuổi và nhóm tuổi
    residents = residents.map(r => {
      const age = calculateAge(r.birthDate);
      return {
        ...r,
        age,
        ageGroup: getAgeGroup(age),
      };
    });

    // Lọc theo nhóm tuổi nếu có
    if (ageGroup) {
      residents = residents.filter(r => r.ageGroup === ageGroup);
    }

    if (residents.length === 0) {
      return apiResponse.success(res, [], 'Không có kết quả phù hợp');
    }

    // Thống kê tổng số nhân khẩu
    const totalResidents = residents.length;

    // Thống kê theo nhóm tuổi
    const countByAgeGroup = residents.reduce((acc, r) => {
      acc[r.ageGroup] = (acc[r.ageGroup] || 0) + 1;
      return acc;
    }, {});

    // Thống kê theo giới tính
    const countByGender = residents.reduce((acc, r) => {
      acc[r.gender] = (acc[r.gender] || 0) + 1;
      return acc;
    }, {});

    const result = {
      totalResidents,
      countByAgeGroup,
      countByGender,
      criteria: { block, floor, gender, ageGroup },
    };

    return apiResponse.success(res, result);

  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi thống kê nhân khẩu: ' + error.message);
  }
};


/**
 * Truy vấn thông tin nhân khẩu theo tiêu chí:
 * - fullName (họ tên, có thể tìm kiếm gần đúng)
 * - householdCode (mã hộ khẩu)
 * - cccd (số căn cước công dân)
 * - relation (quan hệ với chủ hộ)
 */
exports.queryResidents = async (req, res) => {
  try {
    const { fullName, householdCode, cccd, relation } = req.query;

    // Kiểm tra ít nhất một tiêu chí được nhập
    if (!fullName && !householdCode && !cccd && !relation) {
      return apiResponse.error(res, 'Vui lòng nhập ít nhất một tiêu chí tìm kiếm.');
    }

    // Điều kiện truy vấn nhân khẩu
    const residentWhere = {};

    if (fullName) {
      // Tìm gần đúng họ tên (case-insensitive)
      residentWhere.fullName = { [Op.iLike]: `%${fullName}%` };
    }

    if (cccd) {
      // CCCD phải đúng 12 chữ số, duy nhất
      if (!/^\d{12}$/.test(cccd)) {
        return apiResponse.error(res, 'Số CCCD phải gồm 12 chữ số.');
      }
      residentWhere.cccd = cccd;
    }

    if (relation) {
      // Quan hệ với chủ hộ, ví dụ: Chủ hộ, Vợ, Con, Khác
      residentWhere.relation = relation;
    }

    // Nếu có mã hộ khẩu, cần join với bảng Household để lấy id
    let householdIds = null;
    if (householdCode) {
      const households = await Household.findAll({
        where: { code: householdCode },
        attributes: ['id'],
        raw: true,
      });
      if (households.length === 0) {
        // Không có hộ khẩu phù hợp
        return apiResponse.success(res, [], 'Không có kết quả phù hợp.');
      }
      householdIds = households.map(h => h.id);
      residentWhere.householdId = { [Op.in]: householdIds };
    }

    // Truy vấn nhân khẩu với điều kiện
    const residents = await Resident.findAll({
      where: residentWhere,
      include: [{
        model: Household,
        attributes: ['code', 'address'],
      }],
      order: [['fullName', 'ASC']],
    });

    if (residents.length === 0) {
      return apiResponse.success(res, [], 'Không có kết quả phù hợp.');
    }

    // Trả về danh sách kết quả
    return apiResponse.success(res, residents);

  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi truy vấn nhân khẩu: ' + error.message);
  }
};
