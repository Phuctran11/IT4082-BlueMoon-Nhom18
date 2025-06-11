const Role = require('../models/Role');
const apiResponse = require('../utils/apiResponse');

// Lấy danh sách tất cả vai trò
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    return apiResponse.success(res, roles);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Tạo vai trò mới
exports.createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return apiResponse.error(res, 'Tên vai trò là bắt buộc.');
    }

    // Kiểm tra trùng tên vai trò
    const existing = await Role.findOne({ where: { name } });
    if (existing) {
      return apiResponse.error(res, 'Tên vai trò đã tồn tại.', 400);
    }

    const role = await Role.create({ name, description });

    return apiResponse.success(res, role, 'Tạo vai trò thành công', 201);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Cập nhật vai trò
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findByPk(id);
    if (!role) {
      return apiResponse.error(res, 'Không tìm thấy vai trò', 404);
    }

    if (name && name !== role.name) {
      // Kiểm tra tên mới có trùng không
      const exists = await Role.findOne({ where: { name } });
      if (exists) {
        return apiResponse.error(res, 'Tên vai trò đã tồn tại.', 400);
      }
    }

    await role.update({ name, description });

    return apiResponse.success(res, role, 'Cập nhật vai trò thành công');
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};

// Xóa vai trò
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByPk(id);
    if (!role) {
      return apiResponse.error(res, 'Không tìm thấy vai trò', 404);
    }

    await role.destroy();

    return apiResponse.success(res, null, 'Xóa vai trò thành công');
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};
