/*
    * hàm curd cho hộ khẩu
*/
const { Op, fn, col } = require('sequelize');
const Household = require('../models/Household');
const apiResponse = require('../utils/apiResponse');

exports.getAllHouseholds = async (req, res) => {
  try {
    const households = await Household.findAll();
    return apiResponse.success(res, households);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

exports.createHousehold = async (req, res) => {
  try {
    const { householdCode, headOfHousehold, address, memberCount, apartmentType } = req.body;

    const existing = await Household.findOne({ where: { householdCode } });
    if (existing) {
      return apiResponse.error(res, 'Mã hộ khẩu đã tồn tại', 400);
    }

    const household = await Household.create({
      householdCode,
      headOfHousehold,
      address,
      memberCount,
      apartmentType,
    });

    return apiResponse.success(res, household, 'Tạo hộ khẩu thành công', 201);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

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

exports.updateHousehold = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.householdCode) delete updateData.householdCode;

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

/**
 * Hàm thống kê hộ khẩu theo tiêu chí lọc:
 * - address (địa chỉ/khu vực)
 * - apartmentType (loại căn hộ)
 * - minMemberCount, maxMemberCount (số thành viên)
 */
exports.getHouseholdStatistics = async (req, res) => {
  try {
    const { address, apartmentType, minMemberCount, maxMemberCount } = req.query;

    let whereClause = {};

    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };
    }

    if (apartmentType) {
      whereClause.apartmentType = apartmentType;
    }

    if (minMemberCount || maxMemberCount) {
      whereClause.memberCount = {};
      if (minMemberCount) whereClause.memberCount[Op.gte] = parseInt(minMemberCount);
      if (maxMemberCount) whereClause.memberCount[Op.lte] = parseInt(maxMemberCount);
    }

    const stats = await Household.findAll({
      attributes: [
        'address',
        'apartmentType',
        [fn('COUNT', col('id')), 'householdCount'],
        [fn('SUM', col('memberCount')), 'totalMembers'],
      ],
      where: whereClause,
      group: ['address', 'apartmentType'],
      order: [['address', 'ASC'], ['apartmentType', 'ASC']],
      raw: true,
    });

    if (!stats.length) {
      return apiResponse.error(res, 'Không tìm thấy hộ khẩu nào phù hợp', 404);
    }

    return apiResponse.success(res, stats);
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi thống kê hộ khẩu: ' + error.message);
  }
};

/**
 * Tìm kiếm hộ khẩu theo nhiều tiêu chí:
 * - householdCode (mã hộ khẩu)
 * - headOfHousehold (tên chủ hộ)
 * - address (địa chỉ)
 * - apartmentType (loại căn hộ)
 * - minMemberCount, maxMemberCount (số thành viên)
 */

// Hàm truy vấn hộ khẩu theo nhiều tiêu chí
exports.searchHouseholds = async (req, res) => {
  try {
    const { householdCode, headOfHousehold, address, apartmentType, minMemberCount, maxMemberCount } = req.query;

    // Build điều kiện tìm kiếm
    let whereClause = {};

    if (householdCode) {
      // Mã hộ khẩu: chữ + số, không ký tự đặc biệt, tìm chính xác hoặc chứa
      // Ở đây giả sử tìm chứa (like) để linh hoạt
      whereClause.householdCode = { [Op.iLike]: `%${householdCode}%` };
    }

    if (headOfHousehold) {
      // Tên chủ hộ: không ký tự đặc biệt, tìm chứa
      whereClause.headOfHousehold = { [Op.iLike]: `%${headOfHousehold}%` };
    }

    if (address) {
      whereClause.address = { [Op.iLike]: `%${address}%` };
    }

    if (apartmentType) {
      whereClause.apartmentType = apartmentType;
    }

    if (minMemberCount || maxMemberCount) {
      whereClause.memberCount = {};
      if (minMemberCount) whereClause.memberCount[Op.gte] = parseInt(minMemberCount);
      if (maxMemberCount) whereClause.memberCount[Op.lte] = parseInt(maxMemberCount);
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
