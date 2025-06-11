const bcrypt = require('bcrypt');
const User = require('../models/User');
const Role = require('../models/Role');
const UserRole = require('../models/UserRole');
const jwtUtils = require('../utils/jwtUtils');
const apiResponse = require('../utils/apiResponse');

/**
 * Đăng nhập user, trả về token JWT kèm roles
 * Body params:
 * - username
 * - password
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return apiResponse.error(res, 'Vui lòng nhập tên tài khoản và mật khẩu');
    }

    // Tìm user theo username
    const user = await User.findOne({
      where: { username },
      include: [{
        model: Role,
        as: 'roles',
        through: { attributes: [] },
      }],
    });

    if (!user) {
      return apiResponse.error(res, 'Tài khoản hoặc mật khẩu không đúng', 401);
    }

    // Kiểm tra mật khẩu
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return apiResponse.error(res, 'Tài khoản hoặc mật khẩu không đúng', 401);
    }

    // Lấy danh sách role name
    const roles = user.roles.map(r => r.name);

    // Tạo payload cho token
    const payload = {
      id: user.id,
      username: user.username,
      roles,
    };

    // Tạo token JWT (thời gian hết hạn 1 ngày)
    const token = jwtUtils.generateToken(payload, '1d');

    return apiResponse.success(res, { token, user: { id: user.id, username: user.username, roles } }, 'Đăng nhập thành công');
  } catch (error) {
    return apiResponse.error(res, 'Lỗi khi đăng nhập: ' + error.message);
  }
};