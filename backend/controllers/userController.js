// controllers/userController.js
const { User, Role } = require('../models');

// ... (các hàm getAllUsers, createUser giữ nguyên)

/**
 * Gán một vai trò cho một người dùng.
 */
exports.assignRoleToUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { roleId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
    }

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy vai trò này.' });
    }

    // Sử dụng phương thức đặc biệt của Sequelize
    await user.addRole(role);

    res.status(200).json({
      success: true,
      message: `Đã gán thành công vai trò "${role.name}" cho người dùng "${user.username}".`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server khi gán vai trò.', error: error.message });
  }
};