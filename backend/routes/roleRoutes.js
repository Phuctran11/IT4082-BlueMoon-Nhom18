// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/authMiddleware');
router.use(protect);

router.use(authorize('Tổ trưởng', 'Tổ phó')); // Chỉ cho phép các vai trò có quyền quản lý vai trò mới được truy cập
// Chỉ cần đăng nhập là có thể lấy danh sách vai trò
router.get('/', roleController.getAllRoles);

router.post('/', roleController.createRole);
router.put('/:id', roleController.updateRole);
router.delete('/:id', roleController.deleteRole);
// Chỉ cho phép các vai trò có quyền quản lý vai trò mới được truy cập

module.exports = router;
