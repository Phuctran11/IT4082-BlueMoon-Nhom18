const { Op, fn, col } = require('sequelize');
const { Household } = require('../models');
const apiResponse = require('../utils/apiResponse');

// Lấy tất cả hộ khẩu
exports.getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.findAll();
    return apiResponse.success(res, households);
  } catch (error) {
    console.error(error);
    return apiResponse.error(res, error.message);
  }
};

// Tạo hộ khẩu mới
exports.createHousehold = async (req, res) => {
  try {
    const { apartmentCode, ownerId, area, status, address, apartmentType, memberCount } = req.body;

    const existing = await Household.findOne({ where: { apartmentCode } });
    if (existing) {
      return apiResponse.error(res, 'Mã căn hộ đã tồn tại', 400);
    }

    const household = await Household.create({ apartmentCode, ownerId, area, status, address, apartmentType, memberCount });

    return apiResponse.success(res, household, 'Tạo hộ khẩu thành công', 201);
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return apiResponse.error(res, error.message);
  }
};

// Cập nhật hộ khẩu
exports.updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Không cho cập nhật apartmentCode
    if (updateData.apartmentCode) delete updateData.apartmentCode;

    const household = await Household.findByPk(id);
    if (!household) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu', 404);
    }

    await household.update(updateData);

    return apiResponse.success(res, household, 'Cập nhật hộ khẩu thành công');
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return apiResponse.error(res, error.message);
  }
};

// Thống kê hộ khẩu theo điều kiện (đồng bộ với validate query)
exports.getHouseholdStatistics = async (req, res) => {
  try {
    const { address, apartmentType, minMemberCount, maxMemberCount } = req.query;

    let whereClause = {};

    if (address) whereClause.address = { [Op.iLike]: `%${address}%` };
    if (apartmentType) whereClause.apartmentType = apartmentType;

    if (minMemberCount || maxMemberCount) {
      whereClause.memberCount = {};
      const minCount = parseInt(minMemberCount);
      const maxCount = parseInt(maxMemberCount);
      if (!isNaN(minCount)) whereClause.memberCount[Op.gte] = minCount;
      if (!isNaN(maxCount)) whereClause.memberCount[Op.lte] = maxCount;
    }

    const stats = await Household.findAll({
      attributes: [
        'apartmentType',
        [fn('COUNT', col('id')), 'householdCount'],
        [fn('SUM', col('memberCount')), 'totalMembers'],
      ],
      where: whereClause,
      group: ['apartmentType'],
      raw: true,
    });

    if (!stats.length) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu phù hợp', 404);
    }

    return apiResponse.success(res, stats);
  } catch (error) {
    console.error(error);
    return apiResponse.error(res, 'Lỗi khi thống kê hộ khẩu: ' + error.message);
  }
};

// Truy vấn hộ khẩu theo nhiều tiêu chí (nếu cần)
exports.searchHouseholds = async (req, res) => {
  try {
    const { apartmentCode, ownerId, status, minArea, maxArea } = req.query;

    let whereClause = {};

    if (apartmentCode) {
      whereClause.apartmentCode = { [Op.iLike]: `%${apartmentCode}%` };
    }

    if (ownerId) whereClause.ownerId = ownerId;

    if (status) whereClause.status = status;

    if (minArea || maxArea) {
      whereClause.area = {};
      const minA = parseFloat(minArea);
      const maxA = parseFloat(maxArea);
      if (!isNaN(minA)) whereClause.area[Op.gte] = minA;
      if (!isNaN(maxA)) whereClause.area[Op.lte] = maxA;
    }

    const households = await Household.findAll({ where: whereClause });

    if (!households.length) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu nào.', 404);
    }

    return apiResponse.success(res, households);
  } catch (error) {
    console.error(error);
    return apiResponse.error(res, 'Lỗi khi truy vấn hộ khẩu: ' + error.message);
  }
};
