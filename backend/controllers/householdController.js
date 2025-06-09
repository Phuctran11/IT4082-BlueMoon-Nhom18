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
