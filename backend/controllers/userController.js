const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const apiResponse = require('../utils/apiResponse');

/**
 * Phân quyền tài khoản người dùng
 * Body params:
 * - username (bắt buộc, không chứa ký tự đặc biệt)
 * - role (vai trò mới, bắt buộc, trong danh sách có trong bảng roles)
 */
exports.assignRole = async (req, res) => {
  try {
    const { username, role } = req.body;

    if (!username || !role) {
      return apiResponse.error(res, 'Vui lòng chọn tài khoản và vai trò.');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return apiResponse.error(res, 'Tên tài khoản không hợp lệ (không chứa ký tự đặc biệt).');
    }

    // Tìm user
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return apiResponse.error(res, 'Tài khoản không tồn tại.');
    }

    // Tìm role
    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      return apiResponse.error(res, 'Vai trò không tồn tại.');
    }

    // Xóa các role cũ của user (nếu muốn 1 role duy nhất)
    await UserRole.destroy({ where: { userId: user.id } });

    // Gán role mới
    await UserRole.create({ userId: user.id, roleId: roleRecord.id });

    return apiResponse.success(res, { role }, 'Phân quyền thành công.');

  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi phân quyền tài khoản: ' + error.message);
  }
};

// Lấy danh sách roles của user
exports.getUserRoles = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] },
      }],
    });
    if (!user) {
      return apiResponse.error(res, 'Không tìm thấy tài khoản', 404);
    }
    return apiResponse.success(res, user.roles);
  } catch (error) {
    return apiResponse.error(res, error.message);
  }
};
