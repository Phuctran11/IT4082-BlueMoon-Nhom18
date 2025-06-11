const { Op, fn, col } = require('sequelize');
const Household = require('../models/Household');
const apiResponse = require('../utils/apiResponse');

// Lấy tất cả hộ khẩu
exports.getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.findAll();
    return apiResponse.success(res, households);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Tạo hộ khẩu mới
exports.createHousehold = async (req, res) => {
  try {
    const { apartmentCode, ownerId, area, status } = req.body;

    // Kiểm tra mã căn hộ trùng
    const existing = await Household.findOne({ where: { apartmentCode } });
    if (existing) {
      return apiResponse.error(res, 'Mã căn hộ đã tồn tại', 400);
    }

    const household = await Household.create({
      apartmentCode,
      ownerId,
      area,
      status,
    });

    return apiResponse.success(res, household, 'Tạo hộ khẩu thành công', 201);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Lấy hộ khẩu theo id
exports.getHouseholdById = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findByPk(id);
    if (!household) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu', 404);
    }
    return apiResponse.success(res, household);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Cập nhật hộ khẩu
exports.updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Không cho cập nhật apartmentCode
    if (updateData.apartmentCode) delete updateData.apartmentCode;

    const household = await Household.findByPk(id);
    if (!household) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu', 404);
    }

    await household.update(updateData);

    return apiResponse.success(res, household, 'Cập nhật hộ khẩu thành công');
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Xóa hộ khẩu
exports.deleteHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const household = await Household.findByPk(id);
    if (!household) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu', 404);
    }

    await household.destroy();

    return apiResponse.success(res, null, 'Xóa hộ khẩu thành công');
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Thống kê hộ khẩu theo điều kiện (ví dụ theo status, diện tích, ...)
exports.getHouseholdStatistics = async (req, res) => {
  try {
    const { status, minArea, maxArea } = req.query;

    let whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (minArea || maxArea) {
      whereClause.area = {};
      if (minArea) whereClause.area[Op.gte] = parseFloat(minArea);
      if (maxArea) whereClause.area[Op.lte] = parseFloat(maxArea);
    }

    const stats = await Household.findAll({
      attributes: [
        'status',
        [fn('COUNT', col('id')), 'householdCount'],
        [fn('SUM', col('area')), 'totalArea'],
      ],
      where: whereClause,
      group: ['status'],
      raw: true,
    });

    if (!stats.length) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu phù hợp', 404);
    }

    return apiResponse.success(res, stats);
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi thống kê hộ khẩu: ' + error.message);
  }
};

// Truy vấn hộ khẩu theo nhiều tiêu chí
exports.searchHouseholds = async (req, res) => {
  try {
    const { apartmentCode, ownerId, status, minArea, maxArea } = req.query;

    let whereClause = {};

    if (apartmentCode) {
      whereClause.apartmentCode = { [Op.iLike]: `%${apartmentCode}%` };
    }

    if (ownerId) {
      whereClause.ownerId = ownerId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (minArea || maxArea) {
      whereClause.area = {};
      if (minArea) whereClause.area[Op.gte] = parseFloat(minArea);
      if (maxArea) whereClause.area[Op.lte] = parseFloat(maxArea);
    }

    const households = await Household.findAll({ where: whereClause });

    if (!households.length) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu nào.', 404);
    }

    return apiResponse.success(res, households);
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi truy vấn hộ khẩu: ' + error.message);
  }
};
