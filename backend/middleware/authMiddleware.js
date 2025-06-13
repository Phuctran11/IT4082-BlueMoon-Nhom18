const jwtUtils = require('../utils/jwtUtils');
const User = require('../models/User');
const Role = require('../models/Role');


const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtUtils.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc hết hạn' });
    }

    // Lấy thông tin user từ DB, kèm roles
    const user = await User.findOne({
      where: { id: decoded.id }, // giả sử token lưu id user trong decoded.id
      include: [{
        model: Role,
        attributes: ['name'],
        through: { attributes: [] },
      }],
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Người dùng không tồn tại' });
    }

    // Chuẩn hóa roles thành mảng chuỗi
    const roles = user.Roles ? user.Roles.map(r => r.name) : [];

    // Gán thông tin user và roles vào req.user
    req.user = {
      id: user.id,
      username: user.username,
      roles,
    };

    next();
  } catch (error) {
    console.error('authMiddleware error:', error);
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

module.exports = authMiddleware;