// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route quản lý user đều cần đăng nhập và có quyền hạn quản trị
router.use(protect);
router.use(authorize('Tổ trưởng', 'Tổ phó', 'Admin'));

// GET: Lấy danh sách tất cả người dùng
router.get('/', userController.getAllUsers);

// POST: Gán vai trò cho một người dùng
router.post('/:userId/assign-role', userController.assignRoleToUser);

// PATCH: Cập nhật trạng thái (Khóa/Mở khóa). Dùng PATCH vì đây là cập nhật một phần.
router.patch('/:userId/status', userController.updateUserStatus);

// DELETE: Xóa mềm một người dùng
router.delete('/:userId', userController.deleteUser);

module.exports = router;