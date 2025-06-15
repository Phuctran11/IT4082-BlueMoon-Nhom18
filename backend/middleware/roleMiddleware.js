/**
 * Middleware kiểm tra vai trò user có được phép truy cập hay không
 * @param {Array<string>} allowedRoles - Mảng các vai trò được phép
 */
const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      let userRoles = req.user && req.user.roles;

      console.log('User roles raw:', userRoles);
      console.log('Allowed roles:', allowedRoles);

      // Nếu không có roles trong req.user => không có quyền
      if (!userRoles) {
        return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
      }

      // Nếu roles là chuỗi đơn => chuyển thành mảng chứa chuỗi đó
      if (typeof userRoles === 'string') {
        userRoles = [userRoles];
      }

      // Nếu roles là mảng object (vd: [{name: 'Admin'}, ...]) thì map lấy tên role
      if (Array.isArray(userRoles) && userRoles.length > 0 && typeof userRoles[0] === 'object') {
        userRoles = userRoles.map(roleObj => {
          // ưu tiên lấy thuộc tính name, nếu không có thì thử roleName, nếu không có thì lấy nguyên object (có thể lỗi)
          return roleObj.name || roleObj.roleName || roleObj;
        });
      }

      // Nếu sau xử lý roles không phải mảng => không có quyền
      if (!Array.isArray(userRoles)) {
        return res.status(403).json({ success: false, message: 'Không có quyền truy cập' });
      }

      // Kiểm tra xem user có ít nhất 1 role nằm trong allowedRoles không
      const hasRole = userRoles.some(role => allowedRoles.includes(role));

      if (!hasRole) {
        return res.status(403).json({ success: false, message: 'Không có quyền thực hiện hành động này' });
      }

      // Nếu có quyền thì cho phép tiếp tục
      next();
    } catch (error) {
      console.error('Role middleware error:', error);
      return res.status(500).json({ success: false, message: 'Lỗi máy chủ khi kiểm tra quyền' });
    }
  };
};

module.exports = roleMiddleware;
