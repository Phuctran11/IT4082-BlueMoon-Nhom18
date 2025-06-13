// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

// Thêm route gán quyền, chỉ Admin và Tổ trưởng/Phó được dùng
router.post(
  '/:userId/assign-role',
  authorize('Admin', 'Tổ trưởng', 'Tổ phó'),
  userController.assignRoleToUser
);

module.exports = router;