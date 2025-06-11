const jwt = require('jsonwebtoken');

// Secret key dùng để ký token (nên lưu trong biến môi trường)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

/**
 * Tạo token JWT
 * @param {Object} payload - Dữ liệu muốn lưu trong token
 * @param {string} expiresIn - Thời gian hết hạn (vd: '1d', '2h')
 * @returns {string} token
 */
exports.generateToken = (payload, expiresIn = '1d') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify token JWT
 * @param {string} token
 * @returns {Object} decoded payload hoặc null nếu không hợp lệ
 */
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};