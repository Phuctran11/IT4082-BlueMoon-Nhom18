const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Tất cả các route thống kê đều yêu cầu phải đăng nhập
router.use(protect);

// Route cho thống kê hộ khẩu, chỉ Tổ trưởng, Tổ phó, và Admin được truy cập
router.get(
  '/households',
  authorize('Tổ trưởng', 'Tổ phó', 'Admin'),
  statisticsController.getHouseholdStats
);

// (Trong tương lai, bạn có thể thêm các route thống kê khác ở đây)
// router.get('/residents', authorize(...), statisticsController.getResidentStats);

module.exports = router;