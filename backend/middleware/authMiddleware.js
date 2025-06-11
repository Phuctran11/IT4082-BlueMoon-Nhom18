const jwtUtils = require('../utils/jwtUtils');

const authMiddleware = (req, res, next) => {
  try {
    // Lấy token từ header Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Không có token xác thực' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwtUtils.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc hết hạn' });
    }

    // Gắn thông tin user decoded vào req để dùng tiếp
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc hết hạn' });
  }
};

module.exports = authMiddleware;