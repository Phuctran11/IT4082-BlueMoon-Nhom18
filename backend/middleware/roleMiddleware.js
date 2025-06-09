/**
 * Middleware kiểm tra vai trò user có được phép truy cập hay không
 * @param {Array<string>} allowedRoles - Mảng các vai trò được phép
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
      }

      // Kiểm tra vai trò user có nằm trong allowedRoles không
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ success: false, message: 'KKhông có quyền thực hiện hành động này' });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi kiểm tra quyền' });
    }
  };
};

module.exports = roleMiddleware;
