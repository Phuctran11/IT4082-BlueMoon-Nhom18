const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');

/**
 * Phân quyền tài khoản người dùng
 * Body params:
 * - username (tên tài khoản, bắt buộc, không chứa ký tự đặc biệt)
 * - role (vai trò mới, bắt buộc, trong danh sách [Tổ trưởng, Tổ phó, Người dân])
 */
exports.assignRole = async (req, res) => {
  try {
    const { username, role } = req.body;

    // Kiểm tra bắt buộc
    if (!username || !role) {
      return apiResponse.error(res, 'Vui lòng chọn tài khoản và vai trò.');
    }

    // Kiểm tra username không chứa ký tự đặc biệt (chỉ cho phép chữ, số, gạch dưới)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return apiResponse.error(res, 'Tên tài khoản không hợp lệ (không chứa ký tự đặc biệt).');
    }

    // Kiểm tra role hợp lệ
    const validRoles = ['Tổ trưởng', 'Tổ phó', 'Người dân'];
    if (!validRoles.includes(role)) {
      return apiResponse.error(res, 'Vai trò không hợp lệ.');
    }

    // Tìm người dùng theo username
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return apiResponse.error(res, 'Tài khoản không tồn tại.');
    }

    // Cập nhật vai trò
    user.role = role;
    await user.save();

    return apiResponse.success(res, { role }, 'Phân quyền thành công.');

  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi phân quyền tài khoản: ' + error.message);
  }
};
